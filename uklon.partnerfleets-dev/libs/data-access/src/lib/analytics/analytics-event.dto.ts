import { BlockedListStatusValue, BodyType, TicketStatus } from '@constant';

import { ActiveOrderStatus } from '../fleet-order';
import { EmployeeLocationStatus } from '../live-map';
import { PhotoType } from '../photos.dto';

import { FleetAnalyticsEventType } from './analytics-event-type.enum';

export interface AnalyticsEventDto<T = Partial<CustomAnalyticsPropertiesDto>> {
  client_id: string;
  event_type: FleetAnalyticsEventType;
  user_id: string;
  device_id: string;
  locale: string;
  client_type: string;
  custom_properties?: T;
  event_timestamp: number;
  app: AnalyticsEventAppDto;
}

export interface AnalyticsEventAppDto {
  name: string;
  version: string;
}

export interface CustomAnalyticsPropertiesDto {
  ip?: string;
  user_agent?: string;
  phone?: string;
  error_code?: number;
  error_text?: string;
  iteration_number?: number;
  code?: string;
  user_access?: string;
  driver_id?: string;
  reason?: string;
  comment?: string;
  vehicle_id?: string;
  start_date?: number;
  end_date?: number;
  status?: string;
  withdraw_sum?: number;
  phone_code?: string;
  fleet_name?: string;
  page?: string;
  page_name?: string;
  map_event_type?: 'pan' | 'zoom';
  drivers_list_status?: EmployeeLocationStatus;
  driver_status?: EmployeeLocationStatus;
  link_type?: 'driver' | 'vehicle' | 'driver_map';
  ride_status?: ActiveOrderStatus;
  drivers_count?: number;
  search_input_name?: string;
  view?: 'opened' | 'closed';
  panel?: string;
  fullScreen?: 'on' | 'off';
  period_type?: string;
  history_event_type?: string;
  history_details_info?: Record<string, unknown>;
  receivers_count?: number;
  source?: 'Web' | 'UD';
  ticket_status?: TicketStatus;
  ticket_id?: string;
  photo?: PhotoType;
  last_modified?: number;
  url?: string;
  mark?: string;
  mark_state?: 'selected' | 'unselected';
  unread?: number;
  notification_type?: string;
  notification_state?: 'read' | 'unread';
  auth_method?: 'sms' | 'password';
  state?: boolean;
  fleet_id?: string;
  field?: string;
  vehicleFields?: Record<string, unknown>;
  img_type?: string;
  error?: unknown;
  notification_id?: string;
  filter?: string;
  filter_value?: string;
}

export interface AnalyticsVehicleFiltersDto {
  licence_plate?: string;
  priority?: string;
  branding?: string;
  bodyType?: BodyType;
  status?: BlockedListStatusValue;
}

export interface AnalyticsTripsFiltersDto {
  licence_plate?: string;
  status_type?: string;
  product_type?: string;
  driver_id?: string;
}

export interface AnalyticsDriverWalletsFilterDto {
  name?: string;
  phone?: string;
}

export type AnalyticsBase = Pick<CustomAnalyticsPropertiesDto, 'ip' | 'user_agent'>;
export type AnalyticsLoginPhone = AnalyticsBase & Pick<CustomAnalyticsPropertiesDto, 'phone'>;
export type AnalyticsLoginError = Omit<CustomAnalyticsPropertiesDto, 'iteration_number'>;
export type AnalyticsLoginIterations = AnalyticsBase & Pick<CustomAnalyticsPropertiesDto, 'iteration_number'>;
export type AnalyticsUserRole = AnalyticsBase &
  Pick<CustomAnalyticsPropertiesDto, 'user_access' | 'fleet_id' | 'ticket_id'>;
export type AnalyticsDriverBase = AnalyticsUserRole & Pick<CustomAnalyticsPropertiesDto, 'driver_id'>;
export type AnalyticsDriverPhotoControl = AnalyticsUserRole &
  Pick<CustomAnalyticsPropertiesDto, 'page' | 'start_date' | 'end_date' | 'filter' | 'ticket_id'>;
export type AnalyticsDriverPhotoControlFilter = AnalyticsUserRole &
  Pick<CustomAnalyticsPropertiesDto, 'page' | 'start_date' | 'end_date' | 'filter' | 'filter_value'>;
export type AnalyticsTicketBase = AnalyticsUserRole & Pick<CustomAnalyticsPropertiesDto, 'ticket_id' | 'page'>;
export type AnalyticsDriverDeleted = AnalyticsUserRole &
  Pick<CustomAnalyticsPropertiesDto, 'driver_id' | 'comment' | 'reason'>;
