import { BrandingBonusSpecOrderCountDto } from './branding-bonus-spec-order-count.dto';

export interface BrandingProgramParamsOrdersDto {
  completed: {
    count: BrandingBonusSpecOrderCountDto[];
  };
  cancelled: {
    percent: BrandingBonusSpecOrderCountDto[];
  };
}
