import {
  FleetFiscalizationSettingsDto,
  FleetFiscalizationStatusDto,
  FleetSignatureKeyDto,
  FleetSignatureKeysCollection,
  FleetVehicleCollectionQueryDto,
  FleetVehicleFiscalizationCollectionDto,
  FleetVehicleWithFiscalizationUnlinkDto,
  GatewayFleetCashPointCollection,
  UpdateFleetFiscalizationStatusDto,
} from '@data-access';
import { createAction, props } from '@ngrx/store';
import { LinkCashierToVehiclePayload } from '@ui/modules/fleet-profile/features/fleet-rro/components/fleet-vehicle-list/fleet-vehicle-list.component';
import { ActivateFiscalizationDialogDto } from '@ui/modules/fleet-profile/features/fleet-rro/models';

import { OpenRemoveKeyPayload } from '../components/fleet-key-list/fleet-key-list.component';

const tag = '[fleet rro]';

export const fleetRROActions = {
  getFiscalizationSettings: createAction(`${tag} get fleet fiscalization settings`),
  getFiscalizationSettingsSuccess: createAction(
    `${tag} get fleet fiscalization settings success`,
    props<{ settings: FleetFiscalizationSettingsDto }>(),
  ),
  getFiscalizationSettingsFailed: createAction(`${tag} get fleet fiscalization settings failed`),

  updateFiscalizationSettings: createAction(
    `${tag} update fleet fiscalization settings`,
    props<{ settings: FleetFiscalizationSettingsDto }>(),
  ),
  updateFiscalizationSettingsSuccess: createAction(`${tag} update fleet fiscalization settings success`),
  updateFiscalizationSettingsFailed: createAction(`${tag} update fleet fiscalization settings failed`),

  openFiscalizationSettingsDialog: createAction(`${tag} open fiscalization settings dialog`),

  getFiscalizationStatus: createAction(`${tag} get fleet fiscalization status`),
  getFiscalizationStatusSuccess: createAction(
    `${tag} get fleet fiscalization status success`,
    props<FleetFiscalizationStatusDto>(),
  ),
  getFiscalizationStatusFailed: createAction(`${tag} get fleet fiscalization status failed`),

  updateFiscalizationStatus: createAction(
    `${tag} update fleet fiscalization status`,
    props<UpdateFleetFiscalizationStatusDto>(),
  ),
  updateFiscalizationStatusSuccess: createAction(
    `${tag} update fleet fiscalization status success`,
    props<UpdateFleetFiscalizationStatusDto>(),
  ),
  updateFiscalizationStatusFailed: createAction(`${tag} update fleet fiscalization status failed`),

  showUpdateFiscalizationStatusNotification: createAction(
    `${tag} update fleet fiscalization status notification`,
    props<UpdateFleetFiscalizationStatusDto>(),
  ),

  toggleActivateFiscalization: createAction(`${tag} toggle activate fiscalization`),

  openActivateFiscalizationModal: createAction(
    `${tag} activate fiscalization modal`,
    props<ActivateFiscalizationDialogDto>(),
  ),

  openUploadSignatureKeyModal: createAction(`${tag} open upload signature key`),
  closeUploadSignatureKeyModal: createAction(`${tag} close upload signature key`),
  openConfirmationModal: createAction(`${tag} open confirmation modal`),
  openHowToGetKeyModal: createAction(`${tag} open how to get key modal`),

  startUploadSignatureKey: createAction(`${tag} start upload signature key`),
  uploadSignatureKeyFailed: createAction(`${tag} upload signature key failed`),
  uploadSignatureKeySuccess: createAction(`${tag} upload signature key success`),

  getSignatureKeys: createAction(`${tag} get fleet signature keys`),
  getSignatureKeysSuccess: createAction(
    `${tag} get fleet signature keys success`,
    props<{ keys: FleetSignatureKeysCollection }>(),
  ),
  getSignatureKeysFailed: createAction(`${tag} get fleet signature keys failed`),

  removeSignatureKey: createAction(`${tag} remove signature key`, props<{ keyId: string }>()),
  removeSignatureKeySuccess: createAction(`${tag} remove signature key success`),
  removeSignatureKeyFailed: createAction(`${tag} remove signature key failed`),

  openRemoveKeyModal: createAction(`${tag} open remove key modal`, props<OpenRemoveKeyPayload>()),
  openKeyInfoModal: createAction(`${tag} open key info modal`, props<{ key: FleetSignatureKeyDto }>()),

  openLinkCashToKeyModal: createAction(`${tag} open link cash to key modal`, props<{ cashierId: string }>()),
  closeLinkCashToKeyModal: createAction(`${tag} close link cash to key modal`),

  openLinkCashToVehicleModal: createAction(
    `${tag} open link cash to vehicle modal`,
    props<LinkCashierToVehiclePayload>(),
  ),

  openUnLinkCashFromVehicleModal: createAction(
    `${tag} open unlink cash from vehicle modal`,
    props<FleetVehicleWithFiscalizationUnlinkDto>(),
  ),

  getCashierPositions: createAction(`${tag} get fleet cashier positions`, props<{ cashierId: string }>()),
  getCashierPositionsSuccess: createAction(
    `${tag} get fleet cashier positions success`,
    props<{ cashiers: GatewayFleetCashPointCollection }>(),
  ),
  getCashierPositionsFailed: createAction(`${tag} get fleet cashier positions failed`),

  getFleetVehicles: createAction(
    `${tag} get fleet fiscalization vehicles`,
    props<{ query: FleetVehicleCollectionQueryDto }>(),
  ),
  getFleetVehiclesSuccess: createAction(
    `${tag} get fleet fiscalization vehicles success`,
    props<{ vehicles: FleetVehicleFiscalizationCollectionDto }>(),
  ),
  getFleetVehiclesFailed: createAction(`${tag} get fleet fiscalization vehicles failed`),

  clearState: createAction(`${tag} clear rro state`),
};
