import { DriverProductConfigurationsEntity } from '@api/controllers/drivers/entities/driver-product-configurations.entity';
import { DriverProductConfigurationsCollectionDto, DriverProductConfigurationsDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class DriverProductConfigurationsCollectionEntity implements DriverProductConfigurationsCollectionDto {
  @ApiProperty({ type: DriverProductConfigurationsEntity, isArray: true })
  public items: DriverProductConfigurationsDto[];
}
