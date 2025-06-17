import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { FleetVehicleWithFiscalizationUnlinkDto } from '@data-access';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { StorageFiltersKey } from '@ui/core/services/storage.service';
import {
  FleetVehicleListComponent,
  LinkCashierToVehiclePayload,
} from '@ui/modules/fleet-profile/features/fleet-rro/components/fleet-vehicle-list/fleet-vehicle-list.component';
import { fleetRROActions, vehiclesFiscalization } from '@ui/modules/fleet-profile/features/fleet-rro/store';
import { EmptyStateComponent } from '@ui/shared/components/empty-state/empty-state.component';
import { EmptyStates } from '@ui/shared/components/empty-state/empty-states';
import { FiltersContainerComponent } from '@ui/shared/components/filters-container/filters-container.component';
import { paginationActions } from '@ui/shared/components/pagination/store/pagination.actions';
import { getPagination } from '@ui/shared/components/pagination/store/pagination.selectors';
import { PaginationDto } from '@ui/shared/models';
import { ICONS } from '@ui/shared/tokens';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { distinctUntilChanged, filter } from 'rxjs/operators';

interface VehicleFilter {
  licencePlate: string;
}

@Component({
  selector: 'upf-fleet-vehicles-container',
  standalone: true,
  imports: [
    CommonModule,
    FleetVehicleListComponent,
    FiltersContainerComponent,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatSuffix,
    ReactiveFormsModule,
    TranslateModule,
    EmptyStateComponent,
  ],
  templateUrl: './fleet-vehicles-container.component.html',
  styleUrl: './fleet-vehicles-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FleetVehiclesContainerComponent implements OnInit {
  public readonly emptyState = EmptyStates;
  public readonly filterKey = StorageFiltersKey.RRO_VEHICLE_LIST;
  public filtersForm = new FormGroup({
    licencePlate: new FormControl<string>(''),
  });

  public readonly icons = inject(ICONS);
  public readonly store = inject(Store);
  public readonly destroyRef = inject(DestroyRef);

  public readonly vehicles$ = this.store.select(vehiclesFiscalization);
  private readonly filtersChange$ = new BehaviorSubject<VehicleFilter>(null);
  private readonly pagination$ = this.store
    .select(getPagination)
    .pipe(distinctUntilChanged((a: PaginationDto, b: PaginationDto) => a.offset === b.offset));

  public ngOnInit(): void {
    this.handleVehiclesRequest();
  }

  public onFiltersChange(filters: VehicleFilter): void {
    this.store.dispatch(paginationActions.clearState());
    this.filtersChange$.next(filters);
  }

  public openLinkCashierToVehicleModal(data: LinkCashierToVehiclePayload): void {
    this.store.dispatch(fleetRROActions.openLinkCashToVehicleModal({ ...data }));
  }

  public openUnLinkCashierToVehicleModal(data: FleetVehicleWithFiscalizationUnlinkDto): void {
    this.store.dispatch(fleetRROActions.openUnLinkCashFromVehicleModal({ ...data }));
  }

  private handleVehiclesRequest(): void {
    combineLatest([this.pagination$, this.filtersChange$.pipe(filter(Boolean))])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([{ offset, limit }, { licencePlate }]: [PaginationDto, VehicleFilter]) => {
        this.store.dispatch(fleetRROActions.getFleetVehicles({ query: { limit, offset, licencePlate } }));
      });
  }
}
