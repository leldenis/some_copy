import {
  DriverDenyListDto,
  DriverProductConfigurationsCollectionDto,
  DriverRestrictionListDto,
  DriverRideConditionDto,
  FleetDriverDto,
  FleetDriversCollection,
  PhotosDto,
} from '@data-access';
import { createReducer, on } from '@ngrx/store';
import { driversActions } from '@ui/modules/drivers/store/drivers/drivers.actions';

export interface DriversState {
  loading: boolean;
  driversCollection: FleetDriversCollection;
  isDriverCollectionError: boolean;
  driverDetails: FleetDriverDto;
  driverPhotos: PhotosDto;
  driverPhotosLg: PhotosDto;
  driverProductConfigurationsCollection: DriverProductConfigurationsCollectionDto;
  denyList: DriverDenyListDto;
  restrictions: DriverRestrictionListDto;
  rideConditions: DriverRideConditionDto[];
}

export const initialState: DriversState = {
  loading: false,
  driversCollection: null,
  isDriverCollectionError: false,
  driverDetails: null,
  driverPhotos: null,
  driverPhotosLg: null,
  driverProductConfigurationsCollection: null,
  denyList: null,
  restrictions: null,
  rideConditions: [],
};

export const driversReducer = createReducer(
  initialState,

  on(driversActions.getFleetDrivers, (state) => ({
    ...state,
    loading: true,
    isDriverColectionError: false,
  })),

  on(driversActions.getFleetDriversSuccess, (state, driversCollection) => ({
    ...state,
    loading: false,
    driversCollection,
  })),

  on(driversActions.getFleetDriversFailed, (state) => ({
    ...state,
    driversCollection: {
      ...initialState.driversCollection,
    },
    isDriverColectionError: true,
  })),

  on(driversActions.getFleetDriverById, (state) => ({
    ...state,
    loading: true,
  })),

  on(driversActions.getFleetDriverByIdSuccess, (state, driverDetails) => ({
    ...state,
    loading: false,
    driverDetails,
  })),

  on(driversActions.getFleetDriverByIdFailed, (state) => ({
    ...state,
    loading: false,
    driverDetails: null,
  })),

  on(driversActions.getDriverRideConditions, (state) => ({
    ...state,
    loading: true,
  })),

  on(driversActions.getDriverRideConditionsSuccess, (state, { items }) => ({
    ...state,
    loading: false,
    rideConditions: [...items],
  })),

  on(driversActions.getDriverRideConditionsFailed, (state) => ({
    ...state,
    loading: false,
  })),

  on(driversActions.clearDriverRideConditions, (state) => ({
    ...state,
    loading: false,
    rideConditions: [],
  })),

  on(driversActions.getFleetDriverProductsConfigurations, (state) => ({
    ...state,
    loading: true,
  })),

  on(driversActions.getFleetDriverProductsConfigurationsSuccess, (state, productsConfigurationsCollection) => ({
    ...state,
    loading: false,
    driverProductConfigurationsCollection: productsConfigurationsCollection,
  })),

  on(driversActions.getFleetDriverProductsConfigurationsFailed, (state) => ({
    ...state,
    loading: false,
    driverProductConfigurationsCollection: null,
  })),

  on(driversActions.putFleetDriverProductsConfigurations, (state) => ({
    ...state,
    loading: true,
  })),

  on(driversActions.putFleetDriverProductsConfigurationsSuccess, (state) => ({
    ...state,
    loading: false,
  })),

  on(driversActions.putFleetDriverProductsConfigurationsFailed, (state) => ({
    ...state,
    loading: false,
  })),

  on(driversActions.putFleetDriverProductConfigurationsById, (state) => ({
    ...state,
    loading: true,
  })),

  on(driversActions.putFleetDriverProductConfigurationsByIdSuccess, (state) => ({
    ...state,
    loading: false,
  })),

  on(driversActions.putFleetDriverProductConfigurationsByIdFailed, (state) => ({
    ...state,
    loading: false,
  })),

  on(driversActions.bulkPutFleetDriverProductConfigurationsById, (state) => ({
    ...state,
    loading: true,
  })),

  on(driversActions.bulkPutFleetDriverProductConfigurationsByIdSuccess, (state) => ({
    ...state,
    loading: false,
  })),

  on(driversActions.bulkPutFleetDriverProductConfigurationsByIdFailed, (state) => ({
    ...state,
    loading: false,
  })),

  on(driversActions.getFleetDriverPhotos, (state) => ({
    ...state,
    loading: true,
  })),

  on(driversActions.getFleetDriverPhotosSuccess, (state, driverPhotos) => ({
    ...state,
    loading: false,
    driverPhotos,
  })),

  on(driversActions.getFleetDriverPhotosFailed, (state) => ({
    ...state,
    loading: false,
    driverPhotos: null,
  })),

  on(driversActions.getFleetDriverPhotosLgSuccess, (state, driverPhotosLg) => ({
    ...state,
    loading: false,
    driverPhotosLg,
  })),

  on(driversActions.getFleetDriverPhotosLgFailed, (state) => ({
    ...state,
    loading: false,
    driverPhotosLg: null,
  })),

  on(driversActions.clearFleetDriverPhotos, (state) => ({
    ...state,
    driverPhotos: null,
    driverPhotosLg: null,
  })),

  on(driversActions.removeFleetDriverById, (state) => ({
    ...state,
    loading: true,
  })),

  on(driversActions.removeFleetDriverByIdSuccess, driversActions.removeFleetDriverByIdFailed, (state) => ({
    ...state,
    loading: false,
  })),

  on(driversActions.getFleetDriverDenyListSuccess, (state, denyList) => ({
    ...state,
    denyList,
  })),
  on(driversActions.getFleetDriverDenyListError, (state) => ({
    ...state,
  })),

  on(driversActions.clearFleetDriverDenyListSuccess, (state) => ({
    ...state,
    denyList: { count: 0 },
  })),

  on(driversActions.clearFleetDriverDenyListSuccess, (state) => ({
    ...state,
  })),

  on(driversActions.getFleetDriverRestrictionsSuccess, (state, restrictions) => ({
    ...state,
    restrictions,
  })),

  on(driversActions.releaseFleetDriverVehicleById, (state) => ({
    ...state,
    loading: true,
  })),

  on(
    driversActions.releaseFleetDriverVehicleByIdSuccess,
    driversActions.releaseFleetDriverVehicleByIdFailed,
    (state) => ({
      ...state,
      loading: false,
    }),
  ),

  on(driversActions.clearState, () => ({
    ...initialState,
  })),
);
