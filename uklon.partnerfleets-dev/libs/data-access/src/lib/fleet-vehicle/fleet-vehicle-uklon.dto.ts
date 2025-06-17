import { FleetVehicleComfortLevel } from '@constant';

import { UNIXDate } from '@uklon/fleets/angular/cdk';

import { FleetVehicleDriverType } from './fleet-vehicle-driver-type.enum';

export interface FleetVehicleUklonDto {
  hasBranding: boolean;
  hasPriority: boolean;
  accessibleFor: FleetVehicleDriverType;
  comfortLevel: FleetVehicleComfortLevel;
  addedAt: UNIXDate;
}
