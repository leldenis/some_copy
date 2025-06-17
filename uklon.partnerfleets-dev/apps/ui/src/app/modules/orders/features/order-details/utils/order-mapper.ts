import { ActiveOrderItemDto, OrderRecordDto } from '@data-access';

export function activeOrderToOrder(order: ActiveOrderItemDto & OrderRecordDto): OrderRecordDto {
  return {
    id: order.id,
    payment: order.payment,
    status: order.status,
    createdAt: order.createdAt,
    driver: order.driver,
    vehicle: order.vehicle,
    pickupTime: order.pickupTime,
    route: {
      overviewPolyline: order.route.overwiew_polyline,
      points: order.route?.route_points?.map(({ lat: latitude, lng: longitude, address_name: address }) => ({
        longitude,
        latitude,
        address,
      })),
    },
  };
}
