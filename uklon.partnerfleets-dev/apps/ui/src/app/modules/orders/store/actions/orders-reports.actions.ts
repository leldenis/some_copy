import { DriversOrdersReportDto, InfinityScrollCollectionDto } from '@data-access';
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { OrderReports } from '@ui/modules/orders/models/order-reports.dto';

export const OrderReportsActionsGroup = createActionGroup({
  source: 'Orders feature',
  events: {
    'Get orders reports': props<OrderReports>(),
    'Get orders reports success': props<InfinityScrollCollectionDto<DriversOrdersReportDto>>(),
    'Get orders reports failed': emptyProps(),
    'Clear orders reports filter': props<OrderReports>(),
  },
});
