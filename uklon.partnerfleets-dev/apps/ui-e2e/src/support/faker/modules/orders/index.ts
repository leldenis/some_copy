import { FleetOrderRecordDto, FleetOrderRecordCollectionDto } from '@data-access';

import { ModuleBase } from '../_internal';

const EVENT_DEFAULT_COUNT = 5;

export type BuildProps = Partial<{
  items: FleetOrderRecordDto[];
  orders_count?: number;
}>;

export class FleetOrdersModule extends ModuleBase<FleetOrderRecordCollectionDto> {
  public buildDto(props?: BuildProps): FleetOrderRecordCollectionDto {
    return {
      cursor: 0,
      items:
        props.items ??
        Array.from({ length: props?.orders_count ?? EVENT_DEFAULT_COUNT }).map((_, index) =>
          this.buildEvent.bind(index, this),
        ),
    };
  }

  private buildEvent(): FleetOrderRecordDto {
    return {
      id: this.faker.string.uuid(),
      driver: {
        fullName: 'Aqaafeyh404 Aqadpilu404',
        id: '1fad966ab2f4427ba0da4b04be5f871f',
      },
      vehicle: {
        id: 'b5bbf6cadec64073a1db4b3bb4dd171c',
        licencePlate: 'AQA0001',
        productType: 'Standart',
      },
      route: {
        points: [
          {
            address: 'Строителей проспект, 37а',
          },
          {
            address: 'Победы проспект, 32/42',
          },
        ],
      },
      payment: {
        cost: 95,
        currency: 'UAH',
        distance: 11.81,
        feeType: 'cash',
        paymentType: 'cash',
      },
      status: 'completed',
      pickupTime: 1_684_764_504,
    };
  }
}
