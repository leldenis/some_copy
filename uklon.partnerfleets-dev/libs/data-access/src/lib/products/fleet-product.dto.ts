import { AvailableDriverProduct, CourierProduct } from '@constant';

interface ProductDto<T> {
  id: string;
  name: T;
  code: T;
  condition_code: string;
  condition_value: string;
}

export type FleetProductDto = ProductDto<AvailableDriverProduct>;
export type FleetCourierProductDto = ProductDto<CourierProduct>;
