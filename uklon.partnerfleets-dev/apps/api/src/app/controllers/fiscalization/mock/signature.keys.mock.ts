import { FleetSignatureKeysCollection } from '@data-access';

export const SIGNATURE_KEY_MOCK = {
  fleet_id: '2c854e0f-b08a-4447-9e2b-25b1a90f2f93',
  key_id: '7bc931db-2b48-4481-95a8-a10cf2b31aba',
  created_at: 1_719_836_713,
  updated_at: 1_719_836_713,
  display_name: 'Key 1',
  drfo: '1232223333',
  expiration_date: 1_751_403_599,
  initiated_by: 'f025dee3-a645-4c36-9e96-49881f507345',
  public_key: '645b6efebe4a27de4a5209ea6c30b9584884822936fe813f9b7ebe05834c62ad',
  serial: '5E984D526F82F38F040000004F8DDC0013183405',
  status: false,
  cashier: {
    cashier_id: '12121',
    cashier_created_at: 12_332,
    /* points_of_sale: [
       {
        id: '12323',
        organization_name: 'asdasd',
        name: '12ss',
        fiscal_number: 123,
        vehicles: [
          {
            id: '123',
          },
        ],
      },
    ], */
  },
};

export const SIGNATURE_KEYS_COLLECTION_MOCK: FleetSignatureKeysCollection = [SIGNATURE_KEY_MOCK];
