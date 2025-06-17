import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, Input, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOption } from '@angular/material/autocomplete';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { TicketStatus } from '@constant';
import {
  AnalyticsDriverPhotoControl,
  DateRangeDto,
  DriverPhotoControlQueryParamsDto,
  DriverPhotoControlTicketItemDto,
  FleetAnalyticsEventType,
  getCurrentWeek,
} from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { StorageFiltersKey, StorageService, userRoleKey } from '@ui/core/services/storage.service';
import { DriverPhotoControlListComponent } from '@ui/modules/drivers/components/drivers-photo-control-list/driver-photo-control-list.component';
import { DriverPhotoControlService } from '@ui/modules/drivers/services/driver-photo-control.service';
import { DateTimeRangeControlComponent, UIService } from '@ui/shared';
import { EmptyStateComponent } from '@ui/shared/components/empty-state/empty-state.component';
import { EmptyStates } from '@ui/shared/components/empty-state/empty-states';
import { FiltersContainerComponent } from '@ui/shared/components/filters-container/filters-container.component';
import { DEFAULT_LIMIT } from '@ui/shared/consts';
import { ICONS } from '@ui/shared/tokens';
import { finalize, map, tap } from 'rxjs';

import { ScrolledDirectiveModule } from '@uklon/fleets/angular/cdk';

interface PhotoControlFilters {
  period: DateRangeDto;
  phone: string;
  status: TicketStatus;
}

interface AnalyticsData {
  ticketId?: string;
  start_date?: number;
  end_date?: number;
  filter?: string;
  filter_value?: string;
}

@Component({
  selector: 'upf-drivers-photo-control-container',
  standalone: true,
  imports: [
    CommonModule,
    FiltersContainerComponent,
    FormsModule,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    MatSuffix,
    ReactiveFormsModule,
    TranslateModule,
    DriverPhotoControlListComponent,
    ScrolledDirectiveModule,
    EmptyStateComponent,
    DateTimeRangeControlComponent,
  ],
  templateUrl: './drivers-photo-control-container.component.html',
  styleUrl: './drivers-photo-control-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriversPhotoControlContainerComponent implements OnInit {
  @Input() public fleetId: string;

  public readonly analyticsEventType = FleetAnalyticsEventType;
  public readonly emptyState = EmptyStates;
  public readonly filterKey = StorageFiltersKey.DRIVERS_PHOTO_CONTROL;
  public readonly ticketStatus = TicketStatus;
  public readonly filtersGroup = new FormGroup({
    period: new FormControl<DateRangeDto>(getCurrentWeek()),
    phone: new FormControl<string>(''),
    status: new FormControl<TicketStatus>(TicketStatus.ALL),
  });

  public readonly icons = inject(ICONS);
  public readonly driverPhotoControlService = inject(DriverPhotoControlService);
  public readonly uiService = inject(UIService);
  public readonly destroyRef = inject(DestroyRef);
  public readonly analytics = inject(AnalyticsService);
  public readonly storage = inject(StorageService);

  public isMobileView$ = this.uiService.breakpointMatch();

  public readonly tickets = signal<DriverPhotoControlTicketItemDto[]>([]);
  public readonly isLoading = signal(false);
  public readonly hasNext = signal(false);

  private cursor = 0;
  private readonly limit = DEFAULT_LIMIT;

  public ngOnInit(): void {
    this.reportAnalytics(FleetAnalyticsEventType.DRIVERS_PHOTO_CONTROL_LIST_SCREEN);
  }

  public onFiltersChange(filters: PhotoControlFilters): void {
    if (!filters) {
      return;
    }

    this.getDriversPhotoControlTickets(filters);
  }

  public onLoadNext(): void {
    if (!this.hasNext() || this.isLoading()) {
      return;
    }

    this.getDriversPhotoControlTickets(this.filtersGroup.getRawValue(), true);
  }

  public reportAnalytics(event: FleetAnalyticsEventType, data?: AnalyticsData): void {
    this.analytics.reportEvent<AnalyticsDriverPhotoControl>(event, {
      user_access: this.storage.get(userRoleKey),
      page: 'Drivers photo control list',
      ...(data?.ticketId && { ticket_id: data.ticketId }),
      ...(data?.start_date && { start_date: data.start_date }),
      ...(data?.end_date && { end_date: data.end_date }),
      ...(data?.filter && { filter: data.filter }),
      ...(data?.filter_value && { filter_value: data.filter_value }),
    });
  }

  public reportPeriodFilter(period: DateRangeDto): void {
    this.reportAnalytics(FleetAnalyticsEventType.DRIVER_PHOTO_CONTROL_PERIOD_FILTER, {
      start_date: period?.from,
      end_date: period?.to,
    });
  }

  public reportByFilter(filter: 'phone' | 'status', value: string, event?: Event): void {
    const target = event?.target as HTMLInputElement;
    this.reportAnalytics(FleetAnalyticsEventType.DRIVER_PHOTO_CONTROL_FILTER, {
      filter,
      filter_value: value || target?.value,
    });
  }

  private getDriversPhotoControlTickets(
    { period: { from, to }, ...filters }: PhotoControlFilters,
    loadMore = false,
  ): void {
    this.isLoading.set(true);
    this.cursor = loadMore ? this.cursor : 0;

    const params: DriverPhotoControlQueryParamsDto = {
      from,
      to,
      ...filters,
      limit: this.limit,
      cursor: this.cursor,
    };

    this.driverPhotoControlService
      .getDriversPhotoControlTickets(this.fleetId, params)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(({ next_cursor }) => {
          this.hasNext.set(!!Number(next_cursor));
          this.cursor = Number(next_cursor);
        }),
        map(({ items }) => items),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe((items) => {
        const updatedTickets = loadMore ? [...this.tickets(), ...items] : items;
        this.tickets.set(updatedTickets);
      });
  }
}
