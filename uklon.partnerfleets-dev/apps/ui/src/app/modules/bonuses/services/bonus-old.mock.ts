import { Day } from '@constant';
import {
  BrandingBonusCalculationPeriodOldDto,
  BrandingBonusCalculationsProgramOldDto,
  BrandingBonusProgramsCollectionOld,
  BrandingBonusProgramsOldDto,
} from '@data-access';

import { Currency } from '@uklon/types';

export const BRANDING_BONUS_CALCULATION_PERIOD_ITEM_1_OLD_MOCK: BrandingBonusCalculationPeriodOldDto = {
  calculation_id: 'c259fbce-bc09-4a8b-a2c7-40ef75b379c6',
  calculation_created_at: 1_721_221_087,
  period: { range: [1_719_781_200, 1_720_990_800] },
  brandingTypes: [{ calculation_id: 'c259fbce-bc09-4a8b-a2c7-40ef75b379c6', types: ['Green'] }],
  branding_types: ['Green'],
};

export const BRANDING_BONUS_PROGRAM_ITEM_1_OLD_MOCK: BrandingBonusProgramsOldDto = {
  id: '6f5526f7-a698-455e-9f7a-afe9c26564bf',
  driver_id: '0391ed72-f40a-4924-a381-eb647ae29203',
  vehicle_id: '66655080-d83a-472d-98fc-a1c164aa0ab3',
  wallet_id: '473fcfcc-8a57-4d80-a4bb-ee508ebe9e98',
  calculation_source: {
    rating: 5,
    orders: {
      completed: 1,
      cancelled: 0,
      total: 1,
      cancellation_percentage: 0,
      completed_amount: null,
    },
  },
  bonus: {
    value: 0,
  },
  vehicle: {
    vehicle_id: '66655080-d83a-472d-98fc-a1c164aa0ab3',
    license_plate: 'ETR345',
    make: 'Adler',
    model: 'Stromform',
    color: 'Black',
    comfort_level: 'Business',
    production_year: 2022,
    is_branded: true,
    has_dispatching_priority: false,
    selected_by_driver_id: 'fcc05bbd-773f-40b4-9e47-8d41a9218aa8',
  },
  driver: {
    driver_id: 'fcc05bbd-773f-40b4-9e47-8d41a9218aa8',
    first_name: 'Ввівів',
    last_name: 'Ввввв',
    phone: '380990000884',
    rating: 500,
  },
};

export const BRANDING_BONUS_PROGRAM_ITEM_2_OLD_MOCK: BrandingBonusProgramsOldDto = {
  id: 'e5c215a8-afbd-4a11-8b61-9ba631dc50b1',
  driver_id: '0391ed72-f40a-4924-a381-eb647ae29203',
  vehicle_id: '521770d8-90b4-4326-8698-7cd7edd915a4',
  wallet_id: '473fcfcc-8a57-4d80-a4bb-ee508ebe9e98',
  calculation_source: {
    rating: 5,
    orders: {
      completed: 3,
      cancelled: 0,
      total: 3,
      cancellation_percentage: 0,
      completed_amount: null,
    },
  },
  bonus: {
    value: 0,
  },
  vehicle: {
    vehicle_id: '521770d8-90b4-4326-8698-7cd7edd915a4',
    license_plate: '4353EEE',
    make: 'Adler',
    model: 'Trumpf',
    color: 'Black',
    comfort_level: 'Standard',
    production_year: 2023,
    is_branded: true,
    has_dispatching_priority: false,
    selected_by_driver_id: '882a55de-25c5-436f-a24d-cf3c671a3db6',
  },
  driver: {
    driver_id: '882a55de-25c5-436f-a24d-cf3c671a3db6',
    first_name: 'Віаваів',
    last_name: 'Іваіавіа',
    phone: '380990002250',
    rating: 500,
  },
};

export const BRANDING_BONUS_PROGRAMS_COLLECTION_OLD_MOCK: BrandingBonusProgramsCollectionOld = {
  items: [BRANDING_BONUS_PROGRAM_ITEM_1_OLD_MOCK, BRANDING_BONUS_PROGRAM_ITEM_2_OLD_MOCK],
  has_more_items: false,
};

export const BRANDING_BONUS_CALCULATION_PROGRAM_OLD_MOCK: BrandingBonusCalculationsProgramOldDto = {
  calculation_periods: [
    { range: [1_717_189_200, 1_718_398_800] },
    { range: [1_718_485_200, 1_719_694_800] },
    { range: [1_719_781_200, 1_720_990_800] },
    { range: [1_721_077_200, 1_721_854_799] },
  ],
  id: 'a13a1548-2f39-4489-bc6b-b3ee27ce0238',
  is_auto_calculation: true,
  is_auto_payment: false,
  life_time: { range: [1_717_189_200, 1_721_854_799] },
  name: 'inzer - COPY',
  status: 'deleted',
  type: 'branding',
  specification: {
    currency: Currency.UAH,
    days: [Day.MONDAY, Day.TUESDAY, Day.WEDNESDAY, Day.THURSDAY, Day.FRIDAY, Day.SATURDAY, Day.SUNDAY],
    distance: { range: [] },
    order_acceptance_methods: [
      'ByBroadcastFilter',
      'ByChain',
      'ByFastSearch',
      'ByHomeFilter',
      'ByOfferFilter',
      'BySectorQueue',
      'courier_offer',
    ],
    orders: {
      completed: {
        count: [
          { value: 100, range: [11, 20] },
          { value: 200, range: [20, 50] },
        ],
      },
      cancelled: {
        percent: [{ range: [0, 100] }],
      },
    },
    product_types: ['Business', 'Delivery', 'Driver', 'Econom', 'Inclusive', 'Prime', 'Standard', 'Wagon'],
    time_zone: 'Europe/Kiev',
    region: 7,
    time: [],
    rating: { last: [{ range: [0, 5] }] },
  },
};
