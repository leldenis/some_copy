import { Day } from '@constant';
import { BrandingCalculationsProgramDto, BrandingProgramParamsOrdersDto, RangeItemsDto } from '@data-access';

import { Currency } from '@uklon/types';

import { ModuleBase } from '../../../_internal';

export type BuildProps = Partial<{
  regions: number[];
  orders: BrandingProgramParamsOrdersDto;
  driverRating: RangeItemsDto;
}>;

export class BrandingProgramDetailsModule extends ModuleBase<BrandingCalculationsProgramDto, BuildProps> {
  public buildDto(props?: BuildProps): BrandingCalculationsProgramDto {
    return {
      id: this.faker.string.uuid(),
      created_at: 1_739_459_704,
      is_auto_calculation: true,
      name: this.faker.string.alpha({ length: { min: 4, max: 15 } }),
      status: 'active',
      updated_at: 1_740_657_022,
      updated_by: this.faker.string.uuid(),
      life_time: {
        range: [1_738_360_800, 1_742_940_000],
      },
      calculation_periods: [
        {
          range: [1_739_458_800, 1_739_523_600],
        },
        {
          range: [1_739_534_400, 1_739_620_800],
        },
        {
          range: [1_739_743_200, 1_739_804_399],
        },
        {
          range: [1_740_261_600, 1_740_520_799],
        },
        {
          range: [1_740_520_800, 1_740_693_600],
        },
        {
          range: [1_740_952_800, 1_741_384_801],
        },
      ],
      parameters: {
        regions: props?.regions ?? [1, 2],
        driver_rating: props?.driverRating ?? {
          range: [4, 5],
        },
        currency: Currency.UAH,
        time_zone: 'Europe/Kiev',
        orders: props?.orders ?? {
          completed: {
            count: [
              {
                value: -20,
                range: [1, 4],
              },
              {
                value: 140,
                range: [4, 999],
              },
            ],
          },
          cancelled: {
            percent: [
              {
                range: [0, 100],
              },
            ],
          },
        },
        time: [
          {
            range: ['00:00:00', '14:59:59'],
          },
          {
            range: ['15:00:00', '23:59:59'],
          },
        ],
        days: [Day.MONDAY, Day.FRIDAY],
        order_acceptance_methods: [],
        product_types: [],
        fleet_types: [],
        fleet_withdrawal_types: [],
        branding_types: [],
        distance: { range: [] },
      },
    };
  }
}
