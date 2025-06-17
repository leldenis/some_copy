import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CourierDeliveryDto, CouriersDeliveriesQueryDto } from '@data-access';
import { Store } from '@ngrx/store';
import { AccountState } from '@ui/core/store/account/account.reducer';
import { getSelectedFleet } from '@ui/core/store/account/account.selectors';
import { CouriersDeliveriesFiltersComponent } from '@ui/modules/couriers-orders/components/couriers-deliveries-filters/couriers-deliveries-filters.component';
import { CouriersDeliveriesListComponent } from '@ui/modules/couriers-orders/components/couriers-deliveries-list/couriers-deliveries-list.component';
import { OrdersService } from '@ui/modules/orders/services';
import { UIService } from '@ui/shared';
import { EmptyStateComponent } from '@ui/shared/components/empty-state/empty-state.component';
import { EmptyStates } from '@ui/shared/components/empty-state/empty-states';
import { BehaviorSubject, Observable, filter, map, tap } from 'rxjs';

import { toServerDate } from '@uklon/angular-core';
import { ScrolledDirectiveModule } from '@uklon/fleets/angular/cdk';

import { CourierDeliveriesFiltersDto } from '../../models';

@Component({
  selector: 'upf-couriers-deliveries',
  standalone: true,
  imports: [
    AsyncPipe,
    EmptyStateComponent,
    ScrolledDirectiveModule,
    CouriersDeliveriesFiltersComponent,
    CouriersDeliveriesListComponent,
  ],
  templateUrl: './couriers-deliveries.component.html',
  styleUrls: ['./couriers-deliveries.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CouriersDeliveriesComponent {
  public cursor = -1;
  public hasNext: boolean;
  public isLoading: boolean;
  public filters: CourierDeliveriesFiltersDto;

  public readonly emptyState = EmptyStates;
  public readonly fleetId$ = this.store.select(getSelectedFleet).pipe(
    filter(Boolean),
    map(({ id }) => id),
    tap((id) => this.resetParams(id)),
  );
  public readonly deliveries$ = new BehaviorSubject<CourierDeliveryDto[]>([]);
  public readonly isMobileView$: Observable<boolean> = this.uiService.breakpointMatch();

  private fleetId: string;
  private readonly limit = 30;

  constructor(
    private readonly store: Store<AccountState>,
    private readonly ordersService: OrdersService,
    private readonly uiService: UIService,
  ) {}

  public onLoadNext(): void {
    if (!this.hasNext || this.isLoading) return;

    this.getDeliveries(true);
  }

  public onFiltersChange(filters: CourierDeliveriesFiltersDto): void {
    if (!filters) return;

    this.filters = filters;
    this.cursor = -1;
    this.getDeliveries();
  }

  private getDeliveries(loadNext: boolean = false): void {
    this.isLoading = true;

    const params = this.getParams(this.fleetId, this.filters);
    this.ordersService.getFleetCouriersDeliveries(params).subscribe(({ items, cursor }) => {
      this.hasNext = !!Number(cursor);
      this.cursor = cursor;
      this.deliveries$.next(loadNext ? [...this.deliveries$.value, ...items] : items);
      this.isLoading = false;
    });
  }

  private resetParams(fleetId: string): void {
    this.fleetId = fleetId;
    this.cursor = -1;
  }

  private getParams(
    fleet_id: string,
    { status, dateRange: { from, to }, courierId }: CourierDeliveriesFiltersDto,
  ): CouriersDeliveriesQueryDto {
    return {
      status,
      from: toServerDate(new Date(from)),
      to: toServerDate(new Date(to)),
      limit: this.limit,
      cursor: this.cursor,
      fleet_id,
      courier_id: courierId,
    };
  }
}
