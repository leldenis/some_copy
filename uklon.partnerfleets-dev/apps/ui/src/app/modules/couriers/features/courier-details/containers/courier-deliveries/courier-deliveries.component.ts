import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { CourierDeliveriesQueryDto, CourierDeliveryItemDto, DateRangeQuery, getCurrentWeek } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { StorageFiltersKey } from '@ui/core/services/storage.service';
import { CourierDeliveriesListComponent } from '@ui/modules/couriers/features/courier-details/containers/courier-deliveries-list/courier-deliveries-list.component';
import { OrdersService } from '@ui/modules/orders/services';
import { DateTimeRangeControlComponent, ProgressSpinnerComponent } from '@ui/shared';
import { EmptyStateComponent } from '@ui/shared/components/empty-state/empty-state.component';
import { EmptyStates } from '@ui/shared/components/empty-state/empty-states';
import { FiltersContainerComponent } from '@ui/shared/components/filters-container/filters-container.component';
import { BehaviorSubject } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';

import { toServerDate } from '@uklon/angular-core';
import { ScrolledDirectiveModule } from '@uklon/fleets/angular/cdk';

export interface CourierDeliveriesFilters {
  date: DateRangeQuery;
}

@Component({
  selector: 'upf-courier-deliveries',
  standalone: true,
  imports: [
    FiltersContainerComponent,
    ReactiveFormsModule,
    MatFormField,
    TranslateModule,
    DateTimeRangeControlComponent,
    AsyncPipe,
    ScrolledDirectiveModule,
    ProgressSpinnerComponent,
    EmptyStateComponent,
    CourierDeliveriesListComponent,
    MatLabel,
  ],
  templateUrl: './courier-deliveries.component.html',
  styleUrls: ['./courier-deliveries.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourierDeliveriesComponent {
  @Input() public fleetId: string;
  @Input() public courierId: string;
  @Input() public tabIndex: number;

  public readonly filterKey = StorageFiltersKey.COURIER_DELIVERIES;
  public readonly emptyState = EmptyStates;

  public filtersGroup = new FormGroup({
    date: new FormControl<DateRangeQuery>(getCurrentWeek()),
  });

  public isLoading: boolean;
  private cursor = -1;
  private hasNext: boolean;
  private readonly limit = 20;

  public readonly deliveries$ = new BehaviorSubject<CourierDeliveryItemDto[]>(null);

  constructor(private readonly ordersService: OrdersService) {}

  public onLoadNext(): void {
    if (!this.hasNext || this.isLoading) return;
    this.getCourierDeliveries(true);
  }

  public getCourierDeliveries(loadMore: boolean = false, filters: CourierDeliveriesFilters = null): void {
    this.isLoading = true;
    this.cursor = loadMore ? this.cursor : -1;

    const query = this.createFiltersQuery(filters);
    this.ordersService
      .getCourierDeliveries(this.courierId, query)
      .pipe(
        tap(({ next_cursor }) => {
          this.hasNext = Boolean(next_cursor);
          this.cursor = Number(next_cursor);
        }),
        map(({ items }) => items),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe((items) => {
        const deliveries = loadMore ? [...this.deliveries$.value, ...items] : items;
        this.deliveries$.next(deliveries);
      });
  }

  private createFiltersQuery(filters: CourierDeliveriesFilters): CourierDeliveriesQueryDto {
    const {
      date: { from, to },
    } = filters || this.filtersGroup.value;

    return {
      from: toServerDate(new Date(from)),
      to: toServerDate(new Date(to)),
      limit: this.limit,
      cursor: this.cursor,
    };
  }
}
