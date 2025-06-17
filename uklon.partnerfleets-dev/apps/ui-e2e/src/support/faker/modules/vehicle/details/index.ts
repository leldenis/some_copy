import { BlockedListStatusValue, BodyType, FleetVehicleComfortLevel } from '@constant';
import { VehicleDetailsDto, VehicleDetailsPhotoControlDto } from '@data-access';

import { ModuleBase } from '../../_internal';

export type BuildProps = Partial<{
  id: string;
  license_plate?: string;
  photo_control?: VehicleDetailsPhotoControlDto;
}>;

export class VehicleDetailsModule extends ModuleBase<VehicleDetailsDto> {
  public buildDto(props?: BuildProps): VehicleDetailsDto {
    return {
      id: props.id,
      vin_code: 'BSAS4J648VFVC4VJ7',
      color: 'White',
      body_type: BodyType.COUPE,
      license_plate: props?.license_plate ?? this.faker.vehicle.vrm(),
      make: 'Cadillac',
      make_id: '3327da7b-5a97-4ec0-b84b-6fce2e5335b5',
      model: 'XTS',
      model_id: '0de49c67-8119-4183-86f1-e6a32759fe0a',
      production_year: 2017,
      added_to_fleet: 1_668_675_444,
      options: ['AirConditioner'],
      comfort_level: FleetVehicleComfortLevel.ECONOM,
      passenger_seats_count: 4,
      status: {
        value: BlockedListStatusValue.ACTIVE,
      },
      photo_control: props?.photo_control ?? null,
    };
  }
}
