import { DriverFinanceAllowing, Restriction, RestrictionReason, TicketStatus } from '@constant';

import { Timestamp, UID } from '../utils';

export interface LinkedEntityDto {
  id: UID;
  type: string;
}

export interface AppUserSnapshotDto {
  account_id: UID;
  display_name: string;
  roles: string[];
}

export interface DriverRestrictionDto {
  type: Restriction;
  restricted_by: RestrictionReason;
  fleet_id: UID;
  fleet_name: string;
  actual_from: number;
  actual_till: number;
  created_at: number;
  linked_entity: LinkedEntityDto;
  created_by: AppUserSnapshotDto;
  current_fleet_id: UID;
}

export interface DriverRestrictionListDto {
  items?: DriverRestrictionDto[];
}

export interface DriverFinanceAllowingDto {
  is_allowing: boolean;
  configured_by: DriverFinanceAllowing;
}

export interface DriverFinanceProfileDto {
  order_payment_to_card: DriverFinanceAllowingDto;
  wallet_to_card_transfer: DriverFinanceAllowingDto;
}

export interface UpdateDriverFinanceProfileDto {
  order_payment_to_card_allowed: boolean;
  wallet_to_card_transfer_allowed: boolean;
}

export interface FleetDriverRestrictionUpdateDto {
  type: Restriction;
  actual_from?: number;
  actual_till?: number;
}

export interface FleetDriverRestrictionDeleteDto {
  type: Restriction;
}

export enum TicketOrigin {
  UG = 'ug',
}

export interface FleetDriverRegistrationTicketDto {
  id: UID;
  first_name: string;
  last_name: string;
  phone: string;
  created_at: Timestamp;
  status: TicketStatus;
  origin?: TicketOrigin;
}

export interface FeedbackDriverDto {
  id: UID;
  last_name: string;
  first_name: string;
}

export enum FeedbackStatus {
  UNKNOWN = 'Unknown',
  CONFIRMED = 'Confirmed',
  WAITING_FOR_PROCESSING = 'WaitingForProcessing',
  REJECTED = 'Rejected',
}

export enum TemplateComment {
  UNKNOWN = 'Unknown',
  DIRTY_VEHICLE = 'DirtyVehicle',
  DRIVER_WITHOUT_MASK = 'DriverWithoutMask',
  DRIVER_BEHAVIOR = 'DriverBehaviour',
  VEHICLE_STATE = 'VehicleState',
  NO_CHANGE = 'NoChange',
  NO_BELTS = 'NoBelts',
  ANOTHER_VEHICLE = 'AnotherVehicle',
  SUBOPTIMAL_ROUTE = 'SuboptimalRoute',
  GREAT_SERVICE = 'GreatService',
  NICE_VEHICLE = 'NiceVehicle',
  WONDERFUL_COMPANION = 'WonderfulCompanion',
  CLEAN = 'Clean',
  EXPERT_NAVIGATION = 'ExpertNavigation',
  RECOMMEND = 'Recommend',
  ANTI_UKRAINIAN_POSITION = 'AntiUkrainianPosition',
  DRIVER_SKILLS = 'DriverSkills',
  NICE_SERVICE = 'NiceService',
  NICE_DRIVER = 'NiceDriver',
  NO_TOOLS = 'NoTools',
  NOT_SOLVE_PROBLEM = 'NotSolveProblem',
  DAMAGED_CAR = 'DamagedCar',
  UNPROFESSIONAL_BEHAVIOR = 'UnprofessionalBehavior',
  DIRTY_INTERIOR = 'DirtyInterior',
  UNPLEASANT_ODOURS = 'UnpleasantOdours',
  DRIVER_WAS_LATE = 'DriverWasLate',
  NO_BOOT_SPACE = 'NoBootSpace',
  NO_EXPERT_NAVIGATION = 'NoExpertNavigation',
  UNPLEASANT_CONVERSATIONS = 'UnpleasantConversations',
  UNPLEASANT_MUSIC = 'UnpleasantMusic',
  UNPLEASANT_TEMPERATURE = 'UnpleasantTemperature',
  INCORRECT_CALCULATION = 'IncorrectCalculation',
}

export interface FleetDriverFeedbackDto {
  driver: FeedbackDriverDto;
  created_at: Timestamp;
  mark: number;
  comment: string;
  template_comments: TemplateComment[];
  status: FeedbackStatus;
}

export interface FleetDriverFeedbackRequestDto {
  created_at_from: number;
  created_at_to: number;
  driver_id: string;
}

export type FleetDriverFeedbackFilterDto = Partial<FleetDriverFeedbackRequestDto>;

export interface DriverRideConditionDto {
  id: UID;
  name: string;
  code: string;
  is_available: boolean;
  is_restricted_by_vehicle_params: boolean;
}

export interface DriverRideConditionListDto {
  items: DriverRideConditionDto[];
}

export * from './driver-accessibility-rules-metrics.dto';
export * from './set-driver-product-configuration.dto';
export * from './driver-payment-details.dto';
export * from './driver-history-changes.dto';
export * from './driver-deny-list.dto';
export * from './driver-by-cash-limit.dto';
export * from './driver-order-filters.dto';
