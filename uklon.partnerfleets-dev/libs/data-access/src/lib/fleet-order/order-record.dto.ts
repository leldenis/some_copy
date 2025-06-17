import { FleetOrderRecordDto } from './fleet-order-record.dto';
import { OrderRecordCourierDto, OrderRecordDriverDto } from './order-record-employee.dto';
import { OrderRecordRouteDto } from './order-record-route.dto';
import { OrderRecordVehicleDto } from './order-record-vehicle.dto';

export interface OrderRecordDto extends FleetOrderRecordDto {
  createdAt: number;
  driver: OrderRecordDriverDto;
  vehicle: OrderRecordVehicleDto;
  route: OrderRecordRouteDto;
}

export interface DeliveryRecordDto extends Omit<OrderRecordDto, 'vehicle' | 'driver'> {
  courier: OrderRecordCourierDto;
}
