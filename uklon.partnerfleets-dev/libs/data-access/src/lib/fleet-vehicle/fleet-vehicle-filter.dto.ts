import { BlockedListStatusValue, BodyType } from '@constant';

export interface FleetVehicleFilterDto {
  hasBranding: boolean | '';
  hasPriority: boolean | '';
  licencePlate: string;
  bodyType: BodyType | '';
  status: BlockedListStatusValue;
}