export type AnalyticsVehicleFilter = AnalyticsUserRole & AnalyticsVehicleFiltersDto;
export type AnalyticsVehicleBase = AnalyticsUserRole & Pick<CustomAnalyticsPropertiesDto, 'vehicle_id'>;
export type AnalyticsVehicleDriver = AnalyticsDriverBase & Pick<CustomAnalyticsPropertiesDto, 'vehicle_id'>;
export type AnalyticsAddingVehicle = AnalyticsUserRole &
  Pick<CustomAnalyticsPropertiesDto, 'field' | 'vehicleFields' | 'fleet_id'>;
export type AnalyticsAddingVehiclePhotos = AnalyticsUserRole &
  Pick<CustomAnalyticsPropertiesDto, 'fleet_id' | 'img_type' | 'ticket_id' | 'ticket_status' | 'error'>;
export type AnalyticsCreateVehicle = AnalyticsUserRole &
  Pick<CustomAnalyticsPropertiesDto, 'fleet_id' | 'vehicleFields' | 'ticket_id' | 'ticket_status'>;
export type AnalyticsDateFilter = AnalyticsUserRole & Pick<CustomAnalyticsPropertiesDto, 'start_date' | 'end_date'>;
export type AnalyticsTripsFilter = AnalyticsDateFilter & AnalyticsTripsFiltersDto;
export type AnalyticsActionIteration = AnalyticsUserRole & Pick<CustomAnalyticsPropertiesDto, 'iteration_number'>;
export type AnalyticsError = AnalyticsUserRole & Pick<CustomAnalyticsPropertiesDto, 'error_code' | 'error_text'>;
export type AnalyticsWihdrawMoney = AnalyticsUserRole & Pick<CustomAnalyticsPropertiesDto, 'withdraw_sum'>;
export type AnalyticsDriversWalletsFilter = AnalyticsUserRole & AnalyticsDriverWalletsFilterDto;
export type AnalyticsPhoneCode = AnalyticsBase & Pick<CustomAnalyticsPropertiesDto, 'phone_code'>;
export type AnalyticsFleetName = AnalyticsBase & Pick<CustomAnalyticsPropertiesDto, 'fleet_name'>;
export type AnalyticsMapEvent = AnalyticsUserRole & Pick<CustomAnalyticsPropertiesDto, 'map_event_type'>;
export type AnalyticsMapDriversSelected = AnalyticsBase & Pick<CustomAnalyticsPropertiesDto, 'drivers_list_status'>;
export type AnalyticsMapDriverStatus = AnalyticsBase & Pick<CustomAnalyticsPropertiesDto, 'driver_status'>;
export type AnalyticsMapNavigation = AnalyticsBase & Pick<CustomAnalyticsPropertiesDto, 'link_type'>;
export type AnalyticsMapOrderStatus = AnalyticsBase & Pick<CustomAnalyticsPropertiesDto, 'ride_status'>;
export type AnalyticsMapSearch = AnalyticsBase & Pick<CustomAnalyticsPropertiesDto, 'drivers_count'>;
export type AnalyticsMapSearchInput = AnalyticsBase & Pick<CustomAnalyticsPropertiesDto, 'search_input_name'>;
export type AnalyticsMapTogglePanel = AnalyticsBase & Pick<CustomAnalyticsPropertiesDto, 'view' | 'panel'>;
export type AnalyticsMapFullScreen = AnalyticsBase & Pick<CustomAnalyticsPropertiesDto, 'fullScreen'>;
export type AnalyticsDateRangeType = AnalyticsDateFilter & Pick<CustomAnalyticsPropertiesDto, 'period_type'>;
export type AnalyticsHistoryEventType = AnalyticsUserRole & Pick<CustomAnalyticsPropertiesDto, 'history_event_type'>;
export type AnalyticsHistoryEventTypeDetails = AnalyticsHistoryEventType &
  Pick<CustomAnalyticsPropertiesDto, 'history_details_info'>;
export type AnalyticsMerchantsPopover = AnalyticsUserRole & Pick<CustomAnalyticsPropertiesDto, 'receivers_count'>;
export type AnalyticsTogglePanel = AnalyticsUserRole & Pick<CustomAnalyticsPropertiesDto, 'view'>;
export type AnalyticsPhotoControlScreen = AnalyticsUserRole &
  Pick<CustomAnalyticsPropertiesDto, 'ticket_id' | 'ticket_status' | 'source' | 'vehicle_id'>;
export type AnalyticsPhotoControlPhoto = AnalyticsPhotoControlScreen &
  Pick<CustomAnalyticsPropertiesDto, 'photo' | 'last_modified'>;
export type AnalyticsUrl = AnalyticsUserRole & Pick<CustomAnalyticsPropertiesDto, 'url'>;
export type AnalyticsNPS = AnalyticsUrl & Pick<CustomAnalyticsPropertiesDto, 'mark' | 'mark_state'>;
export type AnalyticsNotifications = AnalyticsBase &
  Pick<CustomAnalyticsPropertiesDto, 'unread' | 'notification_type' | 'notification_state'>;
export type AnalyticsBrandingBonusBase = Pick<CustomAnalyticsPropertiesDto, 'state'>;
