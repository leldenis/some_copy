export interface DriverTransactionsFilterDto {
  date: {
    from: number;
    to: number;
  };
  driverId: string;
  offset: number;
  limit: number;
  isReset?: boolean;
}
