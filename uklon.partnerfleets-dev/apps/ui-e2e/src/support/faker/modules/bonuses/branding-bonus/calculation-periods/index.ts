import { BrandingBonusCalculationPeriodDto, RangeItemsDto } from '@data-access';

import { ModuleBase } from '../../../_internal';

export type BuildProps = Partial<{
  count: number;
  calculation_id: string;
  period: RangeItemsDto;
  branding_types: string[];
  items: BrandingBonusCalculationPeriodDto[];
}>;

const DEFAULT_COUNT = 1;

export class BrandingCalculationPeriodsModule extends ModuleBase<BrandingBonusCalculationPeriodDto[], BuildProps> {
  public buildDto(props?: BuildProps): BrandingBonusCalculationPeriodDto[] {
    return props?.items?.length > 0
      ? props.items
      : Array.from({ length: props?.count ?? DEFAULT_COUNT }).map(this.buildItem.bind(this, props));
  }

  private buildItem(props?: BuildProps): BrandingBonusCalculationPeriodDto {
    return {
      calculation_id: props?.calculation_id ?? this.faker.string.uuid(),
      period: props?.period ?? {
        range: [1_739_743_200, 1_739_804_399],
      },
      calculation_created_at: 1_740_497_511,
      branding_types: props?.branding_types ?? [],
    };
  }
}
