import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FleetDto, FleetOrderRecordCollectionDto, OrderRecordDto } from '@data-access';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { CorePaths } from '@ui/core/models/core-paths';
import { accountActions } from '@ui/core/store/account/account.actions';
import { getRouterUrl } from '@ui/core/store/router/router.selector';
import { getIsOrderDetailsPages } from '@ui/modules/orders/store/selectors/orders.selectors';
import { omit, omitBy } from 'lodash';
import { map, of } from 'rxjs';
import { catchError, filter, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import { toServerDate } from '@uklon/angular-core';

import { OrdersService } from '../../services';
import { OrdersFeatureActionGroup } from '../actions/orders.actions';
import { OrdersFeatureState } from '../reducers/orders.reducer';

const notEmpty = (value: unknown): boolean => value === '';

@Injectable()
export class OrdersEffects {
  public handleQueryChange = createEffect(
    () =>
      this.actions$.pipe(
        ofType(OrdersFeatureActionGroup.queryChanged),
        switchMap((action) => {
          const { from, to } = action;

          const queryParams = {
            ...omit(action, 'isCustom', 'type'),
            from: toServerDate(new Date(from)),
            to: toServerDate(new Date(to)),
          };
          return this.ordersService.getFleetOrders(omitBy(queryParams, notEmpty)).pipe(
            tap((collection: FleetOrderRecordCollectionDto) => {
              this.store.dispatch(OrdersFeatureActionGroup.collectionChanged(collection));
            }),
            catchError(() => {
              this.store.dispatch(OrdersFeatureActionGroup.error());
              return of(null);
            }),
          );
        }),
      ),
    { dispatch: false },
  );

  public handleRequestQuery = createEffect(
    () =>
      this.actions$.pipe(
        ofType(OrdersFeatureActionGroup.requestOrder),
        switchMap((payload) =>
          this.ordersService.getFleetOrderById(payload.orderId, payload.driverId).pipe(
            tap((order: OrderRecordDto) => {
              this.store.dispatch(OrdersFeatureActionGroup.setOrder(order));
            }),
            catchError(() => {
              this.store.dispatch(OrdersFeatureActionGroup.error());
              return of(null);
            }),
          ),
        ),
      ),
    { dispatch: false },
  );

  public setSelectedFleetFromMenu$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(accountActions.setSelectedFleetFromMenu),
        withLatestFrom(this.store.select(getIsOrderDetailsPages), this.store.select(getRouterUrl)),
        filter(
          ([_, isOrderDetailsPages, currentUrl]: [FleetDto, boolean, string]) => isOrderDetailsPages && !!currentUrl,
        ),
        map(([fleet, _, currentUrl]: [FleetDto, boolean, string]) => {
          const segments = currentUrl.split('/');
          const lastIndexOfPage = segments.findIndex((item) => item.includes(CorePaths.ORDERS));
          segments.splice(lastIndexOfPage + 1);

          this.router.navigate(segments, { fragment: '1' }).then(() => {
            this.store.dispatch(accountActions.setSelectedFleet(fleet));
            this.store.dispatch(OrdersFeatureActionGroup.setOrder(null));
          });
        }),
      ),
    { dispatch: false },
  );

  constructor(
    private readonly actions$: Actions,
    private readonly ordersService: OrdersService,
    private readonly store: Store<OrdersFeatureState>,
    private readonly router: Router,
  ) {}
}
