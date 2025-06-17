import {
  BonusBrandingProgramNameDto,
  BrandingBonusCalculationPeriodDto,
  BrandingBonusProgramCalculationDto,
  BrandingProgramParamsOrdersDto,
} from '@data-access';

export const PROGRAM_NAMES_MOCK: BonusBrandingProgramNameDto[] = [
  {
    id: '18bc0385-7dd0-4b7c-810a-97f59fa5ad18',
    name: 'АктивнаПарктест',
    status: 'active',
  },
  {
    id: '823fe0a0-7ed0-41e7-87a7-1cd3d53babf7',
    name: 'ПаркБосячки',
    status: 'deleted',
  },
];

export const PERIODS_ACTIVE_PROGRAM_MOCK: BrandingBonusCalculationPeriodDto[] = [
  {
    calculation_id: 'e5f045c4-1339-4646-9d2e-373930c05cf8',
    period: {
      range: [1_741_989_600, 1_742_076_000],
    },
    calculation_created_at: 1_741_099_442,
    branding_types: [],
  },
  {
    calculation_id: 'efa0886b-c855-4ff1-be9e-0659badf78a8',
    period: {
      range: [1_741_298_400, 1_741_384_800],
    },
    calculation_created_at: 1_741_098_694,
    branding_types: [],
  },
  {
    calculation_id: 'fce1bc5e-cac3-49cf-a111-d753e2ce97d7',
    period: {
      range: [1_741_125_600, 1_741_212_000],
    },
    calculation_created_at: 1_741_095_866,
    branding_types: [],
  },
  {
    calculation_id: '256499bf-e9f0-4db2-b0a2-a2ee666039bc',
    period: {
      range: [1_740_952_800, 1_741_039_200],
    },
    calculation_created_at: 1_741_095_858,
    branding_types: [],
  },
];

export const PERIODS_DELETED_PROGRAM_MOCK: BrandingBonusCalculationPeriodDto[] = [
  {
    calculation_id: '51b60240-75bf-4a61-b3bd-50a19a434468',
    period: {
      range: [1_741_125_600, 1_741_212_000],
    },
    calculation_created_at: 1_741_094_537,
    branding_types: [],
  },
  {
    calculation_id: 'a6a8e007-9bcb-4517-9c22-f2dcc52b1850',
    period: {
      range: [1_740_952_800, 1_741_039_200],
    },
    calculation_created_at: 1_741_094_519,
    branding_types: [],
  },
];

export const PROGRAMS_CALCULATIONS_LIST_MOCK: BrandingBonusProgramCalculationDto[] = [
  {
    calculation_item_id: '02077b7b-da65-40ab-a60c-ea3c7b06bf1d',
    participant_id: '5236206b-37b2-4e28-a9b2-486e9eb2afc7',
    fleet_id: '4243bb2e-8502-4870-80f3-774e0dbbfa4e',
    vehicle_id: '1d2905fe-ba16-4f8d-9f98-c5ad66903645',
    bonus_receiver_wallet_id: 'd6d6b4a5-a215-4563-aaee-cbc697673774',
    bonus: {
      value: 0,
    },
    calculation_source: {
      orders: {
        completed: 0,
        cancelled: 0,
        total: 0,
        cancellation_percentage: 0,
      },
    },
    vehicle: {
      vehicle_id: '1d2905fe-ba16-4f8d-9f98-c5ad66903645',
      license_plate: 'KA0000KA',
      make: 'Aero',
      model: '30',
      color: 'White',
      comfort_level: 'Standard',
      production_year: 2023,
      is_branded: true,
      has_dispatching_priority: false,
    },
  },
];

export const PROGRAM_DETAILS_ORDERS_MOCK: BrandingProgramParamsOrdersDto = {
  completed: {
    count: [
      {
        value: 30,
        range: [1, 3],
      },
      {
        value: 50,
        range: [3, 5],
      },
    ],
  },
  cancelled: {
    percent: [
      {
        range: [3, 10],
      },
    ],
  },
};
