import { CourierProductEntity } from '@api/controllers/couriers/entities/courier-product.entity';
import { CourierProductCollectionDto, CourierProductDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class CourierProductCollectionEntity implements CourierProductCollectionDto {
  @ApiProperty({ type: CourierProductEntity, isArray: true })
  public items: CourierProductDto[];
}
