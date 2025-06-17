import { BlockedListStatusValue, DriverStatus, PhotoSize } from '@constant';
import {
  DriverDenyListDto,
  DriverProductConfigurationsCollectionDto,
  DriverRestrictionListDto,
  DriverRideConditionListDto,
  FleetDriverDto,
  FleetDriversItemDto,
  PaginationCollectionDto,
  PhotosDto,
  ProductConfigurationUpdateItemCollectionDto,
  RemoveReasonDto,
  SetDriverProductConfigurationDto,
} from '@data-access';
import { createAction, props } from '@ngrx/store';

const tag = '[drivers]';

export const driversActions = {
  getFleetDrivers: createAction(
    `${tag} get fleet drivers`,
    props<{
      fleetId: string;
      phone: string;
      name: string;
      status: DriverStatus | '';
      limit: number;
      offset: number;
      block_status?: BlockedListStatusValue;
      region_id?: number;
    }>(),
  ),
  getFleetDriversSuccess: createAction(
    `${tag} get fleet drivers success`,
    props<PaginationCollectionDto<FleetDriversItemDto>>(),
  ),
  getFleetDriversFailed: createAction(`${tag} get fleet drivers failed`),

  getFleetDriverById: createAction(
    `${tag} get fleet driver by id`,
    props<{
      fleetId: string;
      driverId: string;
    }>(),
  ),
  getFleetDriverByIdSuccess: createAction(`${tag} get fleet driver by id success`, props<FleetDriverDto>()),
  getFleetDriverByIdFailed: createAction(`${tag} get fleet driver by id failed`),

  getDriverRideConditions: createAction(`${tag} get driver ride conditions`),
  getDriverRideConditionsSuccess: createAction(
    `${tag} get driver ride conditions success`,
    props<Omit<DriverRideConditionListDto, 'type'>>(),
  ),
  getDriverRideConditionsFailed: createAction(`${tag} get driver ride conditions failed`),
  clearDriverRideConditions: createAction(`${tag} clear driver ride conditions`),

  getFleetDriverProductsConfigurations: createAction(
    `${tag} get fleet driver products configurations`,
    props<{
      fleetId: string;
      driverId: string;
    }>(),
  ),
  getFleetDriverProductsConfigurationsSuccess: createAction(
    `${tag} get fleet driver products configurations success`,
    props<DriverProductConfigurationsCollectionDto>(),
  ),
  getFleetDriverProductsConfigurationsFailed: createAction(`${tag} get fleet driver products configurations failed`),

  putFleetDriverProductsConfigurations: createAction(
    `${tag} put fleet driver products configurations`,
    props<{
      fleetId: string;
      driverId: string;
      body: ProductConfigurationUpdateItemCollectionDto;
    }>(),
  ),
  putFleetDriverProductsConfigurationsSuccess: createAction(`${tag} put fleet driver products configurations success`),
  putFleetDriverProductsConfigurationsFailed: createAction(`${tag} put fleet driver products configurations failed`),

  putFleetDriverProductConfigurationsById: createAction(
    `${tag} put fleet driver product configurations by id`,
    props<{
      fleetId: string;
      driverId: string;
      productId: string;
      body: SetDriverProductConfigurationDto;
    }>(),
  ),
  putFleetDriverProductConfigurationsByIdSuccess: createAction(
    `${tag} put fleet driver product configurations by id success`,
  ),
  putFleetDriverProductConfigurationsByIdFailed: createAction(
    `${tag} put fleet driver product configurations by id failed`,
  ),

  bulkPutFleetDriverProductConfigurationsById: createAction(
    `${tag} bulk put fleet driver product configurations by id`,
    props<{
      fleetId: string;
      driverId: string;
      body: {
        id: string;
        configuration: SetDriverProductConfigurationDto;
      }[];
    }>(),
  ),
  bulkPutFleetDriverProductConfigurationsByIdSuccess: createAction(
    `${tag} bulk put fleet driver product configurations by id success`,
  ),
  bulkPutFleetDriverProductConfigurationsByIdFailed: createAction(
    `${tag} bulk put fleet driver product configurations by id failed`,
  ),

  getFleetDriverPhotos: createAction(
    `${tag} get fleet driver photos`,
    props<{
      driverId: string;
      image_size: PhotoSize;
    }>(),
  ),
  getFleetDriverPhotosSuccess: createAction(`${tag} get fleet driver photos success`, props<PhotosDto>()),
  getFleetDriverPhotosFailed: createAction(`${tag} get fleet driver photos failed`),

  getFleetDriverPhotosLgSuccess: createAction(`${tag} get fleet driver photos LG success`, props<PhotosDto>()),
  getFleetDriverPhotosLgFailed: createAction(`${tag} get fleet driver photos LG failed`),

  clearFleetDriverPhotos: createAction(`${tag} clear fleet driver photos`),

  removeFleetDriverById: createAction(
    `${tag} remove fleet driver by id`,
    props<{
      fleetId: string;
      driverId: string;
      body: RemoveReasonDto;
    }>(),
  ),
  removeFleetDriverByIdSuccess: createAction(`${tag} remove fleet driver by id success`),
  removeFleetDriverByIdFailed: createAction(`${tag} remove fleet driver by id failed`),

  getFleetDriverDenyList: createAction(`${tag} get fleet driver deny list count`, props<{ driverId: string }>()),
  getFleetDriverDenyListSuccess: createAction(
    `${tag} get fleet driver deny list count success`,
    props<DriverDenyListDto>(),
  ),
  getFleetDriverDenyListError: createAction(`${tag} get fleet driver deny list count error`),

  getFleetDriverRestrictions: createAction(
    `${tag} get fleet driver restrictions`,
    props<{ fleetId: string; driverId: string }>(),
  ),
  getFleetDriverRestrictionsSuccess: createAction(
    `${tag} get fleet driver restrictions success`,
    props<DriverRestrictionListDto>(),
  ),
  getFleetDriverRestrictionsError: createAction(`${tag} get fleet driver restrictions error`),

  openUnlinkVehicleDialog: createAction(`${tag} open unlink vehicle dialog`),

  releaseFleetDriverVehicleById: createAction(
    `${tag} release fleet driver vehicle by id`,
    props<{
      fleetId: string;
      vehicleId: string;
    }>(),
  ),
  releaseFleetDriverVehicleByIdSuccess: createAction(`${tag} release fleet driver vehicle by id success`),
  releaseFleetDriverVehicleByIdFailed: createAction(`${tag} release fleet driver vehicle by id failed`),

  clearFleetDriverDenyList: createAction(`${tag} clear fleet driver deny list count`, props<{ driverId: string }>()),
  clearFleetDriverDenyListSuccess: createAction(`${tag} clear fleet driver deny list count success`),
  clearFleetDriverDenyListError: createAction(`${tag} clear fleet driver deny list count error`),

  clearState: createAction(`${tag} clear drivers state`),
};
