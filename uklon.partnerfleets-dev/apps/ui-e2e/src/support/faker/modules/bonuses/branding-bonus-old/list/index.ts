import { BrandingBonusProgramsCollectionOld, BrandingBonusProgramsOldDto, FleetVehicleColor } from '@data-access';

import { ModuleBase } from '../../../_internal';

export type BuildProps = Partial<{
  count?: number;
  has_more_items?: boolean;
  vehicle_id?: string;
}>;

const DEFAULT_COUNT = 2;

export class BrandingBonusProgramsListOldModule extends ModuleBase<BrandingBonusProgramsCollectionOld, BuildProps> {
  public buildDto(props?: BuildProps): BrandingBonusProgramsCollectionOld {
    return {
      has_more_items: props?.has_more_items ?? false,
      items: Array.from({ length: props?.count ?? DEFAULT_COUNT }).map(
        this.buildBonusProgram.bind(this, props?.vehicle_id),
      ),
    };
  }

  private buildBonusProgram(vehicle_id?: string): BrandingBonusProgramsOldDto {
    const driverId = this.faker.string.uuid();

    return {
      id: this.faker.string.uuid(),
      driver_id: this.faker.string.uuid(),
      vehicle_id: vehicle_id ?? this.faker.string.uuid(),
      wallet_id: this.faker.string.uuid(),
      calculation_source: {
        rating: this.faker.number.int({ min: 0, max: 5 }),
        orders: {
          cancellation_percentage: 0,
          completed: 3,
          cancelled: 0,
          total: 3,
        },
      },
      bonus: { value: this.faker.number.int({ min: 0, max: 100 }) },
      vehicle: {
        vehicle_id: this.faker.string.uuid(),
        license_plate: 'ETR345',
        color: FleetVehicleColor.BLACK,
        comfort_level: 'Business',
        has_dispatching_priority: false,
        is_branded: true,
        make: 'Adler',
        model: 'Stromform',
        production_year: 2022,
        selected_by_driver_id: driverId,
      },
      driver: {
        driver_id: driverId,
        first_name: this.faker.person.firstName(),
        last_name: this.faker.person.lastName(),
        phone: '380990000884',
        rating: this.faker.number.int({ min: 0, max: 500 }),
      },
    };
  }
}
