import { AsyncPipe, KeyValuePipe, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatAnchor } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { BlockedListStatusValue, BodyType } from '@constant';
import {
  AnalyticsUserRole,
  AnalyticsVehicleDriver,
  AnalyticsVehicleFilter,
  AnalyticsVehicleFiltersDto,
  FleetAnalyticsEventType,
  FleetVehicleDto,
  FleetVehicleFilterDto,
} from '@data-access';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { StorageFiltersKey, StorageService, userRoleKey } from '@ui/core/services/storage.service';
import { getVehicleBrandingPeriodAvailable } from '@ui/core/store/account/account.selectors';
import { getBodyTypes } from '@ui/core/store/references/references.selectors';
import { VehicleListComponent } from '@ui/modules/vehicles/features/vehicles/components/vehicle-list/vehicle-list.component';
import { VehiclePaths } from '@ui/modules/vehicles/models/vehicle-paths';
import { isVehiclesCollectionError, vehicles, vehiclesActions } from '@ui/modules/vehicles/store';
import { MAT_FORM_FIELD_IMPORTS, MAT_SELECT_IMPORTS } from '@ui/shared';
import { EmptyStateComponent } from '@ui/shared/components/empty-state/empty-state.component';
import { EmptyStates } from '@ui/shared/components/empty-state/empty-states';
import {
  FiltersActionButtonDirective,
  FiltersContainerComponent,
} from '@ui/shared/components/filters-container/filters-container.component';
import { paginationActions } from '@ui/shared/components/pagination/store/pagination.actions';
import { getPagination } from '@ui/shared/components/pagination/store/pagination.selectors';
import { UnlinkDriverVehicleComponent } from '@ui/shared/dialogs/unlink-driver-vehicle/unlink-driver-vehicle.component';
import { PaginationDto } from '@ui/shared/models/pagination.dto';
import { ICONS } from '@ui/shared/tokens/icons.token';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';

type FilterKey = keyof FleetVehicleFilterDto;
const BRANDING_PRIORITY_OPTIONS = {
  All: '',
  False: false,
  True: true,
} as const;

