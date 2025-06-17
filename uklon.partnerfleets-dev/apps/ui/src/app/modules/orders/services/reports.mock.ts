import { FleetMerchant, ReportByOrdersCollectionDto, ReportByOrdersDto } from '@data-access';

import { Currency } from '@uklon/types';

export const ORDER_REPORT_ITEM_1_MOCK: ReportByOrdersDto = {
  driver: {
    id: '32174d5e-359e-4dbd-b5f9-4d42a38a4cee',
    signal: 502_539,
    first_name: 'Антон',
    last_name: 'Караванський',
  },
  has_error: false,
  total_orders_count: 3,
  total_distance_meters: 46_000,
  total_executing_time: 0,
  average_price_per_kilometer: {
    amount: 946,
    currency: Currency.UAH,
  },
  profit: {
    total: {
      amount: 168_680,
      currency: Currency.UAH,
    },
    order: {
      total: {
        amount: 161_800,
        currency: Currency.UAH,
      },
      wallet: {
        amount: 146_120,
        currency: Currency.UAH,
      },
    },
    promotion: {
      amount: 11_100,
      currency: Currency.UAH,
    },
    merchant: {
      amount: 15_680,
      currency: Currency.UAH,
    },
    compensation: {
      amount: 10_000,
      currency: Currency.UAH,
    },
    commission_programs_profit: {
      amount: 0,
      currency: Currency.UAH,
    },
  },
  loss: {
    order: {
      total: {
        amount: -4220,
        currency: Currency.UAH,
      },
      wallet: {
        amount: -4220,
        currency: Currency.UAH,
      },
    },
  },
  split_payments: [
    {
      payment_provider: FleetMerchant.IPAY,
      merchant_id: '12114',
      total: {
        amount: 15_680,
        currency: Currency.UAH,
      },
      fee: {
        amount: 101,
        currency: Currency.UAH,
      },
    },
  ],
  statistics: [],
  grouped_splits: {
    'ФОП Кракозябра Василь Петрович': [
      {
        split_payment_id: '91a018127b0244d7ba1aba09c810c3bd',
        payment_provider: FleetMerchant.FONDY,
        merchant_id: '500001',
        total: {
          amount: 16_000,
          currency: Currency.UAH,
        },
        fee: {
          amount: 101,
          currency: Currency.UAH,
        },
      },
      {
        split_payment_id: '91a018127b0244d7ba1aba09c810c3bd',
        payment_provider: FleetMerchant.IPAY,
        merchant_id: '12114',
        total: {
          amount: 16_000,
          currency: Currency.UAH,
        },
        fee: {
          amount: 101,
          currency: Currency.UAH,
        },
      },
      {
        split_payment_id: '91a018127b0244d7ba1aba09c810c3bd',
        payment_provider: FleetMerchant.PLATON,
        merchant_id: '3000',
        total: {
          amount: 16_000,
          currency: Currency.UAH,
        },
        fee: {
          amount: 101,
          currency: Currency.UAH,
        },
      },
    ],
  },
};

export const ORDER_REPORT_ITEM_2_MOCK: ReportByOrdersDto = {
  driver: {
    id: '340bf7d6-d9fe-4229-84db-05c28d961045',
    signal: 502_593,
    first_name: 'Артем',
    last_name: 'Бурум ',
  },
  has_error: false,
  total_orders_count: 11,
  total_distance_meters: 162_000,
  total_executing_time: 10_000,
  average_price_per_kilometer: {
    amount: 200_103,
    currency: Currency.UAH,
  },
  statistics: [],
  profit: {
    total: {
      amount: 342_280,
      currency: Currency.UAH,
    },
    order: {
      total: {
        amount: 425_600,
        currency: Currency.UAH,
      },
      cash: {
        amount: 23_200,
        currency: Currency.UAH,
      },
      wallet: {
        amount: 80_480,
        currency: Currency.UAH,
      },
    },
    tips: {
      amount: 1800,
      currency: Currency.UAH,
    },
    merchant: {
      amount: 321_920,
      currency: Currency.UAH,
    },
    compensation: {
      amount: 23_100,
      currency: Currency.UAH,
    },
    commission_programs_profit: {
      amount: 42_221,
      currency: Currency.UAH,
    },
  },
  loss: {
    order: {
      total: {
        amount: -85_120,
        currency: Currency.UAH,
      },
      wallet: {
        amount: -85_120,
        currency: Currency.UAH,
      },
    },
  },
  split_payments: [
    {
      payment_provider: FleetMerchant.FONDY,
      merchant_id: ' 500001',
      total: {
        amount: 101_520,
        currency: Currency.UAH,
      },
      fee: {
        amount: 101,
        currency: Currency.UAH,
      },
    },
    {
      payment_provider: FleetMerchant.IPAY,
      merchant_id: '12114',
      total: {
        amount: 220_400,
        currency: Currency.UAH,
      },
      fee: {
        amount: 101,
        currency: Currency.UAH,
      },
    },
  ],
  grouped_splits: {
    'ФОП Кракозябра Василь Петрович': [
      {
        payment_provider: FleetMerchant.FONDY,
        merchant_id: ' 500001',
        total: {
          amount: 101_520,
          currency: Currency.UAH,
        },
        fee: {
          amount: 101,
          currency: Currency.UAH,
        },
      },
      {
        payment_provider: FleetMerchant.PLATON,
        merchant_id: '12114',
        total: {
          amount: 220_400,
          currency: Currency.UAH,
        },
        fee: {
          amount: 101,
          currency: Currency.UAH,
        },
      },
    ],
  },
};

