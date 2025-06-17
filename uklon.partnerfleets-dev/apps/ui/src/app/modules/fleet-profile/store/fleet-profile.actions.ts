import { IndividualEntrepreneurCollectionDto } from '@data-access';
import { createAction, props } from '@ngrx/store';

const tag = '[fleet profile]';

export const fleetProfileActions = {
  getFleetEntrepreneurs: createAction(`${tag} get fleet entrepreneurs`),
  getFleetEntrepreneursSuccess: createAction(
    `${tag} get fleet entrepreneurs success`,
    props<IndividualEntrepreneurCollectionDto>(),
  ),
  getFleetEntrepreneursFailed: createAction(`${tag} get fleet entrepreneurs failed`),

  clearState: createAction(`${tag} clear fleet profile state`),
};
