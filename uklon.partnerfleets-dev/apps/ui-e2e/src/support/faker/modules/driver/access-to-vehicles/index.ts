import { DriverVehicleAccessType } from '@constant';
import { DriverVehicleAccessSettingsDto, FleetVehicleDto } from '@data-access';

import { ModuleBase } from '../../_internal';

export type BuildProps = Partial<{
  access_type?: DriverVehicleAccessType;
  items?: FleetVehicleDto[];
}>;

export class DriverAccessToVehiclesModule extends ModuleBase<DriverVehicleAccessSettingsDto, BuildProps> {
  public buildDto(props?: BuildProps): DriverVehicleAccessSettingsDto {
    return {
      access_type: props?.access_type ?? DriverVehicleAccessType.ALL,
      vehicles: props?.items ?? [],
    };
  }
}
