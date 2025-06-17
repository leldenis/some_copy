export interface FleetOrdersFiltersDto {
  date: {
    from: number;
    to: number;
  };
  driverId?: string;
}
