import { VehicleEntity } from '@api/controllers/vehicles/entities/vehicle.entitiy';
import { PaginationCollectionDto, VehicleDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class VehicleCollectionEntity implements PaginationCollectionDto<VehicleDto> {
  @ApiProperty({ type: Number })
  public total_count: number;

  @ApiProperty({ type: VehicleEntity, isArray: true })
  public items: VehicleDto[];
}