export const ORDER_REPORT_ITEM_3_MOCK: ReportByOrdersDto = {
  driver: {
    id: '340bf7d6-d9fe-4229-84db-05c28d961045',
    signal: 502_593,
    first_name: 'Артем',
    last_name: 'Бурум ',
  },
  statistics: [],
  has_error: false,
  total_orders_count: 11,
  total_distance_meters: 162_000,
  total_executing_time: 10_000,
  average_price_per_kilometer: {
    amount: 200_103,
    currency: Currency.UAH,
  },
  profit: {
    total: {
      amount: 342_280,
      currency: Currency.UAH,
    },
    order: {
      total: {
        amount: 425_600,
        currency: Currency.UAH,
      },
      cash: {
        amount: 23_200,
        currency: Currency.UAH,
      },
      wallet: {
        amount: 80_480,
        currency: Currency.UAH,
      },
    },
    tips: {
      amount: 1800,
      currency: Currency.UAH,
    },
    merchant: {
      amount: 321_920,
      currency: Currency.UAH,
    },
    compensation: {
      amount: 5500,
      currency: Currency.UAH,
    },
    commission_programs_profit: {
      amount: 1200,
      currency: Currency.UAH,
    },
  },
  loss: {
    order: {
      total: {
        amount: -85_120,
        currency: Currency.UAH,
      },
      wallet: {
        amount: -85_120,
        currency: Currency.UAH,
      },
    },
  },
  split_payments: [
    {
      payment_provider: FleetMerchant.FONDY,
      merchant_id: '500001',
      total: {
        amount: 101_520,
        currency: Currency.UAH,
      },
      fee: {
        amount: 101,
        currency: Currency.UAH,
      },
    },
    {
      payment_provider: FleetMerchant.IPAY,
      merchant_id: '12114',
      total: {
        amount: 220_400,
        currency: Currency.UAH,
      },
      fee: {
        amount: 101,
        currency: Currency.UAH,
      },
    },
    {
      payment_provider: FleetMerchant.PLATON,
      merchant_id: '3000',
      total: {
        amount: 310_040,
        currency: Currency.UAH,
      },
      fee: {
        amount: 101,
        currency: Currency.UAH,
      },
    },
  ],
  grouped_splits: {
    'ФОП Кракозябра Василь Петрович': [
      {
        payment_provider: FleetMerchant.FONDY,
        merchant_id: ' 500001',
        total: {
          amount: 101_520,
          currency: Currency.UAH,
        },
        fee: {
          amount: 101,
          currency: Currency.UAH,
        },
      },
      {
        payment_provider: FleetMerchant.PLATON,
        merchant_id: '12114',
        total: {
          amount: 220_400,
          currency: Currency.UAH,
        },
        fee: {
          amount: 101,
          currency: Currency.UAH,
        },
      },
    ],
  },
};

