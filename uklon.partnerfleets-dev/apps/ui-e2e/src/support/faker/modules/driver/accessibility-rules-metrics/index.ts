import { DriverFleetType } from '@constant';
import { DriverAccessibilityRulesMetricsDto } from '@data-access';

import { ModuleBase } from '../../_internal';

export type BuildProps = Partial<{
  cancel_rate?: number;
  completed_orders_count?: number;
  rating?: number;
  working_days?: number;
  fleet_type?: DriverFleetType;
  response?: DriverAccessibilityRulesMetricsDto;
}>;

export class DriverAccessibilityRulesMatricsModule extends ModuleBase<DriverAccessibilityRulesMetricsDto, BuildProps> {
  public buildDto(props?: BuildProps): DriverAccessibilityRulesMetricsDto {
    return (
      props?.response ?? {
        cancel_rate: props?.cancel_rate ?? 0,
        completed_orders_count: props?.completed_orders_count ?? 10,
        rating: props?.rating ?? 500,
        working_days: props?.working_days ?? 50,
        fleet_type: props?.fleet_type ?? DriverFleetType.COMMERCIAL,
      }
    );
  }
}
