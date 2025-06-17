import { NotificationType, NotificationTypeValue } from '@data-access';

// eslint-disable-next-line complexity
export const NOTIFICATION_TYPE_ICON = (type: NotificationType): string => {
  switch (type) {
    case NotificationTypeValue.DRIVER_UNBLOCKED:
    case NotificationTypeValue.DRIVER_ADDED_TO_FLEET:
    case NotificationTypeValue.FLEET_DRIVER_REGISTRATION_TICKET_SENT:
    case NotificationTypeValue.FLEET_DRIVER_REGISTRATION_TICKET_APPROVED:
    case NotificationTypeValue.FLEET_DRIVER_REGISTRATION_TICKET_REJECTED:
    case NotificationTypeValue.FLEET_DRIVER_CASH_LIMIT_EXCEEDED:
      return 'i-notification-driver';
    case NotificationTypeValue.DRIVER_REMOVED_FROM_FLEET:
      return 'i-notification-driver-delete';
    case NotificationTypeValue.VEHICLE_ADDED_TO_FLEET:
    case NotificationTypeValue.VEHICLE_UNBLOCKED:
    case NotificationTypeValue.VEHICLE_TO_FLEET_ADDITION_TICKET_REJECTED:
    case NotificationTypeValue.VEHICLE_TO_FLEET_ADDITION_TICKET_APPROVED:
      return 'i-notification-car';
    case NotificationTypeValue.VEHICLE_REMOVED_FROM_FLEET:
      return 'i-notification-car-delete';
    case NotificationTypeValue.FLEET_CONTACT_UNBLOCKED:
      return 'i-notification-contact';
    case NotificationTypeValue.VEHICLE_PHOTO_CONTROL_TICKET_CREATED:
    case NotificationTypeValue.VEHICLE_PHOTO_CONTROL_TICKET_CREATED_BLOCK_IMMEDIATELY:
    case NotificationTypeValue.VEHICLE_PHOTO_CONTROL_TICKET_APPROVED:
    case NotificationTypeValue.VEHICLE_PHOTO_CONTROL_TICKET_REJECTED:
    case NotificationTypeValue.VEHICLE_PHOTO_CONTROL_TICKET_CLARIFICATION:
    case NotificationTypeValue.VEHICLE_PHOTO_CONTROL_TICKET_DEADLINE_CAME:
    case NotificationTypeValue.DRIVER_PHOTO_CONTROL_TICKET_CREATE:
    case NotificationTypeValue.DRIVER_PHOTO_CONTROL_TICKET_CREATED_BLOCK_IMMEDIATELY:
    case NotificationTypeValue.DRIVER_PHOTO_CONTROL_TICKET_APPROVED:
    case NotificationTypeValue.DRIVER_PHOTO_CONTROL_TICKET_REJECTED:
    case NotificationTypeValue.DRIVER_PHOTO_CONTROL_TICKET_CLARIFICATION:
    case NotificationTypeValue.DRIVER_PHOTO_CONTROL_TICKET_DEADLINE_CAME:
    case NotificationTypeValue.DRIVER_PHOTO_CONTROL_TICKET_MANUAL_REMINDER:
    case NotificationTypeValue.VEHICLE_PHOTO_CONTROL_TICKET_MANUAL_REMINDER:
      return 'i-notification-photo-control';
    case NotificationTypeValue.FLEET_CONTACT_ADDED:
      return 'i-notification-contact';
    case NotificationTypeValue.FLEET_CONTACT_REMOVED:
      return 'i-notification-contact-delete';
    case NotificationTypeValue.VEHICLE_BLOCKED:
    case NotificationTypeValue.DRIVER_BLOCKED:
    case NotificationTypeValue.FLEET_CONTACT_BLOCKED:
      return 'i-notification-block';
    case NotificationTypeValue.VEHICLE_TO_FLEET_ADDITION_TICKET_CLARIFICATION:
    case NotificationTypeValue.FLEET_DRIVER_REGISTRATION_TICKET_CLARIFICATION:
    case NotificationTypeValue.VEHICLE_TO_FLEET_ADDITION_TICKET_MANUAL_REMINDER:
      return 'i-notification-ticket';
    case NotificationTypeValue.DRIVER_BAD_FEEDBACK_RECEIVED:
    case NotificationTypeValue.DRIVER_BAD_FEEDBACK_CONFIRMED:
    case NotificationTypeValue.DRIVER_BAD_FEEDBACK_NOT_CONFIRMED:
      return 'i-notification-feedback';
    case NotificationTypeValue.B2B_SPLIT_ADJUSTMENT_CHANGED:
    case NotificationTypeValue.B2B_SPLIT_DISTRIBUTION_CHANGED:
    case NotificationTypeValue.B2B_SPLIT_ADJUSTMENT_CANCELED:
      return 'i-notification-b2b';
    case NotificationTypeValue.VEHICLE_BRANDING_PERIOD_TICKET_CREATED:
    case NotificationTypeValue.VEHICLE_BRANDING_PERIOD_TICKET_CREATED_BULK:
    case NotificationTypeValue.VEHICLE_BRANDING_PERIOD_TICKET_REJECTED:
    case NotificationTypeValue.VEHICLE_BRANDING_PERIOD_TICKET_CLARIFICATION:
    case NotificationTypeValue.VEHICLE_BRANDING_PERIOD_TICKET_DEADLINE_REMINDER:
    case NotificationTypeValue.VEHICLE_BRANDING_PERIOD_TICKET_DEADLINE_REMINDER_BULK:
    case NotificationTypeValue.VEHICLE_BRANDING_PERIOD_TICKET_MANUAL_REMINDER:
      return 'i-branded-empty';
    default:
      return 'i-notification-info';
  }
};
