import Long from 'long';

export enum GatewayNotificationImportance {
  UNSPECIFIED = 'NOTIFICATION_IMPORTANCE_UNSPECIFIED',
  CRITICAL = 'NOTIFICATION_IMPORTANCE_CRITICAL',
  HIGH = 'NOTIFICATION_IMPORTANCE_HIGH',
  NORMAL = 'NOTIFICATION_IMPORTANCE_NORMAL',
}

export enum GatewayNotificationType {
  UNSPECIFIED = 'NOTIFICATION_TYPE_UNSPECIFIED',
  NOTIFICATION_TYPE_DRIVER_BLOCKED = 'NOTIFICATION_TYPE_DRIVER_BLOCKED',
  NOTIFICATION_TYPE_DRIVER_UNBLOCKED = 'NOTIFICATION_TYPE_DRIVER_UNBLOCKED',
  NOTIFICATION_TYPE_VEHICLE_BLOCKED = 'NOTIFICATION_TYPE_VEHICLE_BLOCKED',
  NOTIFICATION_TYPE_VEHICLE_UNBLOCKED = 'NOTIFICATION_TYPE_VEHICLE_UNBLOCKED',
  NOTIFICATION_TYPE_FLEET_CONTACT_BLOCKED = 'NOTIFICATION_TYPE_FLEET_CONTACT_BLOCKED',
  NOTIFICATION_TYPE_FLEET_CONTACT_UNBLOCKED = 'NOTIFICATION_TYPE_FLEET_CONTACT_UNBLOCKED',
  NOTIFICATION_TYPE_VEHICLE_ADDED_TO_FLEET = 'NOTIFICATION_TYPE_VEHICLE_ADDED_TO_FLEET',
  NOTIFICATION_TYPE_VEHICLE_REMOVED_FROM_FLEET = 'NOTIFICATION_TYPE_VEHICLE_REMOVED_FROM_FLEET',
  NOTIFICATION_TYPE_DRIVER_ADDED_TO_FLEET = 'NOTIFICATION_TYPE_DRIVER_ADDED_TO_FLEET',
  NOTIFICATION_TYPE_DRIVER_REMOVED_FROM_FLEET = 'NOTIFICATION_TYPE_DRIVER_REMOVED_FROM_FLEET',
  NOTIFICATION_TYPE_FLEET_CONTACT_ADDED = 'NOTIFICATION_TYPE_FLEET_CONTACT_ADDED',
  NOTIFICATION_TYPE_FLEET_CONTACT_REMOVED = 'NOTIFICATION_TYPE_FLEET_CONTACT_REMOVED',
  NOTIFICATION_TYPE_DRIVER_BAD_FEEDBACK_RECEIVED = 'NOTIFICATION_TYPE_DRIVER_BAD_FEEDBACK_RECEIVED',
  NOTIFICATION_TYPE_DRIVER_BAD_FEEDBACK_CONFIRMED = 'NOTIFICATION_TYPE_DRIVER_BAD_FEEDBACK_CONFIRMED',
  NOTIFICATION_TYPE_DRIVER_BAD_FEEDBACK_NOT_CONFIRMED = 'NOTIFICATION_TYPE_DRIVER_BAD_FEEDBACK_NOT_CONFIRMED',
  NOTIFICATION_TYPE_VEHICLE_TO_FLEET_ADDITION_TICKET_APPROVED = 'NOTIFICATION_TYPE_VEHICLE_TO_FLEET_ADDITION_TICKET_APPROVED',
  NOTIFICATION_TYPE_VEHICLE_TO_FLEET_ADDITION_TICKET_REJECTED = 'NOTIFICATION_TYPE_VEHICLE_TO_FLEET_ADDITION_TICKET_REJECTED',
  NOTIFICATION_TYPE_VEHICLE_TO_FLEET_ADDITION_TICKET_CLARIFICATION = 'NOTIFICATION_TYPE_VEHICLE_TO_FLEET_ADDITION_TICKET_CLARIFICATION',
  NOTIFICATION_TYPE_FLEET_DRIVER_REGISTRATION_TICKET_SENT = 'NOTIFICATION_TYPE_FLEET_DRIVER_REGISTRATION_TICKET_SENT',
  NOTIFICATION_TYPE_FLEET_DRIVER_REGISTRATION_TICKET_APPROVED = 'NOTIFICATION_TYPE_FLEET_DRIVER_REGISTRATION_TICKET_APPROVED',
  NOTIFICATION_TYPE_FLEET_DRIVER_REGISTRATION_TICKET_REJECTED = 'NOTIFICATION_TYPE_FLEET_DRIVER_REGISTRATION_TICKET_REJECTED',
  NOTIFICATION_TYPE_FLEET_DRIVER_REGISTRATION_TICKET_CLARIFICATION = 'NOTIFICATION_TYPE_FLEET_DRIVER_REGISTRATION_TICKET_CLARIFICATION',
  NOTIFICATION_TYPE_VEHICLE_PHOTO_CONTROL_TICKET_CREATED = 'NOTIFICATION_TYPE_VEHICLE_PHOTO_CONTROL_TICKET_CREATED',
  NOTIFICATION_TYPE_VEHICLE_PHOTO_CONTROL_TICKET_CREATED_BLOCK_IMMEDIATELY = 'NOTIFICATION_TYPE_VEHICLE_PHOTO_CONTROL_TICKET_CREATED_BLOCK_IMMEDIATELY',
  NOTIFICATION_TYPE_VEHICLE_PHOTO_CONTROL_TICKET_APPROVED = 'NOTIFICATION_TYPE_VEHICLE_PHOTO_CONTROL_TICKET_APPROVED',
  NOTIFICATION_TYPE_VEHICLE_PHOTO_CONTROL_TICKET_REJECTED = 'NOTIFICATION_TYPE_VEHICLE_PHOTO_CONTROL_TICKET_REJECTED',
  NOTIFICATION_TYPE_VEHICLE_PHOTO_CONTROL_TICKET_CLARIFICATION = 'NOTIFICATION_TYPE_VEHICLE_PHOTO_CONTROL_TICKET_CLARIFICATION',
  NOTIFICATION_TYPE_VEHICLE_PHOTO_CONTROL_TICKET_DEADLINE_CAME = 'NOTIFICATION_TYPE_VEHICLE_PHOTO_CONTROL_TICKET_DEADLINE_CAME',
  NOTIFICATION_TYPE_B2B_SPLIT_ADJUSTMENT_CHANGED = 'NOTIFICATION_TYPE_B2B_SPLIT_ADJUSTMENT_CHANGED',
  NOTIFICATION_TYPE_B2B_SPLIT_DISTRIBUTION_CHANGED = 'NOTIFICATION_TYPE_B2B_SPLIT_DISTRIBUTION_CHANGED',
  NOTIFICATION_TYPE_B2B_SPLIT_ADJUSTMENT_CANCELED = 'NOTIFICATION_TYPE_B2B_SPLIT_ADJUSTMENT_CANCELED',
  NOTIFICATION_TYPE_FLEET_CABINET_UPDATE = 'NOTIFICATION_TYPE_FLEET_CABINET_UPDATE',
  NOTIFICATION_TYPE_IMPORTANT_INFORMATION = 'NOTIFICATION_TYPE_IMPORTANT_INFORMATION',
  NOTIFICATION_TYPE_ACCEPTANCE_REQUIRED = 'NOTIFICATION_TYPE_ACCEPTANCE_REQUIRED',
  NOTIFICATION_TYPE_DRIVER_PHOTO_CONTROL_TICKET_CREATE = 'NOTIFICATION_TYPE_DRIVER_PHOTO_CONTROL_TICKET_CREATE',
  NOTIFICATION_TYPE_DRIVER_PHOTO_CONTROL_TICKET_CREATED_BLOCK_IMMEDIATELY = 'NOTIFICATION_TYPE_DRIVER_PHOTO_CONTROL_TICKET_CREATED_BLOCK_IMMEDIATELY',
  NOTIFICATION_TYPE_DRIVER_PHOTO_CONTROL_TICKET_APPROVED = 'NOTIFICATION_TYPE_DRIVER_PHOTO_CONTROL_TICKET_APPROVED',
  NOTIFICATION_TYPE_DRIVER_PHOTO_CONTROL_TICKET_REJECTED = 'NOTIFICATION_TYPE_DRIVER_PHOTO_CONTROL_TICKET_REJECTED',
  NOTIFICATION_TYPE_DRIVER_PHOTO_CONTROL_TICKET_CLARIFICATION = 'NOTIFICATION_TYPE_DRIVER_PHOTO_CONTROL_TICKET_CLARIFICATION',
  NOTIFICATION_TYPE_DRIVER_PHOTO_CONTROL_TICKET_DEADLINE_CAME = 'NOTIFICATION_TYPE_DRIVER_PHOTO_CONTROL_TICKET_DEADLINE_CAME',
  NOTIFICATION_TYPE_VEHICLE_BRANDING_PERIOD_TICKET_CREATED = 'VEHICLE_BRANDING_PERIOD_TICKET_CREATED',
  NOTIFICATION_TYPE_VEHICLE_BRANDING_PERIOD_TICKET_CREATED_BULK = 'VEHICLE_BRANDING_PERIOD_TICKET_CREATED_BULK',
  NOTIFICATION_TYPE_VEHICLE_BRANDING_PERIOD_TICKET_REJECTED = 'VEHICLE_BRANDING_PERIOD_TICKET_REJECTED',
  NOTIFICATION_TYPE_VEHICLE_BRANDING_PERIOD_TICKET_CLARIFICATION = 'VEHICLE_BRANDING_PERIOD_TICKET_CLARIFICATION',
  NOTIFICATION_TYPE_VEHICLE_BRANDING_PERIOD_TICKET_DEADLINE_REMINDER = 'VEHICLE_BRANDING_PERIOD_TICKET_DEADLINE_REMINDER',
  NOTIFICATION_TYPE_VEHICLE_BRANDING_PERIOD_TICKET_DEADLINE_REMINDER_BULK = 'VEHICLE_BRANDING_PERIOD_TICKET_DEADLINE_REMINDER_BULK',
  NOTIFICATION_TYPE_VEHICLE_TO_FLEET_ADDITION_TICKET_MANUAL_REMINDER = 'NOTIFICATION_TYPE_VEHICLE_TO_FLEET_ADDITION_TICKET_MANUAL_REMINDER',
  NOTIFICATION_TYPE_DRIVER_PHOTO_CONTROL_TICKET_MANUAL_REMINDER = 'NOTIFICATION_TYPE_DRIVER_PHOTO_CONTROL_TICKET_MANUAL_REMINDER',
  NOTIFICATION_TYPE_VEHICLE_PHOTO_CONTROL_TICKET_MANUAL_REMINDER = 'NOTIFICATION_TYPE_VEHICLE_PHOTO_CONTROL_TICKET_MANUAL_REMINDER',
  NOTIFICATION_TYPE_VEHICLE_BRANDING_PERIOD_TICKET_MANUAL_REMINDER = 'NOTIFICATION_TYPE_VEHICLE_BRANDING_PERIOD_TICKET_MANUAL_REMINDER',
  NOTIFICATION_TYPE_FLEET_DRIVER_CASH_LIMIT_EXCEEDED = 'NOTIFICATION_TYPE_FLEET_DRIVER_CASH_LIMIT_EXCEEDED',
}

