import { OrderStatus } from '@constant';
import { DateRangeDto } from '@data-access';

export interface CourierDeliveriesFiltersDto extends CourierReportsFiltersDto {
  status: OrderStatus | '';
}

export interface CourierReportsFiltersDto {
  dateRange: DateRangeDto;
  courierId: string;
}
