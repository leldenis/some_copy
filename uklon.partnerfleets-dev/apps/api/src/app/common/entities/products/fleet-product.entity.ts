import { AvailableDriverProduct } from '@constant';
import { FleetProductDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class FleetProductEntity implements FleetProductDto {
  @ApiProperty({ type: String })
  public id: string;

  @ApiProperty({ enum: AvailableDriverProduct, enumName: 'AvailableDriverProduct' })
  public name: AvailableDriverProduct;

  @ApiProperty({ enum: AvailableDriverProduct, enumName: 'AvailableDriverProduct' })
  public code: AvailableDriverProduct;

  @ApiProperty({ type: String })
  public condition_code: string;

  @ApiProperty({ type: String })
  public condition_value: string;
}