export const ORDER_REPORT_ITEM_4_MOCK: ReportByOrdersDto = {
  driver: {
    id: '32174d5e-359e-4dbd-b5f9-4d42a38a4cee',
    signal: 502_539,
    first_name: 'Антон',
    last_name: 'Караванський',
  },
  has_error: false,
  total_orders_count: 3,
  total_distance_meters: 46_000,
  total_executing_time: 0,
  average_price_per_kilometer: {
    amount: 946,
    currency: Currency.UAH,
  },
  profit: {
    total: {
      amount: 168_680,
      currency: Currency.UAH,
    },
    order: {
      total: {
        amount: 161_800,
        currency: Currency.UAH,
      },
      wallet: {
        amount: 146_120,
        currency: Currency.UAH,
      },
    },
    promotion: {
      amount: 11_100,
      currency: Currency.UAH,
    },
    merchant: {
      amount: 15_680,
      currency: Currency.UAH,
    },
    compensation: {
      amount: 10_000,
      currency: Currency.UAH,
    },
    commission_programs_profit: {
      amount: 0,
      currency: Currency.UAH,
    },
  },
  loss: {
    order: {
      total: {
        amount: -4220,
        currency: Currency.UAH,
      },
      wallet: {
        amount: -4220,
        currency: Currency.UAH,
      },
    },
  },
  split_payments: [
    {
      payment_provider: FleetMerchant.IPAY,
      merchant_id: '12114',
      total: {
        amount: 15_680,
        currency: Currency.UAH,
      },
      fee: {
        amount: 101,
        currency: Currency.UAH,
      },
    },
  ],
  statistics: [],
  grouped_splits: {
    'ФОП Test': [
      {
        split_payment_id: '91a018127b0244d7ba1aba09c810c3bd',
        payment_provider: FleetMerchant.FONDY,
        merchant_id: '500001',
        total: {
          amount: 16_000,
          currency: Currency.UAH,
        },
        fee: {
          amount: 101,
          currency: Currency.UAH,
        },
      },
      {
        split_payment_id: '91a018127b0244d7ba1aba09c810c3bd',
        payment_provider: FleetMerchant.IPAY,
        merchant_id: '12114',
        total: {
          amount: 16_000,
          currency: Currency.UAH,
        },
        fee: {
          amount: 101,
          currency: Currency.UAH,
        },
      },
      {
        split_payment_id: '91a018127b0244d7ba1aba09c810c3bd',
        payment_provider: FleetMerchant.PLATON,
        merchant_id: '3000',
        total: {
          amount: 16_000,
          currency: Currency.UAH,
        },
        fee: {
          amount: 101,
          currency: Currency.UAH,
        },
      },
    ],
  },
};

export const REPORTS_ORDERS_COLLECTION_MOCK: ReportByOrdersCollectionDto = {
  has_more_items: true,
  items: [ORDER_REPORT_ITEM_1_MOCK, ORDER_REPORT_ITEM_2_MOCK, ORDER_REPORT_ITEM_3_MOCK],
};

export const ORDER_REPORTS_PAGE_1 = [
  ORDER_REPORT_ITEM_1_MOCK,
  ORDER_REPORT_ITEM_2_MOCK,
  ORDER_REPORT_ITEM_3_MOCK,
  ORDER_REPORT_ITEM_1_MOCK,
  ORDER_REPORT_ITEM_2_MOCK,
  ORDER_REPORT_ITEM_3_MOCK,
  ORDER_REPORT_ITEM_1_MOCK,
  ORDER_REPORT_ITEM_2_MOCK,
  ORDER_REPORT_ITEM_3_MOCK,
  ORDER_REPORT_ITEM_1_MOCK,
  ORDER_REPORT_ITEM_1_MOCK,
  ORDER_REPORT_ITEM_2_MOCK,
  ORDER_REPORT_ITEM_3_MOCK,
  ORDER_REPORT_ITEM_1_MOCK,
  ORDER_REPORT_ITEM_2_MOCK,
  ORDER_REPORT_ITEM_3_MOCK,
  ORDER_REPORT_ITEM_1_MOCK,
  ORDER_REPORT_ITEM_2_MOCK,
  ORDER_REPORT_ITEM_3_MOCK,
  ORDER_REPORT_ITEM_1_MOCK,
  ORDER_REPORT_ITEM_1_MOCK,
  ORDER_REPORT_ITEM_2_MOCK,
  ORDER_REPORT_ITEM_3_MOCK,
  ORDER_REPORT_ITEM_1_MOCK,
  ORDER_REPORT_ITEM_2_MOCK,
  ORDER_REPORT_ITEM_3_MOCK,
  ORDER_REPORT_ITEM_1_MOCK,
  ORDER_REPORT_ITEM_2_MOCK,
  ORDER_REPORT_ITEM_3_MOCK,
  ORDER_REPORT_ITEM_1_MOCK,
];

