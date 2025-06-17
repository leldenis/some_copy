import { WithdrawalType } from '@data-access';
import { createReducer, on } from '@ngrx/store';
import { fleetProfileActions } from '@ui/modules/fleet-profile/store/fleet-profile.actions';

export interface FleetProfileState {
  loading: boolean;
  b2bActivated: boolean;
}

export const initialState: FleetProfileState = {
  loading: false,
  b2bActivated: false,
};

export const fleetProfileReducer = createReducer(
  initialState,

  on(fleetProfileActions.getFleetEntrepreneurs, (state) => ({
    ...state,
    loading: true,
  })),

  on(fleetProfileActions.getFleetEntrepreneursSuccess, (state, { items, withdrawal_type }) => ({
    ...state,
    loading: false,
    b2bActivated: items.length > 0 && withdrawal_type === WithdrawalType.INDIVIDUAL_ENTREPRENEUR,
  })),

  on(fleetProfileActions.getFleetEntrepreneursFailed, (state) => ({
    ...state,
    loading: false,
  })),

  on(fleetProfileActions.clearState, () => ({
    ...initialState,
  })),
);
