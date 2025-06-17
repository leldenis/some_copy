import { FleetOrderRecordEmployeeDto } from './fleet-order-record-employee.dto';

export interface OrderRecordDriverDto extends FleetOrderRecordEmployeeDto {
  rating: number;
  signal: number;
  phone: string;
  email: string;
}

export interface OrderRecordCourierDto extends FleetOrderRecordEmployeeDto {
  rating: number;
  phone: string;
  email: string;
}
