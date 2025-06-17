import { BlockedListStatusDto } from '../blocked-list';
import { VehicleBrandingPeriodDto } from '../vehicles/vehicle-branding-period.dto';

import { FleetVehicleAboutDto } from './fleet-vehicle-about.dto';
import { VehicleDetailsPhotoControlDto } from './fleet-vehicle-details-photo-control.dto';
import { FleetVehicleDriverDto } from './fleet-vehicle-driver.dto';
import { FleetVehicleUklonDto } from './fleet-vehicle-uklon.dto';

export interface FleetVehicleDto {
  id: string;
  licencePlate: string;
  about: FleetVehicleAboutDto;
  uklon: FleetVehicleUklonDto;
  driver: FleetVehicleDriverDto;
  status: BlockedListStatusDto;
  photo_control?: VehicleDetailsPhotoControlDto;
  branding_period?: VehicleBrandingPeriodDto;
}
