export enum BlockedListStatusValue {
  ACTIVE = 'Active',
  BLOCKED = 'Blocked',
  ALL = 'All',
}

export enum BlockedListStatusReason {
  DRIVER_FORGERY_DOCUMENTS = 'ForgeryDocuments',
  DRIVER_FRAUD_ACTION_WITH_ORDER = 'FraudActionWithOrder',
  DRIVER_ACCOUNT_SHARING = 'AccountSharing',
  DRIVER_LOW_RATING = 'LowRating',
  ACTIVE_DEFERRED_ORDERS_LIMIT = 'ActiveDeferredOrdersLimit',

  VEHICLE_CRITICAL_STATE = 'CriticalState',
  VEHICLE_FAKE_PHOTOSHOP = 'FakePhotoshop',
  VEHICLE_CONFLICT_RESOLVED = 'ConflictResolved',
  VEHICLE_REPAIRED = 'VehicleRepaired',
  VEHICLE_MISS_BLOCKING = 'MissBlocking',

  BYPASS_BLOCKING = 'BypassBlocking',
  PHOTO_CONTROL = 'ByPhotoControl',
  PHOTO_CONTROL_PASSED = 'PhotoControlPassed',

  BY_SELF_EMPLOYMENT = 'BySelfEmployment',
  BY_UKLON_COLLABORATION = 'ByUklonCollaboration',
  BY_SELF_EMPLOYMENT_OR_UKLON_COLLABORATION = 'BySelfEmploymentOrUklonCollaboration',

  OTHER = 'Other',
}
