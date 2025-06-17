import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CorePaths } from '@ui/core/models/core-paths';
import { getRouterUrl } from '@ui/core/store/router/router.selector';
import { FleetProfileState } from '@ui/modules/fleet-profile/store/fleet-profile.reducer';

export const getFleetProfileStore = createFeatureSelector<FleetProfileState>('fleetProfile');

export const getB2BAvailable = createSelector(getFleetProfileStore, (store: FleetProfileState) => store?.b2bActivated);

export const getIsFleetProfilePage = createSelector(getRouterUrl, (url: string) =>
  url?.includes(`/${CorePaths.WORKSPACE}/${CorePaths.FLEET_PROFILE}`),
);
