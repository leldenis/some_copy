import {
  AdvancedOptions,
  BodyType,
  Colors,
  LoadCapacity,
  TicketInitiatorType,
  TicketStatus,
  VehiclePhotosCategory,
} from '@constant';

import { FleetRole } from '../account/fleet-role';
import { PhotoType } from '../photos.dto';
import { PictureUrlDto } from '../picture-url-dto.interface';

import { TicketActivityLogItemDto } from './ticket-activity-log-item.dto';
import { TicketCommentDto } from './ticket-comment.dto';

export interface TicketTaxiLicenseDto {
  has_license: boolean;
  actual_to: number;
  is_infinite: boolean;
}

export interface AddVehicleTicketDto {
  id: string;
  fleet_id: string;
  vehicle_id: string;
  license_plate: string;
  vin_code: string;
  make_id: string;
  make?: string;
  model_id: string;
  model?: string;
  color: Colors;
  production_year: number;
  body_type: BodyType;
  options: AdvancedOptions[];
  city: string;
  activity_log: TicketActivityLogItemDto[];
  comments: TicketCommentDto[];
  initiator: TicketInitiatorType;
  comfort_levels: string[];
  region_id: number;
  can_be_edited: boolean;
  status: TicketStatus;
  load_capacity?: LoadCapacity;
  taxi_license: TicketTaxiLicenseDto;
  additional_picture_types: VehiclePhotosCategory[];
  images: VehicleTicketImages;
}

export type VehicleTicketImages = Record<PhotoType, PictureUrlDto>;

export interface VehicleTicketConfigDto {
  available_picture_types: VehiclePhotosCategory[];
  required_picture_types: VehiclePhotosCategory[];
  is_clarification_supported: boolean;
  available_diia_docs: string[];
  properties_configurations: PropertiesConfigurationDto[];
  picture_types: VehiclePhotosCategory[];
}

export interface PropertiesConfigurationDto {
  property_name: string;
  shown_for: FleetRole[];
  is_required?: boolean;
}
