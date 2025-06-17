import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { AsyncPipe, Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BlockedListStatusReason,
  BlockedListStatusValue,
  EntityType,
  PhotoSize,
  TicketStatus,
  VehicleAccessType,
} from '@constant';
import {
  FleetDto,
  FleetVehicleCashierPosDto,
  RemoveReasonDto,
  VehicleBrandingPeriodDto,
  VehicleDetailsPhotoControlDto,
  VehiclePhotoControlTicketDto,
} from '@data-access';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { AccountState } from '@ui/core/store/account/account.reducer';
import {
  getSelectedFleet,
  getRROAvailable,
  getVehicleBrandingPeriodAvailable,
} from '@ui/core/store/account/account.selectors';
import { DriversState } from '@ui/modules/drivers/store/drivers/drivers.reducer';
import { VehicleBrandingPeriodPanelComponent } from '@ui/modules/vehicles/features/vehicle-details/components/vehicle-branding-period-panel/vehicle-branding-period-panel.component';
import { VehicleDetailsInfoComponent } from '@ui/modules/vehicles/features/vehicle-details/components/vehicle-details-info/vehicle-details-info.component';
import { VehicleDetailsTabsComponent } from '@ui/modules/vehicles/features/vehicle-details/components/vehicle-details-tabs/vehicle-details-tabs.component';
import { VehiclePhotoControlPanelComponent } from '@ui/modules/vehicles/features/vehicle-details/components/vehicle-photo-control-panel/vehicle-photo-control-panel.component';
import { TicketsService } from '@ui/modules/vehicles/services/tickets.service';
import { VehiclesService } from '@ui/modules/vehicles/services/vehicles.service';
import { vehiclesActions } from '@ui/modules/vehicles/store/vehicles/vehicles.actions';
import { VehiclesEffects } from '@ui/modules/vehicles/store/vehicles/vehicles.effects';
import { VehiclesState } from '@ui/modules/vehicles/store/vehicles/vehicles.reducer';
import * as vehiclesSelectors from '@ui/modules/vehicles/store/vehicles/vehicles.selectors';
import { vehicleCashPointOfSale } from '@ui/modules/vehicles/store/vehicles/vehicles.selectors';
import { UIService } from '@ui/shared';
import { RemoveEntityComponent } from '@ui/shared/dialogs/remove-entity';
import { UnlinkDriverVehicleComponent } from '@ui/shared/dialogs/unlink-driver-vehicle/unlink-driver-vehicle.component';
import { DefaultImgSrcDirective } from '@ui/shared/directives/default-img-src/default-img-src.directive';
import { InfoPanelComponent } from '@ui/shared/modules/info-panel/components/info-panel/info-panel.component';
import { InfoPanelIconDirective, InfoPanelTitleDirective } from '@ui/shared/modules/info-panel/directives';
import { EnvironmentModel } from '@ui-env/environment.model';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { Observable, of } from 'rxjs';
import { filter, first, map, shareReplay, switchMap, tap } from 'rxjs/operators';

import { APP_CONFIG } from '@uklon/angular-core';

