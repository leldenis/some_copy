import { OffsetQueryParamsDto } from '../common';

export interface BrandingBonusCalculationQueryOldDto extends OffsetQueryParamsDto {
  wallet_id: string;
  vehicle_id?: string;
  calculation_id?: string;
}