export interface NotificationEventDto {
  eventId: string;
  occurredAt: Long;
  notification: {
    id: string;
    receiverAccountId: string;
    fleetId: string;
    message: string;
    type: GatewayNotificationType;
    importance: GatewayNotificationImportance;
    isBulk: boolean;
  };
}

export interface NotificationItemDto {
  id: string;
  sent_at: number;
  is_read: boolean;
  type: NotificationType;
  importance: NotificationImportance;
  message: string;
  is_bulk?: boolean;
  fleet_id?: string;
  is_acceptance_required?: boolean;
  accepted_at?: number;
}

export interface NotificationDetailsDto {
  id: string;
  type: NotificationType;
  image_base_64: string;
  message: string;
  details: string;
  accepted_at: number;
}

export interface NotificationsUnreadCountDto {
  unread_count: number;
}

export enum NotificationImportanceValue {
  UNSPECIFIED = 'Unspecified',
  NORMAL = 'Normal',
  HIGH = 'High',
  CRITICAL = 'Critical',
}

export const NOTIFICATION_IMPORTANCE_MAP = {
  [GatewayNotificationImportance.UNSPECIFIED]: NotificationImportanceValue.UNSPECIFIED,
  [GatewayNotificationImportance.NORMAL]: NotificationImportanceValue.NORMAL,
  [GatewayNotificationImportance.HIGH]: NotificationImportanceValue.HIGH,
  [GatewayNotificationImportance.CRITICAL]: NotificationImportanceValue.CRITICAL,
} as const;

