import { Day } from '@constant';

import { Currency } from '@uklon/types';

import { RangeItemsDto } from '../common';

import { BrandingProgramParamsOrdersDto } from './branding-program-params-orders.dto';

export interface BrandingBonusSpecificationRatingOldDto {
  last?: RangeItemsDto[];
}

export interface BrandingBonusSpecOldDto {
  region: number;
  rating: BrandingBonusSpecificationRatingOldDto;
  orders: BrandingProgramParamsOrdersDto;
  time: RangeItemsDto<string>[];
  days: Day[];
  currency: Currency;
  distance: RangeItemsDto;
  order_acceptance_methods?: string[];
  product_types?: string[];
  time_zone?: string;
  branding_types?: string[];
}
