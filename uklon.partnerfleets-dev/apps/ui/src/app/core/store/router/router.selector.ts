import { Params } from '@angular/router';
import { getRouterSelectors, RouterReducerState } from '@ngrx/router-store';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RouterUrlState } from '@ui/core/store/app.state';

export const routerStore = createFeatureSelector<RouterReducerState<RouterUrlState>>('router');

const { selectRouteParams, selectUrl } = getRouterSelectors(routerStore);

export const getRouterUrl = createSelector(selectUrl, (url: string) => url || '');

export const getRouteParams = createSelector(selectRouteParams, (params: Params) => params);
