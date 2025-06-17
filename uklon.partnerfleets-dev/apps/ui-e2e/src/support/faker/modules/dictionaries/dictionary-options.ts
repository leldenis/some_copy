import { DictionaryCollectionDto, FleetVehicleOption, VehicleOptionDictionaryItemDto } from '@data-access';

import { Region } from '@uklon/types';

import { ModuleBase } from '../_internal';

export type BuildProps = Partial<{
  regionId: number;
}>;

export class DictionaryOptionsModule extends ModuleBase<
  DictionaryCollectionDto<VehicleOptionDictionaryItemDto>,
  BuildProps
> {
  public buildDto(props?: BuildProps): DictionaryCollectionDto<VehicleOptionDictionaryItemDto> {
    switch (props?.regionId) {
      case Region.TASHKENT:
        return this.buildDtoByRegion501();
      default:
        return this.buildDtoByRegion1();
    }
  }

  private buildDtoByRegion1(): DictionaryCollectionDto<VehicleOptionDictionaryItemDto> {
    return {
      items: [
        {
          code: FleetVehicleOption.AIR_CONDITIONER,
          is_driver_editable: true,
        },
        {
          code: FleetVehicleOption.BABY_CHAIR,
          is_driver_editable: true,
        },
        {
          code: FleetVehicleOption.BABY_BOOSTER_SEAT,
          is_driver_editable: true,
        },
        {
          code: FleetVehicleOption.COVID_PROTECTED,
          is_driver_editable: false,
        },
        {
          code: FleetVehicleOption.ELECTRIC_ENGINE,
          is_driver_editable: true,
        },
        {
          code: FleetVehicleOption.TYRE_COMPRESSOR,
          is_driver_editable: false,
        },
        {
          code: FleetVehicleOption.BOOSTER_CABLE,
          is_driver_editable: false,
        },
      ],
    };
  }

  private buildDtoByRegion501(): DictionaryCollectionDto<VehicleOptionDictionaryItemDto> {
    return {
      items: [
        {
          code: FleetVehicleOption.AIR_CONDITIONER,
          is_driver_editable: true,
        },
        {
          code: FleetVehicleOption.BABY_CHAIR,
          is_driver_editable: true,
        },
        {
          code: FleetVehicleOption.BABY_BOOSTER_SEAT,
          is_driver_editable: true,
        },
        {
          code: FleetVehicleOption.ELECTRIC_ENGINE,
          is_driver_editable: true,
        },
      ],
    };
  }
}
