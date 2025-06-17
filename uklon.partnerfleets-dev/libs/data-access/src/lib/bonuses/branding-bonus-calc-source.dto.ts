import { BrandingBonusOrderSourceDto } from './branding-bonus-order-source.dto';

export interface BrandingBonusCalcSourceDto {
  rating?: number;
  orders: BrandingBonusOrderSourceDto;
}
