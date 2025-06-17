import { OrderStatus } from '@constant';

export const DRIVER_ORDER_STATUS_INTL = new Map<OrderStatus, string>([
  [OrderStatus.COMPLETED, 'Orders.Trips.Filter.OrderStatus.completed'],
  [OrderStatus.CANCELED, 'Orders.Trips.Filter.OrderStatus.canceled'],
  [OrderStatus.RUNNING, 'Orders.Trips.Filter.OrderStatus.running'],
]);
