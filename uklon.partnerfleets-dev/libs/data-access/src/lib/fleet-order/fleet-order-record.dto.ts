import { OrderStatus, ProductType } from '@constant';

import { MoneyDto } from '../finance/money.dto';
import { GroupedByEntrepreneurSplitPaymentDto } from '../finance/split-payment.dto';

import { FleetOrderRecordEmployeeDto } from './fleet-order-record-employee.dto';
import { FleetOrderRecordPaymentDto } from './fleet-order-record-payment.dto';
import { FleetOrderRecordRouteDto } from './fleet-order-record-route.dto';
import { FleetOrderRecordVehicleDto } from './fleet-order-record-vehicle.dto';

export interface FleetOrderRecordDto {
  id: string;
  driver: FleetOrderRecordEmployeeDto;
  vehicle: FleetOrderRecordVehicleDto;
  route: FleetOrderRecordRouteDto;
  payment: FleetOrderRecordPaymentDto;
  status: string;
  pickupTime: number;
  optional?: boolean;
  cancellation?: FleetOrderRecordCancellationDto;
  merchantIncome?: MoneyDto;
  grouped_splits?: GroupedByEntrepreneurSplitPaymentDto;
  isCorporateOrder?: boolean;
  additionalIncome?: FleetOrderRecordAdditionalIncomeDto;
  hasAdditionalIncome?: boolean;
  fleetId?: string;
  completedAt?: number;
  acceptedAt?: number;
}

export interface FleetOrderRecordAdditionalIncomeDto {
  promo: MoneyDto;
  idle: MoneyDto;
  compensation: MoneyDto;
  tips: MoneyDto;
  penalty: MoneyDto;
}

export interface FleetOrderRecordCancellationDto {
  initiator: string;
  rejected: boolean;
}

export interface FleetDriverOrdersFiltersDto {
  licencePlate: string;
  date: {
    from: number;
    to: number;
  };
  status: '' | OrderStatus;
  productType: '' | ProductType;
}
