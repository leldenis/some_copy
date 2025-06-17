import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommissionProgramType } from '@constant';
import {
  CommissionProgramsDto,
  DriverCommissionProgramsFiltersDto,
  DriverCommissionProgramsQueryDto,
  FleetAnalyticsEventType,
  FleetDataDto,
} from '@data-access';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { LoadingIndicatorService } from '@ui/core/services/loading-indicator.service';
import { StorageFiltersKey, StorageService, userRoleKey } from '@ui/core/services/storage.service';
import { DriverPlannedCommissionProgramsListComponent } from '@ui/modules/bonuses/components/driver-planned-commission-programs-list/driver-planned-commission-programs-list.component';
import { CommissionProgramsService } from '@ui/modules/bonuses/services/commission-programs.service';
import { DriversAutocompleteComponent } from '@ui/shared';
import { EmptyStateComponent } from '@ui/shared/components/empty-state/empty-state.component';
import { EmptyStates } from '@ui/shared/components/empty-state/empty-states';
import { FiltersContainerComponent } from '@ui/shared/components/filters-container/filters-container.component';
import { DEFAULT_LIMIT } from '@ui/shared/consts';
import { finalize, map, tap } from 'rxjs';

import { ScrolledDirectiveModule } from '@uklon/fleets/angular/cdk';

@Component({
  selector: 'upf-driver-planned-commission-programs',
  standalone: true,
  imports: [
    CommonModule,
    FiltersContainerComponent,
    FormsModule,
    DriversAutocompleteComponent,
    ReactiveFormsModule,
    DriverPlannedCommissionProgramsListComponent,
    ScrolledDirectiveModule,
    EmptyStateComponent,
  ],
  templateUrl: './driver-planned-commission-programs.component.html',
  styleUrl: './driver-planned-commission-programs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriverPlannedCommissionProgramsComponent {
  public readonly fleetData = input.required<FleetDataDto>();

  public readonly filterKey = StorageFiltersKey.DRIVER_PLANNED_COMMISSION_PROGRAMS;
  public readonly emptyState = EmptyStates;

  public readonly filtersForm = new FormGroup({
    driver_id: new FormControl<string>(''),
  });

  public readonly plannedPrograms = signal<CommissionProgramsDto[]>([]);
  public readonly isLoading = signal(false);
  public readonly hasNext = signal(false);
  public readonly offset = signal(0);

  private readonly storage = inject(StorageService);
  private readonly loadingIndicatorService = inject(LoadingIndicatorService);
  private readonly commissionProgramsService = inject(CommissionProgramsService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly analytics = inject(AnalyticsService);

  public onFiltersChange(filters: DriverCommissionProgramsFiltersDto): void {
    this.offset.set(0);
    this.getCommissionPrograms(filters);

    if (filters.driver_id?.length > 0) {
      this.reportAnalytics(FleetAnalyticsEventType.COMMISSION_PROGRAMS_DRIVER_FILTER, filters.driver_id);
    }
  }

  public onLoadNext(): void {
    if (!this.hasNext() || this.isLoading()) {
      return;
    }

    this.getCommissionPrograms(this.filtersForm.getRawValue(), true);
  }

  public resetFiltersForm(): void {
    this.filtersForm.reset();
    this.reportAnalytics(FleetAnalyticsEventType.COMMISSION_PROGRAMS_DRIVER_FILTER_CLEAR);
    this.storage.set(StorageFiltersKey.DRIVER_PLANNED_COMMISSION_PROGRAMS, null);
  }

  public reportAnalytics(event: FleetAnalyticsEventType, driverId?: string): void {
    this.analytics.reportEvent(event, {
      ...(driverId && { driver_id: driverId }),
      user_access: this.storage.get(userRoleKey),
      active_tab: this.storage.get(StorageFiltersKey.DRIVER_ACTIVE_COMMISSION_TAB),
    });
  }

  private getCommissionPrograms(filters: DriverCommissionProgramsFiltersDto, loadMore = false): void {
    this.isLoading.set(true);

    if (loadMore) {
      this.offset.set(this.offset() + DEFAULT_LIMIT);
    }

    const query: DriverCommissionProgramsQueryDto = {
      fleet_id: this.fleetData().id,
      region_id: this.fleetData().region_id,
      offset: this.offset(),
      limit: DEFAULT_LIMIT,
      driver_id: filters?.driver_id || '',
    };

    this.loadingIndicatorService.show();
    this.commissionProgramsService
      .getDriverCommissionPrograms(query, CommissionProgramType.PLANNED)
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
        this.plannedPrograms.set(loadMore ? [...this.plannedPrograms(), ...items] : items);
      });
  }
}
