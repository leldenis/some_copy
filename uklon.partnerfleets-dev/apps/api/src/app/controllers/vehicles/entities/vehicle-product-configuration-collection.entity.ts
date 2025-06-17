import { VehicleProductConfigurationEntity } from '@api/controllers/vehicles/entities/vehicle-product-configuration.entity';
import { VehicleProductConfigurationDto, VehicleProductConfigurationCollectionDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class VehicleProductConfigurationCollectionEntity implements VehicleProductConfigurationCollectionDto {
  @ApiProperty({ type: VehicleProductConfigurationEntity, isArray: true })
  public items: VehicleProductConfigurationDto[];
}
