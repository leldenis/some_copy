import {
  FleetFiscalizationSettingsDto,
  FleetSignatureKeysCollection,
  FleetVehicleFiscalizationCollectionDto,
  GatewayFleetCashPointCollection,
} from '@data-access';
import { createReducer, on } from '@ngrx/store';
import { fleetRROActions } from '@ui/modules/fleet-profile/features/fleet-rro/store/rro.actions';

export interface FleetRROState {
  loading: boolean;
  settings: FleetFiscalizationSettingsDto;
  status: boolean;
  uploadSignatureKey: boolean;
  keys: FleetSignatureKeysCollection;
  vehicles: FleetVehicleFiscalizationCollectionDto;
  cashiers: GatewayFleetCashPointCollection;
  cashiersLoading: boolean;
}

export const initialState: FleetRROState = {
  loading: false,
  settings: null,
  status: false,
  uploadSignatureKey: false,
  keys: [],
  vehicles: {
    data: [],
    total: 0,
  },
  cashiers: [],
  cashiersLoading: false,
};

export const fleetRROReducer = createReducer(
  initialState,

  on(fleetRROActions.getFiscalizationSettings, (state) => ({
    ...state,
    loading: true,
  })),

  on(fleetRROActions.getFiscalizationSettingsSuccess, (state, { settings }) => ({
    ...state,
    loading: false,
    settings,
  })),

  on(fleetRROActions.getFiscalizationSettingsFailed, (state) => ({
    ...state,
    loading: false,
  })),

  on(fleetRROActions.updateFiscalizationSettings, (state, { settings }) => ({
    ...state,
    loading: true,
    settings,
  })),

  on(fleetRROActions.updateFiscalizationSettingsSuccess, (state) => ({
    ...state,
    loading: false,
  })),

  on(fleetRROActions.updateFiscalizationSettingsFailed, (state) => ({
    ...state,
    loading: false,
  })),

  on(fleetRROActions.getFiscalizationStatus, (state) => ({
    ...state,
    loading: true,
  })),

  on(fleetRROActions.getFiscalizationStatusSuccess, (state, { status }) => ({
    ...state,
    loading: false,
    status,
  })),

  on(fleetRROActions.getFiscalizationStatusFailed, (state) => ({
    ...state,
    loading: false,
  })),

  on(fleetRROActions.updateFiscalizationStatus, (state, { status }) => ({
    ...state,
    loading: true,
    status,
  })),

  on(fleetRROActions.updateFiscalizationStatusSuccess, (state) => ({
    ...state,
    loading: false,
  })),

  on(fleetRROActions.updateFiscalizationStatusFailed, (state) => ({
    ...state,
    loading: false,
  })),

  on(fleetRROActions.startUploadSignatureKey, (state) => ({
    ...state,
    loading: false,
    uploadSignatureKey: true,
  })),

  on(fleetRROActions.uploadSignatureKeyFailed, fleetRROActions.closeUploadSignatureKeyModal, (state) => ({
    ...state,
    loading: false,
    uploadSignatureKey: false,
  })),

  on(fleetRROActions.uploadSignatureKeySuccess, (state) => ({
    ...state,
    loading: false,
    uploadSignatureKey: false,
  })),

  on(fleetRROActions.getSignatureKeys, (state) => ({
    ...state,
    loading: true,
  })),

  on(fleetRROActions.getSignatureKeysSuccess, (state, { keys }) => ({
    ...state,
    loading: false,
    keys,
  })),

  on(fleetRROActions.getSignatureKeysFailed, (state) => ({
    ...state,
    loading: false,
  })),

  on(fleetRROActions.removeSignatureKey, (state) => ({
    ...state,
    loading: true,
  })),

  on(fleetRROActions.removeSignatureKeySuccess, (state) => ({
    ...state,
    loading: false,
  })),

  on(fleetRROActions.removeSignatureKeyFailed, (state) => ({
    ...state,
    loading: false,
  })),

  on(fleetRROActions.getFleetVehicles, (state) => ({
    ...state,
    loading: true,
  })),

  on(fleetRROActions.getFleetVehiclesSuccess, (state, { vehicles }) => ({
    ...state,
    loading: false,
    vehicles,
  })),

  on(fleetRROActions.getFleetVehiclesFailed, (state) => ({
    ...state,
    loading: false,
  })),

  on(fleetRROActions.getCashierPositions, (state) => ({
    ...state,
    cashiersLoading: true,
  })),

  on(fleetRROActions.getCashierPositionsSuccess, (state, { cashiers }) => ({
    ...state,
    cashiersLoading: false,
    cashiers,
  })),

  on(fleetRROActions.getCashierPositionsFailed, fleetRROActions.closeLinkCashToKeyModal, (state) => ({
    ...state,
    cashiersLoading: false,
  })),

  on(fleetRROActions.clearState, () => ({
    ...initialState,
  })),
);
