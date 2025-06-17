import { Restriction, RestrictionReason } from '@constant';
import { CourierDetailsDto, CourierProductDto, CourierRestrictionDto } from '@data-access';
import { createReducer, on } from '@ngrx/store';
import { courierDetailsActions } from '@ui/modules/couriers/features/courier-details/store/courier-details.actions';

export interface CourierDetailsState {
  loading: boolean;
  courier: CourierDetailsDto;
  restrictionSettings: CourierRestrictionDto[];
  restrictions: CourierRestrictionDto[];
  products: CourierProductDto[];
  productsPending: boolean;
}

export const initialState: CourierDetailsState = {
  loading: false,
  courier: null,
  restrictionSettings: [],
  restrictions: [],
  products: [],
  productsPending: false,
};

export const courierDetailsReducer = createReducer(
  initialState,

  on(courierDetailsActions.getFleetCourierById, (state) => ({
    ...state,
    loading: true,
  })),

  on(courierDetailsActions.getFleetCourierByIdSuccess, (state, courier) => ({
    ...state,
    loading: false,
    courier,
  })),

  on(courierDetailsActions.getFleetCourierByIdFailed, (state) => ({
    ...state,
    loading: false,
    courier: null,
  })),

  on(courierDetailsActions.removeFleetCourierById, (state) => ({
    ...state,
    loading: true,
  })),

  on(
    courierDetailsActions.removeFleetCourierByIdSuccess,
    courierDetailsActions.removeFleetCourierByIdFailed,
    (state) => ({
      ...state,
      loading: false,
    }),
  ),

  on(courierDetailsActions.getFleetCourierRestrictionSettings, (state) => ({
    ...state,
    loading: true,
  })),

  on(courierDetailsActions.getFleetCourierRestrictionSettingsSuccess, (state, settings) => ({
    ...state,
    loading: false,
    restrictionSettings: [...settings.items],
  })),

  on(courierDetailsActions.getFleetCourierRestrictionSettingsFailed, (state) => ({
    ...state,
    loading: false,
  })),

  on(courierDetailsActions.getFleetCourierRestrictions, (state) => ({
    ...state,
    loading: true,
  })),

  on(courierDetailsActions.getFleetCourierRestrictionsSuccess, (state, restrictions) => ({
    ...state,
    loading: false,
    restrictions: restrictions.items.filter(
      (item) =>
        item.type === Restriction.CASH ||
        (item.type === Restriction.FAST_SEARCH && item.restricted_by === RestrictionReason.ACTIVITY_RATE),
    ),
  })),

  on(courierDetailsActions.getFleetCourierRestrictionsFailed, (state) => ({
    ...state,
    loading: false,
  })),

  on(courierDetailsActions.getFleetCourierProducts, (state) => ({
    ...state,
    loading: true,
  })),

  on(courierDetailsActions.getFleetCourierProductsSuccess, (state, products) => ({
    ...state,
    loading: false,
    products: products.items,
    productsPending: false,
  })),

  on(courierDetailsActions.getFleetCourierProductsFailed, (state) => ({
    ...state,
    loading: false,
    productsPending: false,
  })),

  on(courierDetailsActions.updateFleetCourierProducts, (state) => ({
    ...state,
    loading: true,
    productsPending: true,
  })),

  on(courierDetailsActions.updateFleetCourierProductsSuccess, (state) => ({
    ...state,
    loading: false,
  })),

  on(courierDetailsActions.updateFleetCourierProductsFailed, (state) => ({
    ...state,
    loading: false,
    productsPending: false,
  })),

  on(courierDetailsActions.clearState, () => ({
    ...initialState,
  })),
);
