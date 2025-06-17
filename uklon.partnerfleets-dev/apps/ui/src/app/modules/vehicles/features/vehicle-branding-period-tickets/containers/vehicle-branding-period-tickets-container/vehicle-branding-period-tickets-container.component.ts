import { AsyncPipe, KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, OnInit, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatOption } from '@angular/material/autocomplete';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { TicketStatus } from '@constant';
import {
  DateRangeDto,
  getCurrentWeek,
  VehicleBrandingPeriodTicketItemDto,
  VehicleBrandingPeriodTicketQueryParamsDto,
} from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { StorageFiltersKey } from '@ui/core/services/storage.service';
import {
  VehicleBrandingMonthlyCodeComponent,
  VehicleBrandingPeriodTicketsListComponent,
} from '@ui/modules/vehicles/features/vehicle-branding-period-tickets/components';
import { TicketsService } from '@ui/modules/vehicles/services/tickets.service';
import { CheckboxSelectAllComponent, DateTimeRangeControlComponent, UIService } from '@ui/shared';
import { EmptyStateComponent } from '@ui/shared/components/empty-state/empty-state.component';
import { EmptyStates } from '@ui/shared/components/empty-state/empty-states';
import { FiltersContainerComponent } from '@ui/shared/components/filters-container/filters-container.component';
import { DEFAULT_LIMIT } from '@ui/shared/consts';
import { ICONS } from '@ui/shared/tokens';
import { finalize, map, tap } from 'rxjs';

import { ScrolledDirectiveModule } from '@uklon/fleets/angular/cdk';

interface VehicleBrandingPeriodFilters {
  period: DateRangeDto;
  license_plate: string;
  status: TicketStatus[];
}

@Component({
  selector: 'upf-vehicle-branding-period-tickets-container',
  standalone: true,
  imports: [
    FiltersContainerComponent,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatOption,
    MatSuffix,
    MatSelect,
    ReactiveFormsModule,
    TranslateModule,
    VehicleBrandingPeriodTicketsListComponent,
    CheckboxSelectAllComponent,
    VehicleBrandingMonthlyCodeComponent,
    ScrolledDirectiveModule,
    KeyValuePipe,
    AsyncPipe,
    EmptyStateComponent,
    DateTimeRangeControlComponent,
  ],
  templateUrl: './vehicle-branding-period-tickets-container.component.html',
  styleUrl: './vehicle-branding-period-tickets-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleBrandingPeriodTicketsContainerComponent implements OnInit {
  public readonly filesUploadingCount = output<number>();
  public readonly fleetId = input.required<string>();

  public readonly emptyState = EmptyStates;
  public readonly filterKey = StorageFiltersKey.VEHICLE_BRANDING_PERIOD;
  public readonly ticketStatus = TicketStatus;
  public readonly ticketStatusAvailable = Object.values(TicketStatus).filter((status) => status !== TicketStatus.ALL);

  public readonly filtersForm = new FormGroup({
    period: new FormControl<DateRangeDto>(getCurrentWeek()),
    license_plate: new FormControl<string>(''),
    status: new FormControl<TicketStatus[]>([]),
  });

  public readonly monthlyCode = signal<string>(null);
  public readonly tickets = signal<VehicleBrandingPeriodTicketItemDto[]>([]);
  public readonly isLoading = signal<boolean>(false);
  public readonly hasNext = signal<boolean>(false);
  public readonly uploadCount = signal<number>(0);

  private readonly cursor = signal<number>(0);

  public readonly icons = inject(ICONS);
  private readonly ticketsService = inject(TicketsService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly uiService = inject(UIService);

  public isMobileView$ = this.uiService.breakpointMatch();

  public ngOnInit(): void {
    this.getVehicleBrandingMonthlyCode();
  }

  public onFiltersChange(filters: VehicleBrandingPeriodFilters): void {
    if (!filters) {
      return;
    }

    this.getVehicleBrandingPeriodTickets(filters);
  }

  public onLoadNext(): void {
    if (!this.hasNext() || this.isLoading()) {
      return;
    }

    this.getVehicleBrandingPeriodTickets(this.filtersForm.getRawValue(), true);
  }

  public updateUploadCount(count: number): void {
    this.uploadCount.set(count);
    this.filesUploadingCount.emit(count);
  }

  public onTicketSent(ticketId: string): void {
    const index = this.tickets().findIndex(({ id }) => id === ticketId);
    if (index < 0) return;

    const updatedTicket = { ...this.tickets()[index], status: TicketStatus.SENT };
    const ticketsCopy = structuredClone(this.tickets());

    ticketsCopy.splice(index, 1, updatedTicket);
    this.tickets.set(ticketsCopy);
  }

  private getVehicleBrandingPeriodTickets(
    { period: { from, to }, ...filters }: VehicleBrandingPeriodFilters,
    loadMore = false,
  ): void {
    this.isLoading.set(true);

    if (!loadMore) {
      this.cursor.set(0);
    }

    const params: VehicleBrandingPeriodTicketQueryParamsDto = {
      from,
      to,
      ...filters,
      limit: DEFAULT_LIMIT,
      cursor: this.cursor(),
    };

    this.ticketsService
      .getFleetVehiclesBrandingPeriodTickets(this.fleetId(), params)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(({ next_cursor }) => {
          this.hasNext.set(!!Number(next_cursor));
          this.cursor.set(Number(next_cursor));
        }),
        map(({ items }) => items),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe((items) => {
        const updatedTickets = loadMore ? [...this.tickets(), ...items] : items;
        this.tickets.set(updatedTickets);
      });
  }

  private getVehicleBrandingMonthlyCode(): void {
    this.ticketsService
      .getVehicleBrandingMonthlyCode()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((code) => {
        this.monthlyCode.set(code);
      });
  }
}
