import { CourierProduct } from '@constant';
import { FleetCourierProductDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class FleetCourierProductEntity implements FleetCourierProductDto {
  @ApiProperty({ type: String })
  public id: string;

  @ApiProperty({ enum: CourierProduct, enumName: 'CourierProduct' })
  public name: CourierProduct;

  @ApiProperty({ enum: CourierProduct, enumName: 'CourierProduct' })
  public code: CourierProduct;

  @ApiProperty({ type: String })
  public condition_code: string;

  @ApiProperty({ type: String })
  public condition_value: string;
}
