import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { CommissionProgramType } from '@constant';
import {
  CommissionProgramsDto,
  FleetAnalyticsEventType,
  FleetDataDto,
  VehicleCommissionProgramsFiltersDto,
  VehiclesCommissionProgramsQueryDto,
} from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { LoadingIndicatorService } from '@ui/core/services/loading-indicator.service';
import { StorageFiltersKey, StorageService, userRoleKey } from '@ui/core/services/storage.service';
import { VehicleArchivedCommissionProgramsListComponent } from '@ui/modules/bonuses/components/vehicle-archived-commission-programs-list/vehicle-archived-commission-programs-list.component';
import { CommissionProgramsService } from '@ui/modules/bonuses/services/commission-programs.service';
import { EmptyStateComponent } from '@ui/shared/components/empty-state/empty-state.component';
import { EmptyStates } from '@ui/shared/components/empty-state/empty-states';
import { FiltersContainerComponent } from '@ui/shared/components/filters-container/filters-container.component';
import { VehicleAutocompleteComponent } from '@ui/shared/components/vehicle-autocomplete/vehicle-autocomplete.component';
import { DEFAULT_LIMIT } from '@ui/shared/consts';
import { ICONS } from '@ui/shared/tokens';
import { finalize, tap } from 'rxjs';
import { map } from 'rxjs/operators';

import { ScrolledDirectiveModule } from '@uklon/fleets/angular/cdk';

@Component({
  selector: 'upf-vehicle-archived-commission-programs',
  standalone: true,
  imports: [
    FiltersContainerComponent,
    ReactiveFormsModule,
    VehicleAutocompleteComponent,
    VehicleArchivedCommissionProgramsListComponent,
    ScrolledDirectiveModule,
    MatIcon,
    TranslateModule,
    NgTemplateOutlet,
    EmptyStateComponent,
  ],
  templateUrl: './vehicle-archived-commission-programs.component.html',
  styleUrl: './vehicle-archived-commission-programs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleArchivedCommissionProgramsComponent {
  public readonly fleetData = input.required<FleetDataDto>();

  public readonly filterKey = StorageFiltersKey.VEHICLE_ARCHIVED_COMMISSION_PROGRAMS;
  public readonly emptyState = EmptyStates;

  public readonly filtersForm = new FormGroup({
    vehicle_id: new FormControl<string>(''),
  });

  public readonly archivedPrograms = signal<CommissionProgramsDto[]>([]);
  public readonly isLoading = signal(false);
  public readonly hasNext = signal(false);
  public readonly offset = signal(0);

  private readonly storage = inject(StorageService);
  private readonly loadingIndicatorService = inject(LoadingIndicatorService);
  private readonly commissionProgramsService = inject(CommissionProgramsService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly analytics = inject(AnalyticsService);
  public readonly icons = inject(ICONS);

  public onFiltersChange(filters: VehicleCommissionProgramsFiltersDto): void {
    this.offset.set(0);
    this.getArchivedCommissionPrograms(filters);

    if (filters.vehicle_id?.length > 0) {
      this.reportAnalytics(
        FleetAnalyticsEventType.VEHICLE_COMMISSION_PROGRAMS_LICENCE_PLATE_FILTER,
        filters.vehicle_id,
      );
    }
  }

  public onLoadNext(): void {
    if (!this.hasNext() || this.isLoading()) {
      return;
    }

    this.getArchivedCommissionPrograms(this.filtersForm.getRawValue(), true);
  }

  public resetFiltersForm(): void {
    this.filtersForm.reset();
    this.reportAnalytics(FleetAnalyticsEventType.VEHICLE_COMMISSION_PROGRAMS_LICENCE_FILTER_CLEAR);
    this.storage.set(StorageFiltersKey.VEHICLE_ACTIVE_COMMISSION_PROGRAMS, null);
  }

  private getArchivedCommissionPrograms(filters: VehicleCommissionProgramsFiltersDto, loadMore = false): void {
    this.isLoading.set(true);

    if (loadMore) {
      this.offset.set(this.offset() + DEFAULT_LIMIT);
    }

    const queryParams: VehiclesCommissionProgramsQueryDto = {
      fleet_id: this.fleetData().id,
      region_id: this.fleetData().region_id,
      offset: this.offset(),
      limit: DEFAULT_LIMIT,
      ...(filters?.vehicle_id && { vehicle_id: filters?.vehicle_id }),
    };

    this.loadingIndicatorService.show();

    this.commissionProgramsService
      .getVehicleCommissionPrograms(queryParams, CommissionProgramType.ARCHIVED)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(({ has_more_items }) => {
          this.hasNext.set(has_more_items);
        }),
        map(({ items }) => items),
        finalize(() => {
          this.isLoading.set(false);
          this.loadingIndicatorService.hide();
        }),
      )
      .subscribe((items) => {
        this.archivedPrograms.set(loadMore ? [...this.archivedPrograms(), ...items] : items);
      });
  }

  private reportAnalytics(event: FleetAnalyticsEventType, vehicleId?: string): void {
    this.analytics.reportEvent(event, {
      ...(vehicleId && { vehicle_id: vehicleId }),
      user_access: this.storage.get(userRoleKey),
      active_tab: this.storage.get(StorageFiltersKey.VEHICLE_ACTIVE_COMMISSION_TAB),
    });
  }
}