export enum NotificationTypeValue {
  UNSPECIFIED = 'Unspecified',
  DRIVER_BLOCKED = 'DriverBlocked',
  DRIVER_UNBLOCKED = 'DriverUnblocked',
  VEHICLE_BLOCKED = 'VehicleBlocked',
  VEHICLE_UNBLOCKED = 'VehicleUnblocked',
  FLEET_CONTACT_BLOCKED = 'FleetContactBlocked',
  FLEET_CONTACT_UNBLOCKED = 'FleetContactUnblocked',
  VEHICLE_ADDED_TO_FLEET = 'VehicleAddedToFleet',
  VEHICLE_REMOVED_FROM_FLEET = 'VehicleRemovedFromFleet',
  DRIVER_ADDED_TO_FLEET = 'DriverAddedToFleet',
  DRIVER_REMOVED_FROM_FLEET = 'DriverRemovedFromFleet',
  FLEET_CONTACT_ADDED = 'FleetContactAdded',
  FLEET_CONTACT_REMOVED = 'FleetContactRemoved',
  DRIVER_BAD_FEEDBACK_RECEIVED = 'DriverBadFeedbackReceived',
  DRIVER_BAD_FEEDBACK_CONFIRMED = 'DriverBadFeedbackConfirmed',
  DRIVER_BAD_FEEDBACK_NOT_CONFIRMED = 'DriverBadFeedbackNotConfirmed',
  VEHICLE_TO_FLEET_ADDITION_TICKET_APPROVED = 'VehicleToFleetAdditionTicketApproved',
  VEHICLE_TO_FLEET_ADDITION_TICKET_REJECTED = 'VehicleToFleetAdditionTicketRejected',
  VEHICLE_TO_FLEET_ADDITION_TICKET_CLARIFICATION = 'VehicleToFleetAdditionTicketClarification',
  FLEET_DRIVER_REGISTRATION_TICKET_SENT = 'FleetDriverRegistrationTicketSent',
  FLEET_DRIVER_REGISTRATION_TICKET_APPROVED = 'FleetDriverRegistrationTicketApproved',
  FLEET_DRIVER_REGISTRATION_TICKET_REJECTED = 'FleetDriverRegistrationTicketRejected',
  FLEET_DRIVER_REGISTRATION_TICKET_CLARIFICATION = 'FleetDriverRegistrationTicketClarification',
  VEHICLE_PHOTO_CONTROL_TICKET_CREATED = 'VehiclePhotoControlTicketCreated',
  VEHICLE_PHOTO_CONTROL_TICKET_CREATED_BLOCK_IMMEDIATELY = 'VehiclePhotoControlTicketCreatedBlockImmediately',
  VEHICLE_PHOTO_CONTROL_TICKET_APPROVED = 'VehiclePhotoControlTicketApproved',
  VEHICLE_PHOTO_CONTROL_TICKET_REJECTED = 'VehiclePhotoControlTicketRejected',
  VEHICLE_PHOTO_CONTROL_TICKET_CLARIFICATION = 'VehiclePhotoControlTicketClarification',
  VEHICLE_PHOTO_CONTROL_TICKET_DEADLINE_CAME = 'VehiclePhotoControlTicketDeadlineCame',
  B2B_SPLIT_ADJUSTMENT_CHANGED = 'B2BSplitAdjustmentChanged',
  B2B_SPLIT_DISTRIBUTION_CHANGED = 'B2BSplitDistributionChanged',
  B2B_SPLIT_ADJUSTMENT_CANCELED = 'B2BSplitAdjustmentCanceled',
  FLEET_CABINET_UPDATE = 'FleetCabinetUpdate',
  IMPORTANT_INFORMATION = 'ImportantInformation',
  ACCEPTANCE_REQUIRED = 'AcceptanceRequired',
  DRIVER_PHOTO_CONTROL_TICKET_CREATE = 'DriverPhotoControlTicketCreated',
  DRIVER_PHOTO_CONTROL_TICKET_CREATED_BLOCK_IMMEDIATELY = 'DriverPhotoControlTicketCreatedBlockImmediately',
  DRIVER_PHOTO_CONTROL_TICKET_APPROVED = 'DriverPhotoControlTicketApproved',
  DRIVER_PHOTO_CONTROL_TICKET_REJECTED = 'DriverPhotoControlTicketRejected',
  DRIVER_PHOTO_CONTROL_TICKET_CLARIFICATION = 'DriverPhotoControlTicketClarification',
  DRIVER_PHOTO_CONTROL_TICKET_DEADLINE_CAME = 'DriverPhotoControlTicketDeadlineCame',
  VEHICLE_BRANDING_PERIOD_TICKET_CREATED = 'VehicleBrandingPeriodTicketCreated',
  VEHICLE_BRANDING_PERIOD_TICKET_CREATED_BULK = 'VehicleBrandingPeriodTicketCreatedBulk',
  VEHICLE_BRANDING_PERIOD_TICKET_REJECTED = 'VehicleBrandingPeriodTicketRejected',
  VEHICLE_BRANDING_PERIOD_TICKET_CLARIFICATION = 'VehicleBrandingPeriodTicketClarification',
  VEHICLE_BRANDING_PERIOD_TICKET_DEADLINE_REMINDER = 'VehicleBrandingPeriodTicketDeadlineReminder',
  VEHICLE_BRANDING_PERIOD_TICKET_DEADLINE_REMINDER_BULK = 'VehicleBrandingPeriodTicketDeadlineReminderBulk',
  VEHICLE_TO_FLEET_ADDITION_TICKET_MANUAL_REMINDER = 'VehicleToFleetAdditionTicketManualReminder',
  DRIVER_PHOTO_CONTROL_TICKET_MANUAL_REMINDER = 'DriverPhotoControlTicketManualReminder',
  VEHICLE_PHOTO_CONTROL_TICKET_MANUAL_REMINDER = 'VehiclePhotoControlTicketManualReminder',
  VEHICLE_BRANDING_PERIOD_TICKET_MANUAL_REMINDER = 'VehicleBrandingPeriodTicketManualReminder',
  FLEET_DRIVER_CASH_LIMIT_EXCEEDED = 'FleetDriverCashLimitExceeded',
}