export const ORDER_REPORTS_PAGE_2 = [
  ORDER_REPORT_ITEM_1_MOCK,
  ORDER_REPORT_ITEM_2_MOCK,
  ORDER_REPORT_ITEM_3_MOCK,
  ORDER_REPORT_ITEM_1_MOCK,
  ORDER_REPORT_ITEM_2_MOCK,
  ORDER_REPORT_ITEM_3_MOCK,
  ORDER_REPORT_ITEM_1_MOCK,
  ORDER_REPORT_ITEM_2_MOCK,
  ORDER_REPORT_ITEM_3_MOCK,
  ORDER_REPORT_ITEM_1_MOCK,
  ORDER_REPORT_ITEM_1_MOCK,
  ORDER_REPORT_ITEM_2_MOCK,
  ORDER_REPORT_ITEM_3_MOCK,
  ORDER_REPORT_ITEM_1_MOCK,
  ORDER_REPORT_ITEM_2_MOCK,
  ORDER_REPORT_ITEM_3_MOCK,
  ORDER_REPORT_ITEM_1_MOCK,
  ORDER_REPORT_ITEM_2_MOCK,
  ORDER_REPORT_ITEM_3_MOCK,
  ORDER_REPORT_ITEM_1_MOCK,
  ORDER_REPORT_ITEM_1_MOCK,
  ORDER_REPORT_ITEM_2_MOCK,
  ORDER_REPORT_ITEM_3_MOCK,
  ORDER_REPORT_ITEM_1_MOCK,
  ORDER_REPORT_ITEM_2_MOCK,
  ORDER_REPORT_ITEM_3_MOCK,
  ORDER_REPORT_ITEM_1_MOCK,
  ORDER_REPORT_ITEM_2_MOCK,
  ORDER_REPORT_ITEM_3_MOCK,
  ORDER_REPORT_ITEM_1_MOCK,
];

export const ORDER_REPORTS_PAGE_3 = [
  ORDER_REPORT_ITEM_1_MOCK,
  ORDER_REPORT_ITEM_2_MOCK,
  ORDER_REPORT_ITEM_3_MOCK,
  ORDER_REPORT_ITEM_1_MOCK,
  ORDER_REPORT_ITEM_2_MOCK,
  ORDER_REPORT_ITEM_3_MOCK,
  ORDER_REPORT_ITEM_1_MOCK,
  ORDER_REPORT_ITEM_2_MOCK,
  ORDER_REPORT_ITEM_3_MOCK,
  ORDER_REPORT_ITEM_1_MOCK,
  ORDER_REPORT_ITEM_1_MOCK,
  ORDER_REPORT_ITEM_2_MOCK,
  ORDER_REPORT_ITEM_3_MOCK,
  ORDER_REPORT_ITEM_1_MOCK,
  ORDER_REPORT_ITEM_2_MOCK,
  ORDER_REPORT_ITEM_3_MOCK,
  ORDER_REPORT_ITEM_1_MOCK,
  ORDER_REPORT_ITEM_2_MOCK,
  ORDER_REPORT_ITEM_3_MOCK,
  ORDER_REPORT_ITEM_1_MOCK,
  ORDER_REPORT_ITEM_1_MOCK,
  ORDER_REPORT_ITEM_2_MOCK,
  ORDER_REPORT_ITEM_3_MOCK,
  ORDER_REPORT_ITEM_1_MOCK,
  ORDER_REPORT_ITEM_2_MOCK,
  ORDER_REPORT_ITEM_3_MOCK,
  ORDER_REPORT_ITEM_1_MOCK,
  ORDER_REPORT_ITEM_2_MOCK,
  ORDER_REPORT_ITEM_3_MOCK,
  ORDER_REPORT_ITEM_1_MOCK,
];

export const ORDERS_REPORTS_REQUEST_MOCK: ReportByOrdersCollectionDto = {
  has_more_items: true,
  items: [...ORDER_REPORTS_PAGE_1, ...ORDER_REPORTS_PAGE_2, ...ORDER_REPORTS_PAGE_3],
};
