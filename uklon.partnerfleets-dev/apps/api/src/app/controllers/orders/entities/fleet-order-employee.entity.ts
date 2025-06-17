import {
  CourierDeliveryCollectionItemDto,
  FleetCourierNameByIdDto,
  FleetDriverBasicInfoDto,
  FleetOrderRecordEmployeeDto,
  GatewayFleetOrderDto,
} from '@data-access';
import { Exclude, Expose, Type } from 'class-transformer';

export class FleetOrderEmployeeEntity implements FleetOrderRecordEmployeeDto {
  @Exclude()
  private readonly order: GatewayFleetOrderDto | CourierDeliveryCollectionItemDto;

  @Exclude()
  private readonly employee?: FleetDriverBasicInfoDto | FleetCourierNameByIdDto;

  @Expose()
  @Type(() => String)
  public get id(): string {
    return (this.order as GatewayFleetOrderDto)?.driver_id || this.order?.courier_id;
  }

  @Expose()
  @Type(() => String)
  public get fullName(): string {
    const lastName = this.employee?.last_name ?? '';
    const firstName = this.employee?.first_name ?? '';
    return `${lastName} ${firstName}`;
  }

  constructor(
    order: GatewayFleetOrderDto | CourierDeliveryCollectionItemDto,
    employee?: FleetDriverBasicInfoDto | FleetCourierNameByIdDto,
  ) {
    this.order = order;
    this.employee = employee;
  }
}