@Component({
  selector: 'upf-vehicle-details-page',
  standalone: true,
  imports: [
    AsyncPipe,
    InfiniteScrollDirective,
    DefaultImgSrcDirective,
    InfoPanelComponent,
    MatIcon,
    TranslateModule,
    VehiclePhotoControlPanelComponent,
    VehicleBrandingPeriodPanelComponent,
    VehicleDetailsInfoComponent,
    VehicleDetailsTabsComponent,
    InfoPanelTitleDirective,
    InfoPanelIconDirective,
  ],
  templateUrl: './vehicle-details-page.component.html',
  styleUrls: ['./vehicle-details-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleDetailsPageComponent implements OnInit, OnDestroy {
  public vehicle$ = this.store.select(vehiclesSelectors.getFleetVehicleDetails).pipe(
    shareReplay(1),
    tap((ticket) => {
      this.brandingPeriod.set(ticket?.branding_period);
    }),
  );

  public avatar$ = this.store.select(vehiclesSelectors.getFleetVehiclePhotos).pipe(
    filter((photos) => coerceBooleanProperty(photos)),
    map((photos) => {
      const front = photos.vehicle_angled_front ?? photos.driver_car_front_photo;

      if (!front) {
        return null;
      }

      return {
        url: this.domSanitizer.bypassSecurityTrustUrl(front.url),
        fallbackUrl: this.domSanitizer.bypassSecurityTrustUrl(front.fallback_url),
      };
    }),
  );
  public fleet$ = this.store.select(getSelectedFleet).pipe(
    filter(Boolean),
    tap((fleet: FleetDto) => {
      const vehicleId = this.route.snapshot.paramMap.get('vehicleId');
      this.store.dispatch(
        vehiclesActions.getFleetVehicleById({
          fleetId: fleet.id,
          vehicleId,
        }),
      );
      this.store.dispatch(
        vehiclesActions.getFleetVehiclePhotos({
          fleetId: fleet.id,
          vehicleId,
          image_size: PhotoSize.SMALL,
        }),
      );
      this.fleetId = fleet.id;
    }),
  );

  public isMobileView$: Observable<boolean> = this.uiService.breakpointMatch();
  public accessType$: Observable<VehicleAccessType> = this.vehicle$.pipe(
    filter(Boolean),
    switchMap(({ id }) => this.vehicleService.getFleetVehicleAccessSettings(this.fleetId, id)),
    map(({ access_type }) => access_type),
  );
  public photoControl$: Observable<VehiclePhotoControlTicketDto> = this.vehicle$.pipe(
    filter(Boolean),
    first(),
    switchMap(({ photo_control }) => this.getPhotoControlTicket(photo_control)),
  );

  public readonly rroAvailable$ = this.store.select(getRROAvailable);
  public readonly vehiclePointOfSale$ = this.store.select(vehicleCashPointOfSale);
  public readonly showVehicleBrandingPeriod$ = this.store.select(getVehicleBrandingPeriodAvailable);

  public readonly vehicleBlockedListStatus = BlockedListStatusValue;
  public readonly vehicleListStatusReason = BlockedListStatusReason;
  public readonly brandingPeriod = signal<VehicleBrandingPeriodDto>(null);

  public readonly appConfig = inject<EnvironmentModel>(APP_CONFIG);

  private fleetId: string;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly store: Store<VehiclesState | DriversState | AccountState>,
    private readonly matDialog: MatDialog,
    private readonly domSanitizer: DomSanitizer,
    private readonly vehiclesEffects: VehiclesEffects,
    private readonly location: Location,
    private readonly router: Router,
    private readonly uiService: UIService,
    private readonly vehicleService: VehiclesService,
    private readonly ticketsService: TicketsService,
    private readonly destroyRef: DestroyRef,
  ) {
    this.uiService.setConfig({
      header: {
        title: false,
        branding: false,
        backNavigationButton: true,
        hideTitleOnMobile: true,
        customTitle: 'Header.Title.VehicleDetails',
      },
    });
  }

  public ngOnInit(): void {
    this.vehiclesEffects.deleteFleetVehicleByIdSuccess$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.navigateBack());
  }

  public ngOnDestroy(): void {
    this.uiService.resetConfig();
    this.store.dispatch(vehiclesActions.clearVehicleDetailsPage());
  }

  public handleDelete(id: string, licensePlate: string): void {
    const dialogRef = this.matDialog.open(RemoveEntityComponent, {
      disableClose: true,
      panelClass: 'confirmation-modal',
      autoFocus: false,
      data: { placeholder: licensePlate, type: EntityType.VEHICLE },
    });

    dialogRef
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe((body: RemoveReasonDto) => {
        const payload = { vehicleId: id, fleetId: this.fleetId, body };
        this.store.dispatch(vehiclesActions.deleteFleetVehicleById(payload));
      });
  }

  public handleUnlink(unlinkData: { id: string; placeholder: string }): void {
    const dialogRef = this.matDialog.open(UnlinkDriverVehicleComponent, {
      disableClose: true,
      panelClass: 'confirmation-modal',
      autoFocus: false,
      data: { placeholder: unlinkData.placeholder, type: 'driver' },
    });

    dialogRef
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => {
        const payload = { vehicleId: unlinkData.id, fleetId: this.fleetId };
        this.store.dispatch(vehiclesActions.releaseFleetVehicleById(payload));
      });
  }

  public handlerUnlinkCashPoint(point: FleetVehicleCashierPosDto): void {
    this.store.dispatch(vehiclesActions.openUnlinkCashPointFromVehicleModal({ point }));
  }

  public navigateBack(): void {
    if (this.router.navigated) {
      this.location.back();
    } else {
      this.router.navigate(['../'], { relativeTo: this.route });
    }
  }

  public onTicketSent(): void {
    this.brandingPeriod.set({ ...this.brandingPeriod(), status: TicketStatus.SENT });
  }

  private getPhotoControlTicket(photoControl: VehicleDetailsPhotoControlDto): Observable<VehiclePhotoControlTicketDto> {
    return photoControl ? this.ticketsService.getFleetVehiclePhotoControlTicket(photoControl.ticket_id) : of(null);
  }
}
