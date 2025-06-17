export enum TicketStatus {
  ALL = 'All',
  DRAFT = 'Draft',
  SENT = 'Sent',
  REVIEW = 'Review',
  CLARIFICATION = 'Clarification',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  BLOCKED_BY_MANAGER = 'BlockedByManager',
}

export enum VehiclePhotoControlCreatingReason {
  BY_VEHICLE_MODEL = 'ByVehicleModel',
  REGULAR = 'Regular',
  AFTER_FIRST_ORDERS = 'AfterFirstOrders',
  COMPLAINT = 'Complaint',
  OTHER = 'Other',
}

export enum DriverPhotoControlCreatingReason {
  AFTER_FIRST_ORDERS = 'AfterFirstOrders',
  DOCUMENTS_OR_PHOTO_ABSENCE = 'DocumentsOrPhotoAbsence',
  DOCUMENTS_ACTUALIZATION = 'DocumentsActualization',
  PROFILE_DATA_ACTUALIZATION = 'ProfileDataActualization',
  ADDITIONAL_DOCUMENTS_GATHERING = 'AdditionalDocumentsGathering',
  OTHER = 'Other',
}
