import { FleetMerchant, StatisticDetailsDto } from '@data-access';

import { Currency } from '@uklon/types';

export const DRIVER_STATISTIC_MOCK: StatisticDetailsDto = {
  rating: 5,
  completed_orders: 7,
  total_distance_meters: 124_000,
  cancellation_percentage: 0,
  profit: {
    total: {
      amount: 117_280,
      currency: Currency.UAH,
    },
    order: {
      total: {
        amount: 134_100,
        currency: Currency.UAH,
      },
      cash: {
        amount: 114_100,
        currency: Currency.UAH,
      },
      wallet: {
        amount: 4000,
        currency: Currency.UAH,
      },
      merchant: {
        amount: 16_000,
        currency: Currency.UAH,
      },
      card: {
        amount: 2500,
        currency: Currency.UAH,
      },
    },
    compensation: {
      amount: 26_750,
      currency: Currency.UAH,
    },
    commission_programs_profit: {
      amount: 12_333,
      currency: Currency.UAH,
    },
    tips: {
      amount: 12_330,
      currency: Currency.UAH,
    },
    bonus: {
      amount: 5400,
      currency: Currency.UAH,
    },
  },
  loss: {
    order: {
      total: {
        amount: -26_820,
        currency: Currency.UAH,
      },
      wallet: {
        amount: -26_820,
        currency: Currency.UAH,
      },
    },
    total: {
      amount: 3211,
      currency: Currency.UAH,
    },
  },
  earnings_for_period: {
    amount: 117_280,
    currency: Currency.UAH,
  },
  split_payments: [
    {
      payment_provider: FleetMerchant.FONDY,
      merchant_id: ' 500001',
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
  total_executing_time: 130_932,
  average_price_per_kilometer: {
    amount: 1920,
    currency: Currency.UAH,
  },
};
