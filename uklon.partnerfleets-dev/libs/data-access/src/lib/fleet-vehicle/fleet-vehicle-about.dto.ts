import { BodyType, LoadCapacity } from '@constant';

import { DictionaryRecordDto } from './dictionary-record.dto';
import { FleetVehicleColor } from './fleet-vehicle-color.enum';
import { FleetVehicleFuel } from './fleet-vehicle-fuel.enum';
import { FleetVehicleOption } from './fleet-vehicle-option.enum';

export interface FleetVehicleAboutDto {
  model: DictionaryRecordDto;
  maker: DictionaryRecordDto;
  productionYear: number;
  color: FleetVehicleColor;
  seats: number;
  options: FleetVehicleOption[];
  fuels: FleetVehicleFuel[];
  bodyType: BodyType;
  loadCapacity: LoadCapacity;
}
