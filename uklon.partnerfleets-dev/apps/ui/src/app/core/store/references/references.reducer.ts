import { DictionaryDto, MakesDictionaryDto, ModelsDictionaryDto, RegionDictionaryItemDto } from '@data-access';
import { createReducer, on } from '@ngrx/store';
import { referencesActions } from '@ui/core/store/references/references.actions';

export interface ReferencesState {
  loading: boolean;
  regions: RegionDictionaryItemDto[];
  colors: DictionaryDto[];
  body_types: DictionaryDto[];
  comfort_levels: DictionaryDto[];
  options: DictionaryDto[];
  makes: MakesDictionaryDto[];
  models: ModelsDictionaryDto[];
  years: number[];
}

export const initialState: ReferencesState = {
  loading: false,
  regions: [],
  colors: [],
  body_types: [],
  comfort_levels: [],
  options: [],
  makes: [],
  models: [],
  years: [],
};

export const referencesReducer = createReducer(
  initialState,

  on(referencesActions.getAllDictionaries, (state) => ({
    ...state,
    loading: true,
  })),

  on(referencesActions.getAllDictionariesSuccess, (state, payload) => ({
    ...state,
    loading: false,
    regions: payload.regions,
    colors: payload.colors,
    body_types: payload.body_types,
    comfort_levels: payload.comfort_levels,
    options: payload.options,
    makes: payload.makes,
    years: payload.years,
  })),

  on(referencesActions.getVehicleModels, (state) => ({
    ...state,
    loading: true,
  })),

  on(referencesActions.getVehicleModelsSuccess, (state, payload) => ({
    ...state,
    loading: false,
    models: payload.dictionary,
  })),

  on(referencesActions.clearVehicleModels, (state) => ({
    ...state,
    models: [],
  })),
);
