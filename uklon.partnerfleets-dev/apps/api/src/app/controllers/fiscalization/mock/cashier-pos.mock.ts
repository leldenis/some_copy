import { FleetCashPointCollection, FleetCashPointDto } from '@data-access';

export const CASHIER_POS_ITEM_1_MOCK: FleetCashPointDto = {
  id: '1d73e1d0-f537-4073-a960-3a86e7c4493a',
  name: 'Cash Post 1',
  organization_name: 'Cash Post 1',
  fiscal_number: 1_234_567_890,
  vehicles: [{ id: 'ef1403bf-ec39-4093-86a3-8e41ee765407' }],
};

export const CASHIER_POS_ITEM_2_MOCK: FleetCashPointDto = {
  id: '2d73e1d0-f537-4073-a960-3a86e7c4493b',
  name: 'Cash Post 2',
  organization_name: 'Cash Post 2',
  fiscal_number: 1_234_567_890,
  vehicles: [
    { id: '2fffefe2-127d-4154-8edd-a91d21a9a431' },
    { id: 'e2d9a1b9-25c5-4dd9-8639-4d8bca94897a' },
    { id: '05578a57-9623-4695-a047-de306f15fae8' },
  ],
};

export const CASHIER_POS_ITEM_3_MOCK: FleetCashPointDto = {
  id: '3d73e1d0-f537-4073-a960-3a86e7c4493c',
  name: 'Cash Post 3',
  organization_name: 'Cash Post 3',
  fiscal_number: 1_234_567_890,
  vehicles: [{ id: 'b7f419ce-2f8c-4b40-be21-593766f807df' }],
};

export const CASHIER_POS_ITEM_4_MOCK: FleetCashPointDto = {
  id: '4d73e1d0-f537-4073-a960-3a86e7c4493d',
  name: 'Cash Post 4',
  organization_name: 'Cash Post 4',
  fiscal_number: 1_234_567_890,
  vehicles: [{ id: '6a08ee65-3d61-40f6-9357-d1f505952fc1' }],
};

export const CASHIER_POS_ITEM_5_MOCK: FleetCashPointDto = {
  id: '5d73e1d0-f537-4073-a960-3a86e7c4493e',
  name: 'Cash Post 5',
  organization_name: 'Cash Post 5',
  fiscal_number: 1_234_567_890,
  vehicles: [{ id: '98ff5d8c-610b-4ea3-b550-e049f1712687' }],
};

export const CASHIER_POSITIONS_MOCK: FleetCashPointCollection = [
  CASHIER_POS_ITEM_1_MOCK,
  CASHIER_POS_ITEM_2_MOCK,
  CASHIER_POS_ITEM_3_MOCK,
  CASHIER_POS_ITEM_4_MOCK,
  CASHIER_POS_ITEM_5_MOCK,
];
