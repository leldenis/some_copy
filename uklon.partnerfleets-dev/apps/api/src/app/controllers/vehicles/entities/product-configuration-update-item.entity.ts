import { ProductConfigurationUpdateItemDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class ProductConfigurationUpdateItemEntity implements ProductConfigurationUpdateItemDto {
  @ApiProperty({ type: String })
  public product_id: string;

  @ApiProperty({ type: Boolean })
  public is_available: boolean;
}
