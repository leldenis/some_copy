import { FleetSignatureKeysCollection } from '@data-access';

import { ModuleBase } from '../../../_internal';

export type BuildProps = FleetSignatureKeysCollection;

export class FleetSignatureKeysModule extends ModuleBase<FleetSignatureKeysCollection> {
  public buildDto(props?: BuildProps): FleetSignatureKeysCollection {
    return (
      props ?? [
        {
          fleet_id: '829492c9-29d5-41df-8e9b-14a407235ce1',
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
          },
        },
      ]
    );
  }
}
