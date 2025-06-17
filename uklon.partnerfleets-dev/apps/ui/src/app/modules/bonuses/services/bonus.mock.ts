import { Day } from '@constant';
import {
  BrandingBonusCalculationPeriodDto,
  BrandingBonusProgramCalculationDto,
  BrandingCalculationsProgramDto,
  CollectionDto,
} from '@data-access';

import { Currency } from '@uklon/types';

export const BRANDING_BONUS_CALCULATION_PERIOD_ITEM_1_MOCK: BrandingBonusCalculationPeriodDto = {
  calculation_id: 'c259fbce-bc09-4a8b-a2c7-40ef75b379c6',
  calculation_created_at: 1_721_221_087,
  period: { range: [1_719_781_200, 1_720_990_800] },
  branding_types: ['Green'],
};

export const BRANDING_BONUS_PROGRAM_ITEM_1_MOCK: BrandingBonusProgramCalculationDto = {
  calculation_item_id: '29514298-88bd-4907-b9b6-138c80354105',
  participant_id: '3c6f93fe-f05e-4352-80d2-a267047ece4f',
  fleet_id: '4243bb2e-8502-4870-80f3-774e0dbbfa4e',
  vehicle_id: '7d794dcc-7445-490f-93aa-0403c77ee019',
  bonus_receiver_wallet_id: '',
  bonus: {
    value: 0,
  },
  calculation_source: {
    orders: {
      completed: 1,
      cancelled: 0,
      total: 1,
      cancellation_percentage: 0,
      completed_amount: null,
    },
  },
  vehicle: {
    vehicle_id: '7d794dcc-7445-490f-93aa-0403c77ee019',
    license_plate: 'YT5656YT',
    make: 'Abarth',
    model: 'Fiat 500',
    color: 'Green',
    comfort_level: 'Comfort',
    production_year: 2021,
    is_branded: true,
    has_dispatching_priority: true,
    selected_by_driver_id: 'b8fea45d-55cf-4cfa-889c-42fb4152421e',
  },
  driver: {
    driver_id: 'b8fea45d-55cf-4cfa-889c-42fb4152421e',
    first_name: 'Тестік',
    last_name: 'Тестович',
    phone: '380680923156',
    rating: 491,
  },
};

export const BRANDING_BONUS_PROGRAMS_COLLECTION_MOCK: CollectionDto<BrandingBonusProgramCalculationDto> = {
  items: [BRANDING_BONUS_PROGRAM_ITEM_1_MOCK],
};

export const BRANDING_BONUS_PROGRAM_DETAILS_MOCK: BrandingCalculationsProgramDto = {
  id: '18bc0385-7dd0-4b7c-810a-97f59fa5ad18',
  name: 'АктивнаПарктест',
  status: 'active',
  life_time: {
    range: [1_740_952_800, 1_742_248_799],
  },
  calculation_periods: [
    {
      range: [1_740_952_800, 1_741_125_599],
    },
    {
      range: [1_741_125_600, 1_741_212_000],
    },
    {
      range: [1_741_298_400, 1_741_384_800],
    },
    {
      range: [1_741_471_200, 1_741_557_600],
    },
    {
      range: [1_741_644_000, 1_741_730_400],
    },
    {
      range: [1_741_816_800, 1_741_903_200],
    },
    {
      range: [1_741_989_600, 1_742_076_000],
    },
    {
      range: [1_742_162_400, 1_742_248_799],
    },
  ],
  is_auto_calculation: true,
  parameters: {
    currency: Currency.UAH,
    days: [Day.MONDAY, Day.TUESDAY, Day.WEDNESDAY, Day.THURSDAY, Day.FRIDAY, Day.SATURDAY, Day.SUNDAY],
    distance: { range: [] },
    order_acceptance_methods: [],
    orders: {
      completed: {
        count: [
          { value: -20, range: [1, 4] },
          { value: 140, range: [4, 999] },
        ],
      },
      cancelled: {
        percent: [{ range: [0, 100] }],
      },
    },
    product_types: [],
    time_zone: 'Europe/Kiev',
    regions: [1, 2],
    time: [],
    driver_rating: { range: [4, 5] },
    fleet_types: [],
    fleet_withdrawal_types: [],
    branding_types: [],
  },
  created_at: 1_741_095_652,
  updated_at: 1_741_249_891,
  updated_by: '353bf0a4-645c-4968-be55-30a683b538e7',
};
