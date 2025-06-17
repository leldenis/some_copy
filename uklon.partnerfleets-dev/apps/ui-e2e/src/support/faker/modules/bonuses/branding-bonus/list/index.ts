import {
  BrandingBonusCalcSourceDto,
  BrandingBonusDto,
  BrandingBonusProgramCalculationDto,
  CollectionDto,
  FleetVehicleColor,
} from '@data-access';

import { ModuleBase } from '../../../_internal';

export type BuildProps = Partial<{
  count: number;
  vehicleId: string;
  driverId: string;
  calculationSource: BrandingBonusCalcSourceDto;
  bonus: BrandingBonusDto;
  items: BrandingBonusProgramCalculationDto[];
}>;

const DEFAULT_COUNT = 10;

export class BrandingProgramsCalculationsListModule extends ModuleBase<
  CollectionDto<BrandingBonusProgramCalculationDto>,
  BuildProps
> {
  public buildDto(props?: BuildProps): CollectionDto<BrandingBonusProgramCalculationDto> {
    return {
      items:
        props?.items?.length > 0
          ? props.items
          : Array.from({ length: props?.count ?? DEFAULT_COUNT }).map(this.buildItem.bind(this, props)),
    };
  }

  private buildItem(props?: BuildProps): BrandingBonusProgramCalculationDto {
    const driverId = props?.driverId ?? this.faker.string.uuid();

    return {
      bonus: props?.bonus ?? { value: this.faker.number.int({ min: 0, max: 100 }) },
      bonus_receiver_wallet_id: this.faker.string.uuid(),
      calculation_item_id: this.faker.string.uuid(),
      vehicle_id: props?.vehicleId ?? this.faker.string.uuid(),
      fleet_id: this.faker.string.uuid(),
      participant_id: this.faker.string.uuid(),
      calculation_source: props?.calculationSource ?? {
        orders: {
          cancellation_percentage: 0,
          completed: 3,
          cancelled: 0,
          total: 3,
        },
      },
      driver: {
        driver_id: driverId,
        first_name: this.faker.person.firstName(),
        last_name: this.faker.person.lastName(),
        phone: '380990000884',
        rating: this.faker.number.int({ min: 0, max: 500 }),
      },
      vehicle: {
        vehicle_id: this.faker.string.uuid(),
        license_plate: 'YT5656YT',
        color: FleetVehicleColor.GREEN,
        comfort_level: 'Comfort',
        has_dispatching_priority: true,
        is_branded: true,
        make: 'Abarth',
        model: 'Fiat 500',
        production_year: 2021,
        selected_by_driver_id: driverId,
      },
    };
  }
}
