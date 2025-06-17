import { CommissionProgramsParticipantType } from '@constant';
import {
  CommissionProgramsCollectionDto,
  CommissionProgramsDto,
  CommissionRateDto,
  DateRangeDto,
  FleetWithArchivedDriversBasicInfoDto,
  VehicleBasicInfoDto,
} from '@data-access';

import { ModuleBase } from '../../../_internal';

export type BuildProps = Partial<{
  count?: number;
  has_more_items?: boolean;
  driver_id?: string;
  driver_rating?: number;
  driver?: FleetWithArchivedDriversBasicInfoDto;
  vehicle_id?: string;
  vehicle?: VehicleBasicInfoDto;
  min_rating?: number;
  completed_orders?: number;
  is_profit_budget?: boolean;
  always_add_progress_if_satisfied?: boolean;
  participant_type?: string;
  commissions?: CommissionRateDto[];
  profit_budget?: number;
  used_profit_budget?: number;
}>;

const DEFAULT_COUNT = 2;

export class CommissionProgramsListModule extends ModuleBase<CommissionProgramsCollectionDto, BuildProps> {
  public buildDto(props?: BuildProps): CommissionProgramsCollectionDto {
    return {
      has_more_items: props?.has_more_items ?? false,
      items: Array.from({ length: props?.count ?? DEFAULT_COUNT }).map(this.buildCommissionProgram.bind(this, props)),
    };
  }

  // eslint-disable-next-line complexity
  private buildCommissionProgram(props?: BuildProps): CommissionProgramsDto {
    return {
      fleet_id: this.faker.string.uuid(),
      vehicle_id: props?.vehicle_id ?? 'ea0f48be-cabf-49b7-a939-d04de2c914d5',
      driver_id: props?.driver_id ?? this.faker.string.uuid(),
      wallet_id: this.faker.string.uuid(),
      program_id: this.faker.string.uuid(),
      participant_id: this.faker.string.uuid(),
      participant_type: props?.participant_type ?? CommissionProgramsParticipantType.DRIVER,
      program_name: 'Program name - first program',
      current_completed_orders: props?.completed_orders ?? 3,
      min_rating: props?.min_rating ?? 3,
      period: this.getPeriods(),
      commissions: props?.commissions ?? this.getCommissions(),
      order_acceptance_methods: [],
      product_types: [],
      always_add_progress_if_satisfied: props?.always_add_progress_if_satisfied ?? true,
      is_profit_budget: props?.is_profit_budget ?? true,
      profit_budget: props?.profit_budget ?? 8999.99,
      used_profit_budget: props?.used_profit_budget ?? 1034.21,
      driver: props?.driver ?? this.getDriverMock(props),
      vehicle: props?.vehicle ?? this.getVehicleMock(),
    };
  }

  private getPeriods(): DateRangeDto {
    return {
      from: 1_729_148_585,
      to: 1_729_321_385,
    };
  }

  private getDriverMock(props?: BuildProps): FleetWithArchivedDriversBasicInfoDto {
    return {
      driver_id: props?.driver_id ?? '22b323cd-a551-4a7b-a728-b0c1a7f17602',
      first_name: this.faker.person.firstName(),
      last_name: this.faker.person.lastName(),
      phone: `380${this.faker.phone.number()}`,
      signal: 501_313,
      rating: props?.driver_rating ?? 350,
    };
  }

  private getVehicleMock(): VehicleBasicInfoDto {
    return {
      vehicle_id: 'ea0f48be-cabf-49b7-a939-d04de2c914d5',
      license_plate: 'AQA7297',
      make: 'Hyundai',
      model: 'Accent',
      color: 'Blue',
      comfort_level: 'Business',
      production_year: 2018,
      is_branded: false,
      has_dispatching_priority: false,
      selected_by_driver_id: '96fa70d7-e3e3-4975-8b9b-88b1f30d2df3',
    };
  }

  private getCommissions(): CommissionRateDto[] {
    return [
      {
        order_completed_count_range: {
          from: 0,
          to: 10,
        },
        value: 0.1,
      },
      {
        order_completed_count_range: {
          from: 11,
          to: 20,
        },
        value: 0.05,
      },
      {
        order_completed_count_range: {
          from: 21,
          to: 100,
        },
        value: 0,
      },
    ];
  }
}
