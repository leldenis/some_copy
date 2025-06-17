import { DashboardStatisticsDto } from '@data-access';

import { ModuleBase } from '../_internal';

export type BuildProps = Partial<{
  totalDistanceMeters: number;
  totalOrdersCount: number;
}>;

export class DashboardStatisticsModule extends ModuleBase<DashboardStatisticsDto, BuildProps> {
  public buildDto(props?: BuildProps): DashboardStatisticsDto {
    return {
      average_order_cost: undefined,
      average_price_per_kilometer: undefined,
      bonuses_amount: undefined,
      fee_amount: undefined,
      gross_amount_cash: undefined,
      gross_amount_cashless: undefined,
      gross_income: undefined,
      histogram_items: [],
      product_items: [],
      profit_amount: undefined,
      top_drivers: [],
      total_distance_meters: props?.totalDistanceMeters ?? 0,
      total_orders_count: props?.totalOrdersCount ?? 0,
    };
  }
}
