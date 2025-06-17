import { DriverRideConditionListDto } from '@data-access';

import { ModuleBase } from '../../_internal';

export type BuildProps = Partial<{
  available: boolean;
  restrictedByVehicleParams: boolean;
}>;

export class DriverRideConditionsModule extends ModuleBase<DriverRideConditionListDto, BuildProps> {
  public buildDto(props?: BuildProps): DriverRideConditionListDto {
    return {
      items: [
        {
          id: 'df310634-eaca-46da-804b-35e15787d756',
          name: 'Driverloader',
          code: 'driverloader',
          is_available: props?.available ?? false,
          is_restricted_by_vehicle_params: props?.restrictedByVehicleParams ?? true,
        },
        {
          id: 'c8f9f82a-71c8-4851-8492-27f17fb9616a',
          name: 'Silence',
          code: 'silence',
          is_available: props?.available ?? true,
          is_restricted_by_vehicle_params: props?.restrictedByVehicleParams ?? false,
        },
      ],
    };
  }
}
