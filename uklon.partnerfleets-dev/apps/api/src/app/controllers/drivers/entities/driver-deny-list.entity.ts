import { DriverDenyListDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class DriverDenyListEntity implements DriverDenyListDto {
  @ApiProperty({ type: Number })
  public count: number;
}
