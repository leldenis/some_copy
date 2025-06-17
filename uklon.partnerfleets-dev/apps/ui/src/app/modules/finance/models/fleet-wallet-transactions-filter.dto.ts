import { DateRangeDto } from '@data-access';

export interface FleetWalletTransactionsFilterDto {
  dateRange: {
    from: number;
    to: number;
    isCustom?: boolean;
  };
  offset: number;
  limit: number;
  isReset: boolean;
}

export interface TransactionsFilterDto {
  date: DateRangeDto;
}

export interface TransactionsFiltersDto {
  driverId: string;
  date: DateRangeDto;
}
