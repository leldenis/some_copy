import { VehicleAccessType } from '@constant';
import { Driver, VehicleAccessSettingsDto } from '@data-access';

import { ModuleBase } from '../../_internal';

export type BuildProps = Partial<{
  access_type?: VehicleAccessType;
  items?: Driver[];
}>;

export class VehicleAccessToDriversModule extends ModuleBase<VehicleAccessSettingsDto, BuildProps> {
  public buildDto(props?: BuildProps): VehicleAccessSettingsDto {
    return {
      access_type: props?.access_type ?? VehicleAccessType.ALL,
      drivers: props?.items ?? [],
    };
  }
}
