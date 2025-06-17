import { createFeatureSelector, createSelector } from '@ngrx/store';

import { ReferencesState } from './references.reducer';

export const getReferencesStore = createFeatureSelector<ReferencesState>('references');

export const getRegions = createSelector(
  getReferencesStore,
  (referencesStore: ReferencesState) => referencesStore?.regions,
);

export const getYears = createSelector(
  getReferencesStore,
  (referencesStore: ReferencesState) => referencesStore?.years,
);

export const getColors = createSelector(
  getReferencesStore,
  (referencesStore: ReferencesState) => referencesStore?.colors,
);

export const getBodyTypes = createSelector(
  getReferencesStore,
  (referencesStore: ReferencesState) => referencesStore?.body_types,
);

export const getComfortLevels = createSelector(
  getReferencesStore,
  (referencesStore: ReferencesState) => referencesStore?.comfort_levels,
);

export const getOptions = createSelector(
  getReferencesStore,
  (referencesStore: ReferencesState) => referencesStore?.options,
);

export const getAdvanceOptions = createSelector(getOptions, (options) =>
  options?.filter((option) => option.code !== 'MarketingCampaign'),
);

export const getMakes = createSelector(
  getReferencesStore,
  (referencesStore: ReferencesState) => referencesStore?.makes,
);

export const getModels = createSelector(
  getReferencesStore,
  (referencesStore: ReferencesState) => referencesStore?.models,
);
