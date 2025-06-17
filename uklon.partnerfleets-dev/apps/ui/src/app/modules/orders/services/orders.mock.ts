import { FleetMerchant, FleetOrderRecordDto, FleetOrderRecordCollectionDto } from '@data-access';

import { Currency } from '@uklon/types';

export const ORDERS_TRIP_ITEM_1_MOCK: FleetOrderRecordDto = {
  id: '0466df1e54224251816124d9174c1a95',
  fleetId: '2c854e0fb08a44479e2b25b1a90f2f93',
  status: 'completed',
  pickupTime: 1_710_778_380,
  completedAt: 1_710_781_923,
  acceptedAt: 1_710_777_315,
  payment: {
    cost: 300,
    currency: Currency.UAH,
    distance: 27.35,
    paymentType: 'cash',
    feeType: 'cash',
  },
  merchantIncome: {
    amount: 18_000,
    currency: Currency.UAH,
  },
  driver: {
    id: 'b8fea45d55cf4cfa889c42fb4152421e',
    fullName: 'Тестович Тестік',
  },
  vehicle: {
    id: 'd3690068e4874f979a6efafdd7c95433',
    licencePlate: 'CAR6504',
    productType: 'standard',
  },
  route: {
    points: [
      {
        address: 'Соборна вулиця, 126/19',
      },
      {
        address: 'ТРЦ Рівер Молл (Дніпровська набережна, 10-14)',
      },
    ],
  },
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
  isCorporateOrder: false,
  hasAdditionalIncome: true,
  additionalIncome: {
    promo: {
      amount: 0,
      currency: Currency.UAH,
    },
    idle: {
      amount: 0,
      currency: Currency.UAH,
    },
    compensation: {
      amount: 10_000,
      currency: Currency.UAH,
    },
    tips: {
      amount: 0,
      currency: Currency.UAH,
    },
    penalty: {
      amount: 0,
      currency: Currency.UAH,
    },
  },
};

export const ORDERS_TRIP_ITEM_2_MOCK: FleetOrderRecordDto = {
  id: '756b94fad8454683a34d5221166f1b9d',
  fleetId: '2c854e0fb08a44479e2b25b1a90f2f93',
  status: 'completed',
  pickupTime: 1_710_778_271,
  completedAt: 1_710_781_813,
  acceptedAt: 1_710_777_264,
  payment: {
    cost: 112,
    currency: Currency.UAH,
    distance: 11.72,
    paymentType: 'cash',
    feeType: 'cash',
  },
  merchantIncome: {
    amount: 0,
    currency: Currency.UAH,
  },
  driver: {
    id: 'b8fea45d55cf4cfa889c42fb4152421e',
    fullName: 'Тестович Тестік',
  },
  vehicle: {
    id: 'd3690068e4874f979a6efafdd7c95433',
    licencePlate: 'CAR6504',
    productType: 'standard',
  },
  route: {
    points: [
      {
        address: 'Соборна вулиця, 126/19',
      },
      {
        address: 'ТРЦ Республіка Парк (Кільцева дорога, 1)',
      },
    ],
  },
  grouped_splits: {},
  isCorporateOrder: false,
  hasAdditionalIncome: false,
  additionalIncome: {
    promo: {
      amount: 0,
      currency: Currency.UAH,
    },
    idle: {
      amount: 0,
      currency: Currency.UAH,
    },
    compensation: {
      amount: 0,
      currency: Currency.UAH,
    },
    tips: {
      amount: 0,
      currency: Currency.UAH,
    },
    penalty: {
      amount: 0,
      currency: Currency.UAH,
    },
  },
};

export const ORDERS_TRIP_ITEM_3_MOCK: FleetOrderRecordDto = {
  id: 'dbddc50b981c4309b2b88521c39abcba',
  fleetId: '2c854e0fb08a44479e2b25b1a90f2f93',
  status: 'completed',
  pickupTime: 1_710_778_207,
  completedAt: 1_710_781_748,
  acceptedAt: 1_710_777_212,
  payment: {
    cost: 151,
    currency: Currency.UAH,
    distance: 14.98,
    paymentType: 'cash',
    feeType: 'cash',
  },
  merchantIncome: {
    amount: 0,
    currency: Currency.UAH,
  },
  driver: {
    id: 'b8fea45d55cf4cfa889c42fb4152421e',
    fullName: 'Тестович Тестік',
  },
  vehicle: {
    id: 'd3690068e4874f979a6efafdd7c95433',
    licencePlate: 'CAR6504',
    productType: 'standard',
  },
  route: {
    points: [
      {
        address: 'Соборна вулиця, 126/19',
      },
      {
        address: 'ТРЦ Лавина Молл (Берковецька вулиця, 6Д)',
      },
    ],
  },
  grouped_splits: {},
  isCorporateOrder: false,
  hasAdditionalIncome: false,
  additionalIncome: {
    promo: {
      amount: 0,
      currency: Currency.UAH,
    },
    idle: {
      amount: 0,
      currency: Currency.UAH,
    },
    compensation: {
      amount: 0,
      currency: Currency.UAH,
    },
    tips: {
      amount: 0,
      currency: Currency.UAH,
    },
    penalty: {
      amount: 0,
      currency: Currency.UAH,
    },
  },
};

export const ORDERS_TRIPS_COLLECTION_MOCK: FleetOrderRecordCollectionDto = {
  items: [ORDERS_TRIP_ITEM_1_MOCK, ORDERS_TRIP_ITEM_2_MOCK, ORDERS_TRIP_ITEM_3_MOCK],
  cursor: 53_636,
};
