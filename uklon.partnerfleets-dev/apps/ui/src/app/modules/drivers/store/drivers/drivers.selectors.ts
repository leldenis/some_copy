import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CorePaths } from '@ui/core/models/core-paths';
import { getRouterUrl } from '@ui/core/store/router/router.selector';
import { DriverPaths } from '@ui/modules/drivers/models/driver-paths';
import { DriversState } from '@ui/modules/drivers/store/drivers/drivers.reducer';

export const getDriversStore = createFeatureSelector<DriversState>('drivers');

export const drivers = createSelector(
  getDriversStore,
  (driversStore: DriversState) => driversStore?.driversCollection?.items,
);

export const hasError = createSelector(
  getDriversStore,
  (driversStore: DriversState) => driversStore?.isDriverCollectionError,
);

export const total = createSelector(
  getDriversStore,
  (driversStore: DriversState) => driversStore?.driversCollection?.total_count,
);

export const getFleetDriverDetails = createSelector(
  getDriversStore,
  (driversStore: DriversState) => driversStore?.driverDetails,
);

export const getFleetDriverPhotos = createSelector(
  getDriversStore,
  (driversStore: DriversState) => driversStore?.driverPhotos,
);

export const getFleetDriverPhotosLg = createSelector(
  getDriversStore,
  (driversStore: DriversState) => driversStore?.driverPhotosLg,
);

export const getFleetDriverAvatar = createSelector(
  getDriversStore,
  (driversStore: DriversState) => driversStore?.driverPhotos?.driver_avatar_photo,
);

export const getFleetDriverProductsConfigurations = createSelector(
  getDriversStore,
  (driversStore: DriversState) => driversStore?.driverProductConfigurationsCollection?.items,
);

export const getIsDriverDetailsPages = createSelector(getRouterUrl, (url: string) =>
  url?.includes(`/${CorePaths.WORKSPACE}/${CorePaths.DRIVERS}/${DriverPaths.DETAILS}`),
);

export const denyList = createSelector(getDriversStore, (driversStore: DriversState) => driversStore?.denyList);

export const driverRestrictions = createSelector(
  getDriversStore,
  (driversStore: DriversState) => driversStore?.restrictions?.items,
);

export const driverRideConditions = createSelector(getDriversStore, (store) => store.rideConditions);
