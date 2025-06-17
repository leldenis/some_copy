import { NgTemplateOutlet } from '@angular/common';
import { HttpStatusCode } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatAnchor } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import {
  DriverOrderFilterDto,
  FleetAnalyticsEventType,
  FleetDriversItemDto,
  PaginationCollectionDto,
} from '@data-access';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { DriverService } from '@ui/core';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { AccountState } from '@ui/core/store/account/account.reducer';
import { AppState } from '@ui/core/store/app.state';
import { DriverFilterComponent } from '@ui/modules/drivers/components/driver-filter/driver-filter.component';
import { DriverListComponent } from '@ui/modules/drivers/components/drivers-list/driver-list.component';
import { DriversFilterDto } from '@ui/modules/drivers/models/drivers-filter.dto';
import { DriversState } from '@ui/modules/drivers/store/drivers/drivers.reducer';
import { vehiclesActions } from '@ui/modules/vehicles/store/vehicles/vehicles.actions';
import { VehiclesState } from '@ui/modules/vehicles/store/vehicles/vehicles.reducer';
import { removeEmptyParams } from '@ui/shared';
import { EmptyStateComponent } from '@ui/shared/components/empty-state/empty-state.component';
import { EmptyStates } from '@ui/shared/components/empty-state/empty-states';
import { paginationActions } from '@ui/shared/components/pagination/store/pagination.actions';
import { PaginationState } from '@ui/shared/components/pagination/store/pagination.reducer';
import { getPagination } from '@ui/shared/components/pagination/store/pagination.selectors';
import { DriverFiltersDetailsDialogComponent } from '@ui/shared/dialogs/driver-filters-details/driver-filters-details-dialog.component';
import { UnlinkDriverVehicleComponent } from '@ui/shared/dialogs/unlink-driver-vehicle/unlink-driver-vehicle.component';
import { EnvironmentModel } from '@ui-env/environment.model';
import { BehaviorSubject, combineLatest, Observable, of, switchMap } from 'rxjs';
import { catchError, distinctUntilChanged, filter, tap } from 'rxjs/operators';

import { APP_CONFIG } from '@uklon/angular-core';

type DriversContainerState = AppState | DriversState | AccountState | PaginationState | VehiclesState;

@Component({
  selector: 'upf-drivers-container',
  standalone: true,
  imports: [
    DriverFilterComponent,
    NgTemplateOutlet,
    DriverListComponent,
    EmptyStateComponent,
    MatIcon,
    TranslateModule,
    MatAnchor,
  ],
  templateUrl: './drivers-container.component.html',
  styleUrls: ['./drivers-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriversContainerComponent implements OnInit {
  public readonly fleetId = input.required<string>();
  public readonly regionId = input.required<number>();

  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  private readonly driversService = inject(DriverService);
  private readonly analyticsService = inject(AnalyticsService);
  private readonly store = inject<Store<DriversContainerState>>(Store);
  private readonly appConfig = inject<EnvironmentModel>(APP_CONFIG);

  private readonly filters$ = new BehaviorSubject<DriversFilterDto>(null);
  private readonly pagination$ = this.store
    .select(getPagination)
    .pipe(distinctUntilChanged((a, b) => a.offset === b.offset));

  public readonly emptyState = EmptyStates;
  public readonly registrationLink = this.appConfig?.externalLinks?.registration;
  public readonly failedToGetDrivers = signal(false);
  public readonly drivers = toSignal(this.getDrivers());

  public ngOnInit(): void {
    this.analyticsService.reportEvent(FleetAnalyticsEventType.DRIVERS_LIST_SCREEN);
  }

  public onFiltersChange(filters: DriversFilterDto): void {
    this.store.dispatch(paginationActions.clearState());
    this.filters$.next(filters);
  }

  public onUnlinkVehicle({ id, placeholder }: { id: string; placeholder: string }): void {
    const dialogRef = this.dialog.open(UnlinkDriverVehicleComponent, {
      disableClose: true,
      panelClass: 'confirmation-modal',
      autoFocus: false,
      data: { placeholder, type: 'vehicle' },
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter(Boolean),
        tap(() =>
          this.store.dispatch(vehiclesActions.releaseFleetVehicleById({ vehicleId: id, fleetId: this.fleetId() })),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  public getDriverActiveFilters(driverId: string): void {
    this.driversService
      .getDriverActiveFilters(this.fleetId(), driverId, this.regionId())
      .pipe(
        switchMap(({ order_filters }) => this.openFiltersDialog(order_filters, driverId)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  private openFiltersDialog(data: DriverOrderFilterDto[], driverId: string): Observable<void> {
    this.analyticsService.reportEvent(FleetAnalyticsEventType.DRIVER_FILTERS_DETAILS_CLICK, {
      fleet_id: this.fleetId(),
      driver_id: driverId,
      page: 'drivers_list',
    });

    return this.dialog.open(DriverFiltersDetailsDialogComponent, { autoFocus: false, data }).afterClosed();
  }

  private getDrivers(): Observable<PaginationCollectionDto<FleetDriversItemDto>> {
    return combineLatest([this.pagination$, this.filters$.pipe(filter(Boolean))]).pipe(
      switchMap(([{ offset, limit }, filters]) => {
        return this.driversService
          .getFleetDrivers(this.fleetId(), removeEmptyParams(filters), limit, offset, this.regionId())
          .pipe(
            catchError(({ status }) => {
              this.failedToGetDrivers.set(status !== HttpStatusCode.BadRequest);
              return of(null);
            }),
          );
      }),
      takeUntilDestroyed(this.destroyRef),
    );
  }
}
