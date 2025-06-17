import { OrderStatus, ProductType } from '@constant';

export interface OrderFilterDto {
  dateRange?: {
    from: number;
    to: number;
  };
  licencePlate?: string;
  productType?: ProductType | string;
  status?: OrderStatus | string;
  driverId?: string;
  limit?: number;
  cursor?: number;
}
