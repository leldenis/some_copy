import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RootState } from '@ui/core/store/root/root.reducer';
import { EnvironmentModel } from '@ui-env/environment.model';

export const getRootStore = createFeatureSelector<RootState>('root');

export const selectLoading = createSelector(getRootStore, (rootStore: RootState) => rootStore?.loading);

export const getConfig = createSelector(getRootStore, (rootStore: RootState) => rootStore?.config);

export const selectLanguage = createSelector(getRootStore, (rootStore: RootState) => rootStore?.language);

export const getUserAgreementLink = createSelector(getConfig, (config) =>
  config?.externalLinks?.uklon ? `${config.externalLinks.uklon}/user-agreement` : '',
);

export const getShowFeatureCargo = createSelector(getConfig, (config: EnvironmentModel) => config?.showCargo);

export const getSupportWidget = createSelector(getConfig, (config: EnvironmentModel) => config?.supportWidget);

export const navigationRoutes = createSelector(getRootStore, (rootStore: RootState) => rootStore.routes);

export const financialAuthLink = createSelector(getConfig, (config: EnvironmentModel) => config?.financialAuthLink);

export const getRROEnabled = createSelector(getConfig, (config: EnvironmentModel) => config?.rroEnabled);
