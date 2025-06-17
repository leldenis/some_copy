import { Day } from '@constant';

import { Currency } from '@uklon/types';

import { RangeItemsDto } from '../common';

import { BrandingProgramParamsOrdersDto } from './branding-program-params-orders.dto';

export interface BrandingCalculationProgramParamsDto {
  regions: number[];
  driver_rating: RangeItemsDto;
  currency: Currency;
  time_zone?: string;
  orders: BrandingProgramParamsOrdersDto;
  distance: RangeItemsDto;
  time: RangeItemsDto<string>[];
  days: Day[];
  order_acceptance_methods?: string[];
  product_types?: string[];
  fleet_types?: string[];
  fleet_withdrawal_types?: string[];
  branding_types?: string[];
}
