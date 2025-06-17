/* eslint-disable no-return-assign */
import { AsyncPipe, KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { TicketStatus } from '@constant';
import { DateRangeDto, getCurrentWeek, VehiclePhotoControlTicketItemDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { StorageFiltersKey } from '@ui/core/services/storage.service';
import { VehiclesPhotoControlListComponent } from '@ui/modules/vehicles/features/vehilce-photo-control-list/components/vehicles-photo-control-list/vehicles-photo-control-list.component';
import { TicketsService } from '@ui/modules/vehicles/services/tickets.service';
import { DateTimeRangeControlComponent, MAT_FORM_FIELD_IMPORTS, MAT_SELECT_IMPORTS } from '@ui/shared';
import { EmptyStateComponent } from '@ui/shared/components/empty-state/empty-state.component';
import { EmptyStates } from '@ui/shared/components/empty-state/empty-states';
import { FiltersContainerComponent } from '@ui/shared/components/filters-container/filters-container.component';
import { ICONS } from '@ui/shared/tokens';
import { BehaviorSubject, finalize, map, tap } from 'rxjs';

import { ScrolledDirectiveModule } from '@uklon/fleets/angular/cdk';

interface PhotoControlFilters {
  period: DateRangeDto;
  licensePlate: string;
  status: TicketStatus | '';
}

@Component({
  selector: 'upf-vehicle-photo-control-list-container',
  standalone: true,
  imports: [
    MAT_FORM_FIELD_IMPORTS,
    MAT_SELECT_IMPORTS,
    FiltersContainerComponent,
    ReactiveFormsModule,
    TranslateModule,
    DateTimeRangeControlComponent,
    MatInput,
    MatIcon,
    KeyValuePipe,
    VehiclesPhotoControlListComponent,
    AsyncPipe,
    ScrolledDirectiveModule,
    EmptyStateComponent,
  ],
  templateUrl: './vehicle-photo-control-list-container.component.html',
  styleUrls: ['./vehicle-photo-control-list-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehiclePhotoControlListContainerComponent {
  @Input() public fleetId: string;

  public readonly emptyState = EmptyStates;
  public readonly filterKey = StorageFiltersKey.PHOTO_CONTROL;
  public readonly ticketStatus = TicketStatus;
  public readonly filtersGroup = new FormGroup({
    period: new FormControl<DateRangeDto>(getCurrentWeek()),
    licensePlate: new FormControl<string>(''),
    status: new FormControl<TicketStatus | ''>(''),
  });

  public readonly filtersChange$ = new BehaviorSubject<PhotoControlFilters>(null);
  public readonly tickets$ = new BehaviorSubject<VehiclePhotoControlTicketItemDto[]>(null);

  private isLoading = false;
  private cursor = 0;
  private hasNext: boolean;
  private readonly limit = 30;
  private readonly activeStatuses = new Set<TicketStatus>([TicketStatus.DRAFT, TicketStatus.CLARIFICATION]);

  public readonly icons = inject(ICONS);
  private readonly ticketsService = inject(TicketsService);

  public onFiltersChange(filters: PhotoControlFilters): void {
    this.getVehiclesTickets(filters);
  }

  public onLoadNext(): void {
    if (!this.hasNext || this.isLoading) return;
    this.getVehiclesTickets(this.filtersGroup.getRawValue(), true);
  }

  private getVehiclesTickets(filters: PhotoControlFilters, loadMore = false): void {
    this.isLoading = true;
    this.cursor = loadMore ? this.cursor : 0;

    this.ticketsService
      .getFleetVehiclesPhotoControlTickets(this.fleetId, { ...filters, cursor: this.cursor, limit: this.limit })
      .pipe(
        tap(({ next_cursor }) => {
          this.hasNext = !!Number(next_cursor);
          this.cursor = Number(next_cursor);
        }),
        map(({ items }) => items),
        finalize(() => (this.isLoading = false)),
      )
      .subscribe((items) => {
        const tickets = loadMore ? [...this.tickets$.value, ...items] : items;
        this.tickets$.next(tickets);
      });
  }
}
