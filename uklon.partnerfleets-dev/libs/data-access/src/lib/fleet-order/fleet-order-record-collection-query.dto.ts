import { OrderStatus, ProductType } from '@constant';

import { CursorQueryDto, DateRangeQuery } from '../common';

export interface FleetOrderRecordCollectionQueryDto extends Partial<DateRangeQuery>, CursorQueryDto {
  fleetId: string;
  driverId?: string;
  vehicleId?: string;
  licencePlate?: string;
  productType?: ProductType | string;
  status?: OrderStatus | string;
  limit?: number;
}
