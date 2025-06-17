import { FleetCashPointStatus } from '@data-access';
import { Action } from '@ngrx/store';
import { StatusColor } from '@ui/shared';
import { SimpleData, SimpleModalType } from '@ui/shared/dialogs/simple-modal/simple-modal.component';

export interface ActivateFiscalizationDialogDto {
  data: SimpleData;
  callbackAction?: Action;
}

export const ACTIVATE_FISCALIZATION_NOTIFICATIONS = {
  success: 'FleetProfile.RRO.Modals.Fiscalization.Notification.Activate.Success',
  error: 'FleetProfile.RRO.Modals.Fiscalization.Notification.Activate.Error',
};

export const DEACTIVATE_FISCALIZATION_NOTIFICATIONS = {
  success: 'FleetProfile.RRO.Modals.Fiscalization.Notification.Deactivate.Success',
  error: 'FleetProfile.RRO.Modals.Fiscalization.Notification.Deactivate.Success',
};

export const UNAVAILABLE_FISCALIZATION_MODAL_DATA: SimpleData = {
  modalType: SimpleModalType.NEGATIVE,
  title: 'FleetProfile.RRO.Modals.Fiscalization.Title.Unavailable',
  content: 'FleetProfile.RRO.Modals.Fiscalization.Content.Unavailable',
  cancelBtn: 'Common.Buttons.B_Close',
};

export const FISCALIZATION_DEACTIVATE_MODAL_DATA: SimpleData = {
  modalType: SimpleModalType.NEGATIVE,
  title: 'FleetProfile.RRO.Modals.Fiscalization.Title.Deactivate',
  content: 'FleetProfile.RRO.Modals.Fiscalization.Content.Deactivate',
  cancelBtn: 'Common.Buttons.B_Reject',
  acceptBtn: 'Common.Buttons.B_Deactivate',
};

export const ACTIVATE_FISCALIZATION_MODAL_DATA: SimpleData = {
  modalType: SimpleModalType.POSITIVE,
  title: 'FleetProfile.RRO.Modals.Fiscalization.Title.Activate',
  content: 'FleetProfile.RRO.Modals.Fiscalization.Content.Activate',
  cancelBtn: 'Common.Buttons.B_Reject',
  acceptBtn: 'Common.Buttons.B_Activate',
};

export const REMOVE_SIGNATURE_KEY_MODAL_DATA: SimpleData = {
  modalType: SimpleModalType.NEGATIVE,
  title: 'FleetProfile.RRO.Modals.RemoveKey.Title',
  cancelBtn: 'Common.Buttons.B_Reject',
  acceptBtn: 'Common.Buttons.B_Delete',
};

export const VEHICLE_FISCALIZATION_STATUS_COLOR: Record<string, StatusColor> = {
  [FleetCashPointStatus.OPEN]: 'success',
  [FleetCashPointStatus.CLOSED]: 'neutral',
};
