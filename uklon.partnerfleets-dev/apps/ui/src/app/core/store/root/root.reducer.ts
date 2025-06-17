import { LanguageExpression } from '@data-access';
import { createReducer, on } from '@ngrx/store';
import { rootActions } from '@ui/core/store/root/root.actions';
import { NavigationRouteDto } from '@ui/shared/models';
import { environment } from '@ui-env/environment';
import { EnvironmentModel } from '@ui-env/environment.model';

export interface RootState {
  loading: boolean;
  language?: LanguageExpression;
  config: EnvironmentModel;
  routes: NavigationRouteDto[];
}

export const initialState: RootState = {
  loading: false,
  config: environment,
  routes: [],
};

export const rootReducer = createReducer(
  initialState,

  on(rootActions.setConfig, (state, config) => ({
    ...state,
    config,
  })),

  on(rootActions.setLanguage, (state, { language }) => ({
    ...state,
    language,
  })),

  on(rootActions.setRouts, (state, { routes }) => ({
    ...state,
    routes,
  })),
);
