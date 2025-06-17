import { AvailableDriverProduct } from '@constant';
import { VehicleProductConfigurationCollectionDto } from '@data-access';

import { ModuleBase } from '../../_internal';

export type BuildProps = Partial<{
  id: string;
  is_available?: string;
}>;

export class VehicleProductsModule extends ModuleBase<VehicleProductConfigurationCollectionDto> {
  public buildDto(): VehicleProductConfigurationCollectionDto {
    return {
      items: [
        {
          is_available: false,
          is_editable: false,
          product: {
            condition_value: 'Business',
            id: '7389fd54-78c8-4fa3-aa4a-328f6d35569',
            name: AvailableDriverProduct.Business,
            condition_code: 'Business',
            code: AvailableDriverProduct.Business,
          },
        },
        {
          is_available: true,
          is_editable: false,
          product: {
            condition_value: 'Comfort',
            id: '9c714251-9306-4a4e-b65b-41af5a6eef46',
            name: AvailableDriverProduct.Comfort,
            condition_code: 'Comfort',
            code: AvailableDriverProduct.Comfort,
          },
        },
      ],
    };
  }
}
