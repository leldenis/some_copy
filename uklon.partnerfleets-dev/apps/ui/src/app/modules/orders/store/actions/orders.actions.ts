import { FleetOrderRecordCollectionDto, FleetOrderRecordCollectionQueryDto, OrderRecordDto } from '@data-access';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const OrdersFeatureActionGroup = createActionGroup({
  source: 'Orders feature',
  events: {
    'Query changed': props<FleetOrderRecordCollectionQueryDto>(),
    'Collection changed': props<FleetOrderRecordCollectionDto>(),
    // eslint-disable-next-line prettier/prettier
    'Error': emptyProps(),
    // eslint-disable-next-line prettier/prettier
    'Clear': emptyProps(),
    'Set order': props<OrderRecordDto>(),
    'Request order': props<{ orderId: string; driverId: string }>(),
  },
});
