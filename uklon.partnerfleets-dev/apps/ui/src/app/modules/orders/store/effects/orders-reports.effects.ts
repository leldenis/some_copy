import { Injectable } from '@angular/core';
import { DriversOrdersReportDto, InfinityScrollCollectionDto } from '@data-access';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { LoadingIndicatorService } from '@ui/core/services/loading-indicator.service';
import { selectedFleetId } from '@ui/core/store/account/account.selectors';
import { OrderReports, OrderReportsParamsDto } from '@ui/modules/orders/models/order-reports.dto';
import { OrderReportsActionsGroup } from '@ui/modules/orders/store/actions/orders-reports.actions';
import { OrdersReportsFeatureState } from '@ui/modules/orders/store/reducers/orders-reports.reducer';
import { getReportsQueryParams } from '@ui/modules/orders/store/selectors/orders-reports.selectors';
import { of } from 'rxjs';
import { catchError, finalize, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import { ReportsService } from '../../services';

@Injectable()
export class OrdersReportsEffects {
  public getOrdersReports$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(OrderReportsActionsGroup.getOrdersReports),
        withLatestFrom(this.store.select(selectedFleetId), this.store.select(getReportsQueryParams)),
        switchMap(([_, fleetId, queryParams]: [Action, string, OrderReports]) => {
          this.loaderService.show();

          let params: OrderReportsParamsDto = {
            dateFrom: queryParams.date?.from,
            dateTo: queryParams.date?.to,
            limit: queryParams.limit,
            offset: queryParams.offset,
          };

          if (queryParams.driverId) {
            params = { ...params, driverId: queryParams.driverId };
          }

          return this.reportsService.findAllOrders(fleetId, params).pipe(
            tap((response: InfinityScrollCollectionDto<DriversOrdersReportDto>) => {
              this.store.dispatch(OrderReportsActionsGroup.getOrdersReportsSuccess(response));
            }),
            catchError(() => {
              this.store.dispatch(OrderReportsActionsGroup.getOrdersReportsFailed());
              return of(null);
            }),
            finalize(() => this.loaderService.hide()),
          );
        }),
      ),
    { dispatch: false },
  );

  constructor(
    private readonly actions$: Actions,
    private readonly reportsService: ReportsService,
    private readonly store: Store<OrdersReportsFeatureState>,
    private readonly loaderService: LoadingIndicatorService,
  ) {}
}
