import { ProductConfigurationUpdateItemEntity } from '@api/controllers/vehicles/entities/product-configuration-update-item.entity';
import { ProductConfigurationUpdateItemCollectionDto, ProductConfigurationUpdateItemDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class ProductConfigurationUpdateItemCollectionEntity implements ProductConfigurationUpdateItemCollectionDto {
  @ApiProperty({ type: ProductConfigurationUpdateItemEntity, isArray: true })
  public items: ProductConfigurationUpdateItemDto[];
}
