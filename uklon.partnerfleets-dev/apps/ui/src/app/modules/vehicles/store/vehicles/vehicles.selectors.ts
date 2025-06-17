import { VehicleDetailsDto } from '@data-access';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CorePaths } from '@ui/core/models/core-paths';
import { selectedFleetRegionId } from '@ui/core/store/account/account.selectors';
import { getShowFeatureCargo } from '@ui/core/store/root/root.selectors';
import { getRouterUrl } from '@ui/core/store/router/router.selector';
import { VehiclePaths } from '@ui/modules/vehicles/models/vehicle-paths';
import { VehiclesState } from '@ui/modules/vehicles/store/vehicles/vehicles.reducer';
import { FOREIGN_COUNTRIES } from '@ui/shared/consts';

export const getVehiclesStore = createFeatureSelector<VehiclesState>('vehicles');

export const vehicles = createSelector(getVehiclesStore, (state) => state.vehiclesCollection);

export const getFleetVehicles = createSelector(
  getVehiclesStore,
  (vehiclesStore: VehiclesState) => vehiclesStore?.vehiclesCollection?.data,
);

export const isVehiclesCollectionError = createSelector(
  getVehiclesStore,
  (vehiclesStore: VehiclesState) => vehiclesStore?.isVehiclesCollectionError,
);

export const getFleetVehiclesTotalCount = createSelector(
  getVehiclesStore,
  (vehiclesStore: VehiclesState) => vehiclesStore?.vehiclesCollection?.total,
);

export const getFleetVehicleDetails = createSelector(
  getVehiclesStore,
  (vehiclesStore: VehiclesState) => vehiclesStore?.vehicleDetails,
);

export const getFleetVehicleDetailsId = createSelector(
  getFleetVehicleDetails,
  (vehicleDetails: VehicleDetailsDto) => vehicleDetails?.id,
);

export const getFleetVehiclePhotos = createSelector(
  getVehiclesStore,
  (vehiclesStore: VehiclesState) => vehiclesStore?.vehiclePhotos,
);

export const getFleetVehiclePhotosLg = createSelector(
  getVehiclesStore,
  (vehiclesStore: VehiclesState) => vehiclesStore?.vehiclePhotosLg,
);

export const getVehicleTicketPhotos = createSelector(
  getVehiclesStore,
  (vehiclesStore: VehiclesState) => vehiclesStore?.vehicleTicketPhotos,
);

export const getVehicleTicketPhotosLg = createSelector(
  getVehiclesStore,
  (vehiclesStore: VehiclesState) => vehiclesStore?.vehicleTicketPhotosLg,
);

export const getFleetVehiclesTickets = createSelector(
  getVehiclesStore,
  (vehiclesStore: VehiclesState) => vehiclesStore?.vehiclesTicketsCollection?.items,
);

export const isVehiclesTicketsCollectionError = createSelector(
  getVehiclesStore,
  (vehiclesStore: VehiclesState) => vehiclesStore?.isVehiclesTicketsCollectionError,
);

export const getFleetVehiclesTicketsTotalCount = createSelector(
  getVehiclesStore,
  (vehiclesStore: VehiclesState) => vehiclesStore?.vehiclesTicketsCollection?.total_count,
);

export const getFleetVehicleProductConfigurations = createSelector(
  getVehiclesStore,
  (vehiclesStore: VehiclesState) => vehiclesStore?.vehicleProductConfigurations?.items,
);

export const getFleetVehicleAvatar = createSelector(
  getVehiclesStore,
  (vehiclesStore: VehiclesState) =>
    vehiclesStore?.vehiclePhotos?.vehicle_angled_front ?? vehiclesStore?.vehiclePhotos?.driver_car_front_photo,
);

export const getFleetVehicleShowCargo = createSelector(
  getShowFeatureCargo,
  selectedFleetRegionId,
  (showFeatureCargo: boolean, fleetRegionId: number) => showFeatureCargo && !FOREIGN_COUNTRIES.includes(fleetRegionId),
);

export const getIsVehicleDetailsPage = createSelector(getRouterUrl, (url: string) =>
  url?.includes(`/${CorePaths.WORKSPACE}/${CorePaths.VEHICLES}/${VehiclePaths.DETAILS}`),
);

export const getIsVehicleCreatePage = createSelector(getRouterUrl, (url: string) =>
  url?.includes(`/${CorePaths.WORKSPACE}/${CorePaths.VEHICLES}/${VehiclePaths.CREATE}`),
);

export const getIsVehicleTicketPage = createSelector(getRouterUrl, (url: string) =>
  url?.includes(`/${CorePaths.WORKSPACE}/${CorePaths.VEHICLES}/${VehiclePaths.TICKET}`),
);

export const vehicleTicketDeleted = createSelector(
  getVehiclesStore,
  (vehiclesStore: VehiclesState) => vehiclesStore?.vehicleTicketDeleted,
);

export const vehicleCashPointOfSale = createSelector(
  getVehiclesStore,
  (store: VehiclesState) => store.vehicleCashPoint,
);

export const getVehicleTicketId = createSelector(getVehiclesStore, (store: VehiclesState) => store.ticketId);
