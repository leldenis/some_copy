import { FleetOrdersFiltersDto, OffsetQueryParamsDto, OrdersQuery } from '@data-access';

export type OrderReports = Partial<FleetOrdersFiltersDto & OffsetQueryParamsDto>;

export interface OrderReportsParamsDto extends OrdersQuery {
  driverId?: string;
}
