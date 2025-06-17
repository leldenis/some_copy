import { amountToMoney } from '@api/common/utils/money-mapper';
import { getMerchantIncome, mapSplits, orderReportingSplits } from '@api/common/utils/splits-mapper';
import { FleetOrderRouteEntity } from '@api/controllers/orders/entities/fleet-order-route.entity';
import { SplitPaymentEntity } from '@api/controllers/reports/entities/split-payment.entity';
import {
  FleetDriverBasicInfoDto,
  FleetOrderRecordDto,
  FleetOrderRecordAdditionalIncomeDto,
  FleetOrderRecordEmployeeDto,
  FleetOrderRecordPaymentDto,
  FleetOrderRecordRouteDto,
  FleetOrderRecordVehicleDto,
  GatewayFleetOrderDto,
  GroupedByEntrepreneurSplitPaymentDto,
  IndividualEntrepreneurDto,
  MoneyDto,
  VehicleBasicInfoDto,
} from '@data-access';
import { Exclude, Expose, Type } from 'class-transformer';

import { Currency } from '@uklon/types';

import { FleetOrderEmployeeEntity } from './fleet-order-employee.entity';
import { FleetOrderPaymentEntity } from './fleet-order-payment.entity';
import { FleetOrderVehicleEntity } from './fleet-order-vehicle.entity';

export class FleetOrderEntity implements FleetOrderRecordDto {
  @Exclude()
  private readonly fleetOrder: GatewayFleetOrderDto;

  @Exclude()
  private readonly fleetDriver?: FleetDriverBasicInfoDto;

  @Exclude()
  private readonly fleetVehicle?: VehicleBasicInfoDto;

  @Exclude()
  private readonly fleetEntrepreneurs?: IndividualEntrepreneurDto[];

  @Expose()
  @Type(() => String)
  public get id(): string {
    return this.fleetOrder.uid;
  }

  @Expose()
  @Type(() => String)
  public get fleetId(): string {
    const { fleet_id } = this.fleetOrder as unknown as { fleet_id: string };
    return fleet_id;
  }

  @Expose()
  @Type(() => String)
  public get status(): string {
    return this.fleetOrder.status;
  }

  @Expose()
  @Type(() => Number)
  public get pickupTime(): number {
    return this.fleetOrder.pickup_time;
  }

  @Expose()
  @Type(() => Number)
  public get completedAt(): number {
    return this.fleetOrder.completed_at;
  }

  @Expose()
  @Type(() => Number)
  public get acceptedAt(): number {
    return this.fleetOrder.accepted_at;
  }

  @Expose()
  @Type(() => Boolean)
  public get optional(): boolean {
    return this.fleetOrder?.optional;
  }

  @Expose()
  @Type(() => Object)
  public get cancellation(): { initiator: string; rejected: boolean } {
    return this.fleetOrder?.cancellation;
  }

  @Expose()
  @Type(() => FleetOrderPaymentEntity)
  public get payment(): FleetOrderRecordPaymentDto {
    return new FleetOrderPaymentEntity(this.fleetOrder);
  }

  @Expose()
  public get merchantIncome(): MoneyDto {
    return getMerchantIncome(this.fleetOrder?.split_payments, this.fleetOrder.cost.currency as Currency, true);
  }

  @Expose()
  @Type(() => FleetOrderEmployeeEntity)
  public get driver(): FleetOrderRecordEmployeeDto {
    return new FleetOrderEmployeeEntity(this.fleetOrder, this.fleetDriver);
  }

  @Expose()
  @Type(() => FleetOrderVehicleEntity)
  public get vehicle(): FleetOrderRecordVehicleDto {
    return new FleetOrderVehicleEntity(this.fleetOrder, this.fleetVehicle);
  }

  @Expose()
  @Type(() => FleetOrderRouteEntity)
  public get route(): FleetOrderRecordRouteDto {
    return new FleetOrderRouteEntity(this.fleetOrder.route);
  }

  @Expose()
  @Type(() => SplitPaymentEntity)
  public get grouped_splits(): GroupedByEntrepreneurSplitPaymentDto {
    return mapSplits(this.fleetEntrepreneurs, orderReportingSplits(this.fleetOrder?.split_payments), true);
  }

  @Expose()
  @Type(() => Boolean)
  public get isCorporateOrder(): boolean {
    return this.fleetOrder.payment_type === 'corporatewallet';
  }

  @Expose()
  @Type(() => Boolean)
  public get hasAdditionalIncome(): boolean {
    const { promo, idle, compensation, tips, penalty } = this.additionalIncome;
    return [promo, idle, compensation, tips, penalty].some(({ amount }) => amount > 0);
  }

  @Expose()
  public get additionalIncome(): FleetOrderRecordAdditionalIncomeDto {
    const { currency } = this.fleetOrder.cost;

    return {
      promo: amountToMoney(this.fleetOrder?.promo_discount?.amount?.amount, currency),
      idle: amountToMoney(this.fleetOrder?.idle.cost, currency),
      compensation: amountToMoney(this.fleetOrder?.finance_operations?.compensation, currency),
      tips: amountToMoney(this.fleetOrder?.finance_operations?.tips, currency),
      penalty: amountToMoney(this.fleetOrder?.finance_operations?.penalty, currency),
    };
  }

  constructor(
    order: GatewayFleetOrderDto,
    driver?: FleetDriverBasicInfoDto,
    vehicle?: VehicleBasicInfoDto,
    entrepreneurs?: IndividualEntrepreneurDto[],
  ) {
    this.fleetOrder = order;
    this.fleetDriver = driver;
    this.fleetVehicle = vehicle;
    this.fleetEntrepreneurs = entrepreneurs;
  }
}
