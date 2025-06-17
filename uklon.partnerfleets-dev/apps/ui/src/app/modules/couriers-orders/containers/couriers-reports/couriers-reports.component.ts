import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CourierReportsQueryDto, ReportByOrdersDto } from '@data-access';
import { Store } from '@ngrx/store';
import { AccountState } from '@ui/core/store/account/account.reducer';
import { getSelectedFleet } from '@ui/core/store/account/account.selectors';
import { CouriersReportsFiltersComponent } from '@ui/modules/couriers-orders/components/couriers-reports-filters/couriers-reports-filters.component';
import { CouriersReportsListComponent } from '@ui/modules/couriers-orders/components/couriers-reports-list/couriers-reports-list.component';
import { ReportsService } from '@ui/modules/orders/services';
import { UIService } from '@ui/shared';
import { EmptyStateComponent } from '@ui/shared/components/empty-state/empty-state.component';
import { EmptyStates } from '@ui/shared/components/empty-state/empty-states';
import { BehaviorSubject, Observable, filter, map, tap } from 'rxjs';

import { toServerDate } from '@uklon/angular-core';
import { ScrolledDirectiveModule } from '@uklon/fleets/angular/cdk';

import { CourierReportsFiltersDto } from '../../models';

@Component({
  selector: 'upf-couriers-reports',
  standalone: true,
  imports: [
    AsyncPipe,
    CouriersReportsFiltersComponent,
    CouriersReportsListComponent,
    ScrolledDirectiveModule,
    EmptyStateComponent,
  ],
  templateUrl: './couriers-reports.component.html',
  styleUrls: ['./couriers-reports.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CouriersReportsComponent {
  public offset = 0;
  public hasNext: boolean;
  public isLoading: boolean;
  public filters: CourierReportsFiltersDto;

  public readonly emptyState = EmptyStates;
  public readonly fleetId$ = this.store.select(getSelectedFleet).pipe(
    filter(Boolean),
    map(({ id }) => id),
    tap((id) => this.resetParams(id)),
  );
  public readonly reports$ = new BehaviorSubject<ReportByOrdersDto[]>([]);
  public readonly isMobileView$: Observable<boolean> = this.uiService.breakpointMatch();

  private fleetId: string;
  private readonly limit = 30;

  constructor(
    private readonly store: Store<AccountState>,
    private readonly reportsService: ReportsService,
    private readonly uiService: UIService,
  ) {}

  public onLoadNext(): void {
    if (!this.hasNext || this.isLoading) return;

    this.getReports(true);
  }

  public onFiltersChange(filters: CourierReportsFiltersDto): void {
    if (!filters) return;

    this.filters = filters;
    this.offset = 0;
    this.getReports();
  }

  private getReports(loadNext: boolean = false): void {
    this.isLoading = true;

    const params = this.getParams(this.filters);
    this.reportsService.getCouriersOrderReport(this.fleetId, params).subscribe(({ items, has_more_items }) => {
      this.hasNext = has_more_items;
      this.offset += this.limit;
      this.reports$.next(loadNext ? [...this.reports$.value, ...items] : items);
      this.isLoading = false;
    });
  }

  private resetParams(fleetId: string): void {
    this.fleetId = fleetId;
    this.offset = 0;
  }

  private getParams({ dateRange: { from, to }, courierId }: CourierReportsFiltersDto): CourierReportsQueryDto {
    return {
      from: toServerDate(new Date(from)),
      to: toServerDate(new Date(to)),
      limit: this.limit,
      offset: this.offset,
      courier_id: courierId,
    };
  }
}
