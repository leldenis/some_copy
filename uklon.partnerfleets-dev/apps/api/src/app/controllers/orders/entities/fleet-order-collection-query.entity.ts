import { GatewayOrderProductConditionEntity } from '@api/controllers/orders/entities/gateway-order-product-condition.entity';
import { OrderStatus, ProductType } from '@constant';
import { FleetOrderRecordCollectionQueryDto, GatewayOrderProductConditionDto } from '@data-access';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';

export class FleetOrderCollectionQueryEntity implements FleetOrderRecordCollectionQueryDto {
  @ApiProperty({ type: String })
  @Expose({ name: 'fleet_id' })
  @Type(() => String)
  @Transform(({ value }) => value?.replace(/-/g, ''), { toPlainOnly: true })
  public fleetId: string;

  @ApiProperty({ type: Number })
  @Expose()
  @Type(() => Number)
  public from: number;

  @ApiProperty({ type: Number })
  @Expose()
  @Type(() => Number)
  public to: number;

  @ApiPropertyOptional({ type: String })
  @Expose({ name: 'vehicle_id', toPlainOnly: true })
  @Type(() => String)
  @Transform(({ value }) => value?.replace(/-/g, ''), { toPlainOnly: true })
  public vehicleId?: string;

  @ApiPropertyOptional({ type: String })
  @Expose({ name: 'driver_id', toPlainOnly: true })
  @Expose({ toClassOnly: true })
  @Type(() => String)
  @Transform(({ value }) => value?.replace(/-/g, ''), { toPlainOnly: true })
  public driverId?: string;

  @ApiPropertyOptional({ type: String })
  @Expose({ toClassOnly: true })
  @Type(() => String)
  public licencePlate?: string;

  @ApiPropertyOptional({ type: Number })
  @Expose()
  @Type(() => Number)
  public cursor?: number;

  @ApiPropertyOptional({ type: Number })
  @Expose()
  @Type(() => Number)
  public limit?: number;

  @ApiPropertyOptional({ enum: ProductType, enumName: 'ProductType' })
  @Expose({ name: 'product_type', toPlainOnly: true })
  @Expose({ toClassOnly: true })
  @Type(() => String)
  public productType?: ProductType | '' = '';

  @ApiPropertyOptional({ type: GatewayOrderProductConditionEntity, isArray: true })
  @Expose({ name: 'product_conditions', toPlainOnly: true })
  @Expose({ toClassOnly: true })
  @Type(() => Array<GatewayOrderProductConditionDto>)
  public productConditions?: GatewayOrderProductConditionDto[];

  @ApiPropertyOptional({ enum: OrderStatus, enumName: 'OrderStatus' })
  @Expose()
  @Type(() => String)
  public status?: OrderStatus | '' = '';
}
