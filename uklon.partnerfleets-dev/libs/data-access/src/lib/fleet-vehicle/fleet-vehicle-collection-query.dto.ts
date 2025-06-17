import { BlockedListStatusValue, BodyType } from '@constant';

import { OffsetQueryParamsDto } from '../common';

import { FleetVehicleDriverType } from './fleet-vehicle-driver-type.enum';

export interface FleetVehicleCollectionQueryDto extends OffsetQueryParamsDto {
  licencePlate?: string;
  hasBranding?: boolean | '';
  hasPriority?: boolean | '';
  accessibleFor?: FleetVehicleDriverType;
  bodyType?: BodyType | '';
  status?: BlockedListStatusValue;
}
