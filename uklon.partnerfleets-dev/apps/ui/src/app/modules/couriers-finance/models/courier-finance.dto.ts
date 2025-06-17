import { DateRangeDto } from '@data-access';

export interface CourierTransactionsFiltersDto {
  courierId: string;
  dateRange: DateRangeDto;
}
