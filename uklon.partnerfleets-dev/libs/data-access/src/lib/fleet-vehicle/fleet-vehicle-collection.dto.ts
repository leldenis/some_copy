import { DataCollectionDto, TotalDto } from '../common';

import { FleetVehicleDto } from './fleet-vehicle.dto';

export interface FleetVehicleCollectionDto extends DataCollectionDto<FleetVehicleDto>, TotalDto {}
