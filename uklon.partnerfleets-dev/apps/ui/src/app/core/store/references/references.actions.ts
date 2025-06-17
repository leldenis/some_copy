import { DictionariesListDto, ModelsDictionaryDto } from '@data-access';
import { createAction, props } from '@ngrx/store';

const tag = '[references]';

export const referencesActions = {
  getAllDictionaries: createAction(`${tag} get all dictionaries`),
  getAllDictionariesSuccess: createAction(`${tag} get all dictionaries success`, props<DictionariesListDto>()),

  getVehicleModels: createAction(`${tag} get vehicle models dictionary`, props<{ makeId: string }>()),
  getVehicleModelsSuccess: createAction(
    `${tag} get vehicle models dictionary success`,
    props<{ dictionary: ModelsDictionaryDto[] }>(),
  ),

  clearVehicleModels: createAction(`${tag} clear vehicle models`),
};
