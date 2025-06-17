import { Sex } from '@constant';

import { TemplateComment, FeedbackStatus } from '../drivers';
import { EmployeeRestrictionDetailsDto } from '../drivers/fleet-driver.dto';
import { CursorPageRequestDto, Timestamp, UID } from '../utils';

import {
  CourierActivityRateDetailsDto,
  CourierActivityRateDto,
  CourierActivitySettingsDto,
} from './courier-activity.dto';

export interface CourierItemDto {
  id: string;
  registered_at: number;
  first_name: string;
  last_name: string;
  patronymic: string;
  sex: Sex;
  date_of_birth: number;
  phone: string;
  registration_region_id: number;
  id_number: string;
  email: string;
  restrictions: EmployeeRestrictionDetailsDto[];
  locale: string;
  rating: CourierRatingDto;
  active_account_deletion_ticket_id: string;
  activity_rate: CourierActivityRateDto;
}

export interface CourierRatingDto {
  value: number;
  marks_count: number;
}

export interface CouriersFiltersDto {
  name: string;
  phone: string;
}

export interface CouriersQueryParamsDto extends CouriersFiltersDto, CursorPageRequestDto {}

export interface OrdersStatisticsDto {
  completed_count: number;
  rejected_count: number;
  canceled_count: number;
}

export interface CourierDetailsDto extends CourierItemDto {
  profile_photo: {
    link: string;
    link_expiration: number;
  };
  unregistered: boolean;
  unregistered_at: number;
  orders_statistics: OrdersStatisticsDto;
  activity_rate: CourierActivityRateDetailsDto;
  activitySettings: CourierActivitySettingsDto;
}

export interface FeedbackCourierDto {
  id: UID;
  last_name: string;
  first_name: string;
}

export interface FleetCourierFeedbackDto {
  employee: FeedbackCourierDto;
  created_at: Timestamp;
  mark: number;
  comment: string;
  template_comments: TemplateComment[];
  status: FeedbackStatus;
}
