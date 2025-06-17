import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FleetRROState } from '@ui/modules/fleet-profile/features/fleet-rro/store/rro.reducer';

export const getRROStore = createFeatureSelector<FleetRROState>('rro');

export const fiscalizationSettings = createSelector(getRROStore, (store: FleetRROState) => store?.settings);
export const fiscalizationStatus = createSelector(getRROStore, (store: FleetRROState) => store?.status);
export const uploadSignatureKey = createSelector(getRROStore, (store: FleetRROState) => store?.uploadSignatureKey);
export const signatureKeys = createSelector(getRROStore, (store: FleetRROState) => store?.keys);
export const vehiclesFiscalization = createSelector(getRROStore, (store: FleetRROState) => store?.vehicles);
export const cashiers = createSelector(getRROStore, (store: FleetRROState) => store?.cashiers);
export const cashiersLoading = createSelector(getRROStore, (store: FleetRROState) => store?.cashiersLoading);
