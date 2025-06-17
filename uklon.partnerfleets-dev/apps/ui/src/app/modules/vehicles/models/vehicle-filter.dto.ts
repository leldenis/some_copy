import { OrderStatus, ProductType } from '@constant';

export interface FleetVehicleOrdersFiltersDto {
  driverId: string;
  date: {
    from: number;
    to: number;
  };
  status: '' | OrderStatus;
  productType: '' | ProductType;
}