export const NOTIFICATION_TYPE_MAP = {
  [GatewayNotificationType.UNSPECIFIED]: NotificationTypeValue.UNSPECIFIED,
  [GatewayNotificationType.NOTIFICATION_TYPE_DRIVER_BLOCKED]: NotificationTypeValue.DRIVER_BLOCKED,
  [GatewayNotificationType.NOTIFICATION_TYPE_DRIVER_UNBLOCKED]: NotificationTypeValue.DRIVER_UNBLOCKED,
  [GatewayNotificationType.NOTIFICATION_TYPE_VEHICLE_BLOCKED]: NotificationTypeValue.VEHICLE_BLOCKED,
  [GatewayNotificationType.NOTIFICATION_TYPE_VEHICLE_UNBLOCKED]: NotificationTypeValue.VEHICLE_UNBLOCKED,
  [GatewayNotificationType.NOTIFICATION_TYPE_FLEET_CONTACT_BLOCKED]: NotificationTypeValue.FLEET_CONTACT_BLOCKED,
  [GatewayNotificationType.NOTIFICATION_TYPE_FLEET_CONTACT_UNBLOCKED]: NotificationTypeValue.FLEET_CONTACT_UNBLOCKED,
  [GatewayNotificationType.NOTIFICATION_TYPE_VEHICLE_ADDED_TO_FLEET]: NotificationTypeValue.VEHICLE_ADDED_TO_FLEET,
  [GatewayNotificationType.NOTIFICATION_TYPE_VEHICLE_REMOVED_FROM_FLEET]:
    NotificationTypeValue.VEHICLE_REMOVED_FROM_FLEET,
  [GatewayNotificationType.NOTIFICATION_TYPE_DRIVER_ADDED_TO_FLEET]: NotificationTypeValue.DRIVER_ADDED_TO_FLEET,
  [GatewayNotificationType.NOTIFICATION_TYPE_DRIVER_REMOVED_FROM_FLEET]:
    NotificationTypeValue.DRIVER_REMOVED_FROM_FLEET,
  [GatewayNotificationType.NOTIFICATION_TYPE_FLEET_CONTACT_ADDED]: NotificationTypeValue.FLEET_CONTACT_ADDED,
  [GatewayNotificationType.NOTIFICATION_TYPE_FLEET_CONTACT_REMOVED]: NotificationTypeValue.FLEET_CONTACT_REMOVED,
  [GatewayNotificationType.NOTIFICATION_TYPE_DRIVER_BAD_FEEDBACK_RECEIVED]:
    NotificationTypeValue.DRIVER_BAD_FEEDBACK_RECEIVED,
  [GatewayNotificationType.NOTIFICATION_TYPE_DRIVER_BAD_FEEDBACK_CONFIRMED]:
    NotificationTypeValue.DRIVER_BAD_FEEDBACK_CONFIRMED,
  [GatewayNotificationType.NOTIFICATION_TYPE_DRIVER_BAD_FEEDBACK_NOT_CONFIRMED]:
    NotificationTypeValue.DRIVER_BAD_FEEDBACK_NOT_CONFIRMED,
  [GatewayNotificationType.NOTIFICATION_TYPE_VEHICLE_TO_FLEET_ADDITION_TICKET_APPROVED]:
    NotificationTypeValue.VEHICLE_TO_FLEET_ADDITION_TICKET_APPROVED,
  [GatewayNotificationType.NOTIFICATION_TYPE_VEHICLE_TO_FLEET_ADDITION_TICKET_REJECTED]:
    NotificationTypeValue.VEHICLE_TO_FLEET_ADDITION_TICKET_REJECTED,
  [GatewayNotificationType.NOTIFICATION_TYPE_VEHICLE_TO_FLEET_ADDITION_TICKET_CLARIFICATION]:
    NotificationTypeValue.VEHICLE_TO_FLEET_ADDITION_TICKET_CLARIFICATION,
  [GatewayNotificationType.NOTIFICATION_TYPE_FLEET_DRIVER_REGISTRATION_TICKET_SENT]:
    NotificationTypeValue.FLEET_DRIVER_REGISTRATION_TICKET_SENT,
  [GatewayNotificationType.NOTIFICATION_TYPE_FLEET_DRIVER_REGISTRATION_TICKET_APPROVED]:
    NotificationTypeValue.FLEET_DRIVER_REGISTRATION_TICKET_APPROVED,
  [GatewayNotificationType.NOTIFICATION_TYPE_FLEET_DRIVER_REGISTRATION_TICKET_REJECTED]:
    NotificationTypeValue.FLEET_DRIVER_REGISTRATION_TICKET_REJECTED,
  [GatewayNotificationType.NOTIFICATION_TYPE_FLEET_DRIVER_REGISTRATION_TICKET_CLARIFICATION]:
    NotificationTypeValue.FLEET_DRIVER_REGISTRATION_TICKET_CLARIFICATION,
  [GatewayNotificationType.NOTIFICATION_TYPE_VEHICLE_PHOTO_CONTROL_TICKET_CREATED]:
    NotificationTypeValue.VEHICLE_PHOTO_CONTROL_TICKET_CREATED,
  [GatewayNotificationType.NOTIFICATION_TYPE_VEHICLE_PHOTO_CONTROL_TICKET_CREATED_BLOCK_IMMEDIATELY]:
    NotificationTypeValue.VEHICLE_PHOTO_CONTROL_TICKET_CREATED_BLOCK_IMMEDIATELY,
  [GatewayNotificationType.NOTIFICATION_TYPE_VEHICLE_PHOTO_CONTROL_TICKET_APPROVED]:
    NotificationTypeValue.VEHICLE_PHOTO_CONTROL_TICKET_APPROVED,
  [GatewayNotificationType.NOTIFICATION_TYPE_VEHICLE_PHOTO_CONTROL_TICKET_REJECTED]:
    NotificationTypeValue.VEHICLE_PHOTO_CONTROL_TICKET_REJECTED,
  [GatewayNotificationType.NOTIFICATION_TYPE_VEHICLE_PHOTO_CONTROL_TICKET_CLARIFICATION]:
    NotificationTypeValue.VEHICLE_PHOTO_CONTROL_TICKET_CLARIFICATION,
  [GatewayNotificationType.NOTIFICATION_TYPE_VEHICLE_PHOTO_CONTROL_TICKET_DEADLINE_CAME]:
    NotificationTypeValue.VEHICLE_PHOTO_CONTROL_TICKET_DEADLINE_CAME,
  [GatewayNotificationType.NOTIFICATION_TYPE_B2B_SPLIT_ADJUSTMENT_CHANGED]:
    NotificationTypeValue.B2B_SPLIT_ADJUSTMENT_CHANGED,
  [GatewayNotificationType.NOTIFICATION_TYPE_B2B_SPLIT_DISTRIBUTION_CHANGED]:
    NotificationTypeValue.B2B_SPLIT_DISTRIBUTION_CHANGED,
  [GatewayNotificationType.NOTIFICATION_TYPE_B2B_SPLIT_ADJUSTMENT_CANCELED]:
    NotificationTypeValue.B2B_SPLIT_ADJUSTMENT_CANCELED,
  [GatewayNotificationType.NOTIFICATION_TYPE_FLEET_CABINET_UPDATE]: NotificationTypeValue.FLEET_CABINET_UPDATE,
  [GatewayNotificationType.NOTIFICATION_TYPE_IMPORTANT_INFORMATION]: NotificationTypeValue.IMPORTANT_INFORMATION,
  [GatewayNotificationType.NOTIFICATION_TYPE_ACCEPTANCE_REQUIRED]: NotificationTypeValue.ACCEPTANCE_REQUIRED,
  [GatewayNotificationType.NOTIFICATION_TYPE_DRIVER_PHOTO_CONTROL_TICKET_CREATE]:
    NotificationTypeValue.DRIVER_PHOTO_CONTROL_TICKET_CREATE,
  [GatewayNotificationType.NOTIFICATION_TYPE_DRIVER_PHOTO_CONTROL_TICKET_CREATED_BLOCK_IMMEDIATELY]:
    NotificationTypeValue.DRIVER_PHOTO_CONTROL_TICKET_CREATED_BLOCK_IMMEDIATELY,
  [GatewayNotificationType.NOTIFICATION_TYPE_DRIVER_PHOTO_CONTROL_TICKET_APPROVED]:
    NotificationTypeValue.DRIVER_PHOTO_CONTROL_TICKET_APPROVED,
  [GatewayNotificationType.NOTIFICATION_TYPE_DRIVER_PHOTO_CONTROL_TICKET_REJECTED]:
    NotificationTypeValue.DRIVER_PHOTO_CONTROL_TICKET_REJECTED,
  [GatewayNotificationType.NOTIFICATION_TYPE_DRIVER_PHOTO_CONTROL_TICKET_CLARIFICATION]:
    NotificationTypeValue.DRIVER_PHOTO_CONTROL_TICKET_CLARIFICATION,
  [GatewayNotificationType.NOTIFICATION_TYPE_DRIVER_PHOTO_CONTROL_TICKET_DEADLINE_CAME]:
    NotificationTypeValue.DRIVER_PHOTO_CONTROL_TICKET_DEADLINE_CAME,
  [GatewayNotificationType.NOTIFICATION_TYPE_VEHICLE_BRANDING_PERIOD_TICKET_CREATED]:
    NotificationTypeValue.VEHICLE_BRANDING_PERIOD_TICKET_CREATED,
  [GatewayNotificationType.NOTIFICATION_TYPE_VEHICLE_BRANDING_PERIOD_TICKET_CREATED_BULK]:
    NotificationTypeValue.VEHICLE_BRANDING_PERIOD_TICKET_CREATED_BULK,
  [GatewayNotificationType.NOTIFICATION_TYPE_VEHICLE_BRANDING_PERIOD_TICKET_REJECTED]:
    NotificationTypeValue.VEHICLE_BRANDING_PERIOD_TICKET_REJECTED,
  [GatewayNotificationType.NOTIFICATION_TYPE_VEHICLE_BRANDING_PERIOD_TICKET_CLARIFICATION]:
    NotificationTypeValue.VEHICLE_BRANDING_PERIOD_TICKET_CLARIFICATION,
  [GatewayNotificationType.NOTIFICATION_TYPE_VEHICLE_BRANDING_PERIOD_TICKET_DEADLINE_REMINDER]:
    NotificationTypeValue.VEHICLE_BRANDING_PERIOD_TICKET_DEADLINE_REMINDER,
  [GatewayNotificationType.NOTIFICATION_TYPE_VEHICLE_BRANDING_PERIOD_TICKET_DEADLINE_REMINDER_BULK]:
    NotificationTypeValue.VEHICLE_BRANDING_PERIOD_TICKET_DEADLINE_REMINDER_BULK,
  [GatewayNotificationType.NOTIFICATION_TYPE_VEHICLE_TO_FLEET_ADDITION_TICKET_MANUAL_REMINDER]:
    NotificationTypeValue.VEHICLE_TO_FLEET_ADDITION_TICKET_MANUAL_REMINDER,
  [GatewayNotificationType.NOTIFICATION_TYPE_DRIVER_PHOTO_CONTROL_TICKET_MANUAL_REMINDER]:
    NotificationTypeValue.DRIVER_PHOTO_CONTROL_TICKET_MANUAL_REMINDER,
  [GatewayNotificationType.NOTIFICATION_TYPE_VEHICLE_PHOTO_CONTROL_TICKET_MANUAL_REMINDER]:
    NotificationTypeValue.VEHICLE_PHOTO_CONTROL_TICKET_MANUAL_REMINDER,
  [GatewayNotificationType.NOTIFICATION_TYPE_VEHICLE_BRANDING_PERIOD_TICKET_MANUAL_REMINDER]:
    NotificationTypeValue.VEHICLE_BRANDING_PERIOD_TICKET_MANUAL_REMINDER,
  [GatewayNotificationType.NOTIFICATION_TYPE_FLEET_DRIVER_CASH_LIMIT_EXCEEDED]:
    NotificationTypeValue.FLEET_DRIVER_CASH_LIMIT_EXCEEDED,
} as const;

export type NotificationImportance = (typeof NOTIFICATION_IMPORTANCE_MAP)[keyof typeof NOTIFICATION_IMPORTANCE_MAP];
export type NotificationType = (typeof NOTIFICATION_TYPE_MAP)[keyof typeof NOTIFICATION_TYPE_MAP];
