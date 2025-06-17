import { LanguageExpression } from '@data-access';
import { createAction, props } from '@ngrx/store';
import { NavigationRouteDto } from '@ui/shared/models';
import { EnvironmentModel } from '@ui-env/environment.model';

const tag = '[root]';

export const rootActions = {
  setConfig: createAction(`${tag} set config`, props<EnvironmentModel>()),

  setLanguage: createAction(`${tag} set language`, props<{ language: LanguageExpression }>()),

  setRouts: createAction(`${tag} set routing`, props<{ routes: NavigationRouteDto[] }>()),
};
