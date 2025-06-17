import { AvailableDriverProduct } from './enums/available-driver-product.enum';

export const DRIVER_EXCLUDED_PRODUCTS = new Set<AvailableDriverProduct>([
  AvailableDriverProduct.Volunteer,
  AvailableDriverProduct.Inclusive,
]);