@Component({
  selector: 'upf-vehicles-wrap',
  standalone: true,
  imports: [
    MAT_FORM_FIELD_IMPORTS,
    MAT_SELECT_IMPORTS,
    VehicleListComponent,
    EmptyStateComponent,
    AsyncPipe,
    NgTemplateOutlet,
    MatIcon,
    RouterLink,
    MatAnchor,
    FiltersActionButtonDirective,
    TranslateModule,
    ReactiveFormsModule,
    KeyValuePipe,
    FiltersContainerComponent,
    MatInput,
  ],
  templateUrl: './vehicles-wrap.component.html',
  styleUrls: ['./vehicles-wrap.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehiclesWrapComponent implements OnInit, OnDestroy {
  @Input() public fleetId: string;

  public filterValue: FleetVehicleFilterDto;
  public readonly vehiclePaths = VehiclePaths;
  public readonly filterKey = StorageFiltersKey.VEHICLE_LIST;
  public readonly emptyStatesRef = EmptyStates;
  public readonly brandingPriorityOptions = BRANDING_PRIORITY_OPTIONS;
  public filtersForm = new FormGroup({
    licencePlate: new FormControl<string>(''),
    hasPriority: new FormControl<boolean | ''>(''),
    hasBranding: new FormControl<boolean | ''>(''),
    bodyType: new FormControl<BodyType | ''>(''),
    status: new FormControl<BlockedListStatusValue>(BlockedListStatusValue.ALL),
  });

  public readonly icons = inject(ICONS);
  public readonly store = inject(Store);
  public readonly matDialog = inject(MatDialog);
  public readonly analytics = inject(AnalyticsService);
  public readonly storage = inject(StorageService);

  public readonly showVehicleBrandingPeriod$ = this.store.select(getVehicleBrandingPeriodAvailable);
  public readonly vehicles$ = this.store.select(vehicles);
  public readonly bodyTypes$ = this.store.select(getBodyTypes);
  public readonly hasError$ = this.store.select(isVehiclesCollectionError);
  public readonly blockStatuses = [BlockedListStatusValue.ALL, BlockedListStatusValue.BLOCKED];

  private readonly userRole: string = this.storage.get(userRoleKey);
  private readonly destroyed$ = new Subject<void>();
  private readonly filtersChange$ = new BehaviorSubject<FleetVehicleFilterDto>(null);
  private readonly pagination$ = this.store
    .select(getPagination)
    .pipe(distinctUntilChanged((a: PaginationDto, b: PaginationDto) => a.offset === b.offset));

  public ngOnInit(): void {
    this.handleVehiclesRequest();
  }

  public ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  public onUnlinkVehicle(vehicle: FleetVehicleDto, fleetId: string): void {
    this.reportUnlinkVehicle(FleetAnalyticsEventType.VEHICLES_UNLINK_VEHICLE, vehicle);

    const dialogRef = this.matDialog.open(UnlinkDriverVehicleComponent, {
      disableClose: true,
      panelClass: 'confirmation-modal',
      autoFocus: false,
      data: { placeholder: vehicle.driver?.fullName, type: 'driver' },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        const payload = { vehicleId: vehicle.id, fleetId };
        this.store.dispatch(vehiclesActions.releaseFleetVehicleById(payload));
        this.reportUnlinkVehicle(FleetAnalyticsEventType.VEHICLES_UNLINK_VEHICLE_CONFIRMED, vehicle);
      } else {
        this.reportUnlinkVehicle(FleetAnalyticsEventType.VEHICLES_UNLINK_VEHICLE_CANCELED, vehicle);
      }
    });
  }

  public onFiltersChange(filters: FleetVehicleFilterDto): void {
    this.store.dispatch(paginationActions.clearState());
    this.filtersChange$.next(filters);
    this.reportFiltersChanges(filters);
  }

  public onAddVehicle(): void {
    this.analytics.reportEvent<AnalyticsUserRole>(FleetAnalyticsEventType.VEHICLES_ADD_VEHICLE, {
      user_access: this.userRole,
    });
  }

  private handleVehiclesRequest(): void {
    combineLatest([this.pagination$, this.filtersChange$.pipe(filter(Boolean))])
      .pipe(takeUntil(this.destroyed$))
      .subscribe(([{ offset, limit }, filters]: [PaginationDto, FleetVehicleFilterDto]) => {
        const { licencePlate, hasBranding, hasPriority, bodyType, status } = filters;

        this.store.dispatch(
          vehiclesActions.getFleetVehicles({
            offset,
            limit,
            licencePlate,
            hasPriority,
            hasBranding,
            bodyType,
            status: status === BlockedListStatusValue.ALL ? null : status,
          }),
        );
      });
  }

  private reportUnlinkVehicle(eventType: FleetAnalyticsEventType, vehicle: FleetVehicleDto): void {
    this.analytics.reportEvent<AnalyticsVehicleDriver>(eventType, {
      vehicle_id: vehicle.id,
      driver_id: vehicle.driver?.id || '',
      user_access: this.userRole,
    });
  }

  private reportFiltersChanges(newFilters: FleetVehicleFilterDto): void {
    if (this.filterValue) {
      const changedProperties = (Object.keys(newFilters) as FilterKey[]).filter(
        (key: FilterKey) => newFilters[key] !== this.filterValue[key],
      );
      if (changedProperties.length === 0) return;

      changedProperties.forEach((changedProp) => {
        const { eventType, property } = this.detectChangedFilterProperty(changedProp);
        if (!eventType || !property) return;

        this.analytics.reportEvent<AnalyticsVehicleFilter>(eventType, {
          user_access: this.userRole,
          [property]: newFilters[changedProp],
        });
      });
    }

    this.filterValue = newFilters;
  }

  private detectChangedFilterProperty(key: FilterKey): {
    eventType: FleetAnalyticsEventType;
    property: keyof AnalyticsVehicleFiltersDto;
  } {
    switch (key) {
      case 'licencePlate':
        return { eventType: FleetAnalyticsEventType.VEHICLES_LICENSE_PLATE_FILTER, property: 'licence_plate' };
      case 'hasBranding':
        return { eventType: FleetAnalyticsEventType.VEHICLES_BRANDING_FILTER, property: 'branding' };
      case 'hasPriority':
        return { eventType: FleetAnalyticsEventType.VEHICLES_PRIORITY_FILTER, property: 'priority' };
      case 'bodyType':
        return { eventType: FleetAnalyticsEventType.VEHICLES_BODY_TYPE_FILTER, property: 'bodyType' };
      case 'status':
        return { eventType: FleetAnalyticsEventType.VEHICLES_STATUS_FILTER, property: 'status' };
      default:
        return null;
    }
  }
}
