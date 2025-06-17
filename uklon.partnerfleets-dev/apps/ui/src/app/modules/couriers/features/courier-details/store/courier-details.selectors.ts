import { Restriction } from '@constant';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CorePaths } from '@ui/core/models/core-paths';
import { getRouterUrl } from '@ui/core/store/router/router.selector';
import { CourierDetailsState } from '@ui/modules/couriers/features/courier-details/store/courier-details.reducer';
import { CourierPaths } from '@ui/modules/couriers/models/courier-paths';

export const getCourierDetailsStore = createFeatureSelector<CourierDetailsState>('courierDetails');

export const getFleetCourierDetails = createSelector(
  getCourierDetailsStore,
  (store: CourierDetailsState) => store?.courier,
);

export const getCourierId = createSelector(getFleetCourierDetails, (courier) => courier?.id);

export const getIsCourierDetailsPages = createSelector(getRouterUrl, (url: string) =>
  url?.includes(`/${CorePaths.WORKSPACE}/${CorePaths.COURIERS}/${CourierPaths.DETAILS}`),
);

export const getCourierRestrictionSettings = createSelector(
  getCourierDetailsStore,
  (store: CourierDetailsState) => store.restrictionSettings,
);

export const getCourierCashRestrictionSettings = createSelector(getCourierRestrictionSettings, (settings) =>
  settings?.find((item) => item.type === Restriction.CASH),
);

export const getCourierRestrictions = createSelector(
  getCourierDetailsStore,
  (store: CourierDetailsState) => store.restrictions,
);

export const getCourierProducts = createSelector(
  getCourierDetailsStore,
  (store: CourierDetailsState) => store.products,
);

export const getCourierProductsPending = createSelector(
  getCourierDetailsStore,
  (store: CourierDetailsState) => store.productsPending,
);
