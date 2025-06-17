import {
  CourierDetailsDto,
  CourierProductCollectionDto,
  CourierRestrictionListDto,
  CourierRestrictionTypePayloadDto,
  ProductConfigurationUpdateItemCollectionDto,
} from '@data-access';
import { createAction, props } from '@ngrx/store';

const tag = '[courier details]';

export const courierDetailsActions = {
  getFleetCourierById: createAction(
    `${tag} get fleet courier by id`,
    props<{
      fleetId: string;
      courierId: string;
    }>(),
  ),
  getFleetCourierByIdSuccess: createAction(`${tag} get fleet courier by id success`, props<CourierDetailsDto>()),
  getFleetCourierByIdFailed: createAction(`${tag} get fleet courier by id failed`),

  openRemoveCourierDialog: createAction(`${tag} open remove courier dialog`),

  removeFleetCourierById: createAction(`${tag} remove fleet courier by id`),
  removeFleetCourierByIdSuccess: createAction(`${tag} remove fleet courier by id success`),
  removeFleetCourierByIdFailed: createAction(`${tag} remove fleet courier by id failed`),

  getFleetCourierRestrictionSettings: createAction(`${tag} get courier restriction settings`),

  getFleetCourierRestrictionSettingsSuccess: createAction(
    `${tag} get courier restriction settings success`,
    props<CourierRestrictionListDto>(),
  ),

  getFleetCourierRestrictionSettingsFailed: createAction(`${tag} get courier restriction settings failed`),

  updateFleetCourierRestriction: createAction(
    `${tag} update courier restriction settings`,
    props<CourierRestrictionTypePayloadDto>(),
  ),

  updateFleetCourierRestrictionSuccess: createAction(`${tag} update courier restriction success`),

  updateFleetCourierRestrictionFailed: createAction(`${tag} update courier restriction failed`),

  removeFleetCourierRestriction: createAction(
    `${tag} remove courier restriction`,
    props<CourierRestrictionTypePayloadDto>(),
  ),

  removeFleetCourierRestrictionSuccess: createAction(`${tag} remove courier restriction success`),

  removeFleetCourierRestrictionFailed: createAction(`${tag} remove courier restriction failed`),

  getFleetCourierRestrictions: createAction(`${tag} get courier restrictions`),

  getFleetCourierRestrictionsSuccess: createAction(
    `${tag} get courier restrictions success`,
    props<CourierRestrictionListDto>(),
  ),

  getFleetCourierRestrictionsFailed: createAction(`${tag} get courier restrictions failed`),

  getFleetCourierProducts: createAction(`${tag} get courier products`),

  getFleetCourierProductsSuccess: createAction(
    `${tag} get courier products success`,
    props<CourierProductCollectionDto>(),
  ),

  getFleetCourierProductsFailed: createAction(`${tag} get courier products failed`),

  updateFleetCourierProducts: createAction(
    `${tag} update fleet courier products`,
    props<ProductConfigurationUpdateItemCollectionDto>(),
  ),
  updateFleetCourierProductsSuccess: createAction(`${tag} update fleet courier products success`),
  updateFleetCourierProductsFailed: createAction(`${tag} update fleet courier products failed`),

  clearState: createAction(`${tag} clear courier state`),
};
