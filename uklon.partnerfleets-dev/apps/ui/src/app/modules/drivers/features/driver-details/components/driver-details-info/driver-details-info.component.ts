import { AsyncPipe, DatePipe, LowerCasePipe, UpperCasePipe } from '@angular/common';
import { Component, ChangeDetectionStrategy, OnInit, DestroyRef, input, output, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { BlockedListStatusReason, PhotoSize } from '@constant';
import {
  FleetDriverDto,
  FleetDto,
  KarmaGroupDto,
  DateRangeDto,
  FleetAnalyticsEventType,
  AnalyticsDriverBase,
  DriverDenyListDto,
  DriverRestrictionDto,
  DriverPhotoControlTicketDto,
  RemoveCashLimitRestrictionWithResetDto,
} from '@data-access';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DriverService } from '@ui/core';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { StorageService, userRoleKey } from '@ui/core/services/storage.service';
import { ToastService } from '@ui/core/services/toast.service';
import { AppState } from '@ui/core/store/app.state';
import { ADDITIONAL_DRIVER_INFO_REGIONS } from '@ui/modules/drivers/consts';
import { DriverCurrentVehicleComponent } from '@ui/modules/drivers/features/driver-details/components/driver-current-vehicle/driver-current-vehicle.component';
import { DriverDenyListComponent } from '@ui/modules/drivers/features/driver-details/components/driver-deny-list/driver-deny-list.component';
import { DriverKarmaComponent } from '@ui/modules/drivers/features/driver-details/components/driver-karma/driver-karma.component';
import { DriverPaymentInfoComponent } from '@ui/modules/drivers/features/driver-details/components/driver-payment-info/driver-payment-info.component';
import { DriverPhotoControlPanelComponent } from '@ui/modules/drivers/features/driver-details/components/driver-photo-control-panel/driver-photo-control-panel.component';
import { RemoveCashLimitRestrictionDialogComponent } from '@ui/modules/drivers/features/driver-details/dialogs';
import { driversActions } from '@ui/modules/drivers/store';
import { DriversState } from '@ui/modules/drivers/store/drivers/drivers.reducer';
import {
  denyList,
  driverRestrictions,
  getFleetDriverAvatar,
} from '@ui/modules/drivers/store/drivers/drivers.selectors';
import { VehiclesState } from '@ui/modules/vehicles/store/vehicles/vehicles.reducer';
import { getFleetVehicleAvatar } from '@ui/modules/vehicles/store/vehicles/vehicles.selectors';
import { FullNamePipe } from '@ui/shared';
import { ExpandableInfoComponent } from '@ui/shared/components/expandable-info/expandable-info.component';
import { DefaultImgSrcDirective } from '@ui/shared/directives/default-img-src/default-img-src.directive';
import { InfoPanelComponent } from '@ui/shared/modules/info-panel/components/info-panel/info-panel.component';
import { InfoPanelIconDirective, InfoPanelTitleDirective } from '@ui/shared/modules/info-panel/directives';
import { EmployeeDelayedRestrictionPanelComponent } from '@ui/shared/modules/restrictions-shared/components/employee-delayed-restriction-panel/employee-delayed-restriction-panel.component';
import { EmployeeRestrictionPanelComponent } from '@ui/shared/modules/restrictions-shared/components/employee-restriction-panel/employee-restriction-panel.component';
import { Id2ColorPipe } from '@ui/shared/pipes/id-2-color/id-2-color.pipe';
import { EnvironmentModel } from '@ui-env/environment.model';
import { filter, map, Observable, switchMap, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { APP_CONFIG, UklAngularCoreModule } from '@uklon/angular-core';

@Component({
  selector: 'upf-driver-details-info',
  standalone: true,
  imports: [
    AsyncPipe,
    DefaultImgSrcDirective,
    UklAngularCoreModule,
    Id2ColorPipe,
    FullNamePipe,
    DriverKarmaComponent,
    InfoPanelComponent,
    InfoPanelIconDirective,
    MatIcon,
    InfoPanelTitleDirective,
    TranslateModule,
    DriverPhotoControlPanelComponent,
    EmployeeDelayedRestrictionPanelComponent,
    EmployeeRestrictionPanelComponent,
    ExpandableInfoComponent,
    DatePipe,
    LowerCasePipe,
    UpperCasePipe,
    MatDivider,
    DriverPaymentInfoComponent,
    DriverCurrentVehicleComponent,
    DriverDenyListComponent,
    MatButton,
    MatIconButton,
  ],
  templateUrl: './driver-details-info.component.html',
  styleUrls: ['./driver-details-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriverDetailsInfoComponent implements OnInit {
  private readonly store = inject(Store<AppState | DriversState | VehiclesState>);
  private readonly analytics = inject(AnalyticsService);
  private readonly storage = inject(StorageService);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  private readonly driverService = inject(DriverService);
  private readonly toastsService = inject(ToastService);
  private readonly translateService = inject(TranslateService);

  public readonly selectedFleet = input<FleetDto>();
  public readonly driver = input.required<FleetDriverDto>();
  public readonly isDriverBlocked = input.required<boolean>();
  public readonly karmaGroupRanges = input.required<KarmaGroupDto<DateRangeDto>>();
  public readonly photoControl = input.required<DriverPhotoControlTicketDto>();

  public readonly deleteDriver = output();
  public readonly unlinkVehicle = output();

  public readonly additionalDriverInfoRegions = ADDITIONAL_DRIVER_INFO_REGIONS;
  public readonly analyticsEvent: typeof FleetAnalyticsEventType = FleetAnalyticsEventType;
  public readonly driverListStatusReason = BlockedListStatusReason;
  public readonly appConfig = inject<EnvironmentModel>(APP_CONFIG);

  public readonly denyList$: Observable<DriverDenyListDto> = this.store.select(denyList);
  public readonly driverAvatar$ = this.store.select(getFleetDriverAvatar).pipe(filter(Boolean));
  public readonly vehicleAvatar$ = this.store.select(getFleetVehicleAvatar).pipe(filter(Boolean));
  public readonly restrictions$: Observable<DriverRestrictionDto[]> = this.store.select(driverRestrictions).pipe(
    filter(Boolean),
    map((items) => items.filter(({ fleet_id }) => !fleet_id || fleet_id === this.selectedFleet().id)),
  );

  public ngOnInit(): void {
    this.store.dispatch(
      driversActions.getFleetDriverPhotos({ driverId: this.driver().id, image_size: PhotoSize.SMALL }),
    );
    this.store.dispatch(driversActions.getFleetDriverDenyList({ driverId: this.driver().id }));
    this.getDriverRestrictions();
  }

  public onDeleteDriver(): void {
    this.deleteDriver.emit();
  }

  public unlink(): void {
    this.unlinkVehicle.emit();
  }

  public reportKarmaEvent(eventType: FleetAnalyticsEventType): void {
    this.analytics.reportEvent<AnalyticsDriverBase>(eventType, {
      user_access: this.storage.get(userRoleKey) || '',
      driver_id: this.driver().id,
    });
  }

  public onClearDenyList(): void {
    this.store.dispatch(driversActions.clearFleetDriverDenyList({ driverId: this.driver().id }));
  }

  public onRemoveCashLimitRestriction(): void {
    this.dialog
      .open(RemoveCashLimitRestrictionDialogComponent)
      .afterClosed()
      .pipe(
        filter(Boolean),
        switchMap((result) => this.deleteCashLimitRestriction(result)),
        tap(() => this.getDriverRestrictions()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  private deleteCashLimitRestriction(result: RemoveCashLimitRestrictionWithResetDto): Observable<void> {
    return this.driverService
      .deleteCashLimitRestrictionForDriver(this.selectedFleet().id, this.driver().id, result)
      .pipe(
        catchError((error) => {
          this.toastsService.error(this.translateService.instant('Common.Error.TryLater'));
          return throwError(() => error);
        }),
      );
  }

  private getDriverRestrictions(): void {
    this.store.dispatch(
      driversActions.getFleetDriverRestrictions({ fleetId: this.selectedFleet().id, driverId: this.driver().id }),
    );
  }
}
