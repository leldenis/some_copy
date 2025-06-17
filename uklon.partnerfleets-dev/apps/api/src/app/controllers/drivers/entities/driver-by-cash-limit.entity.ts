import { DriverByCashLimitDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class DriverByCashLimitEntity implements DriverByCashLimitDto {
  @ApiProperty({ type: String })
  public id: string;

  @ApiProperty({ type: String })
  public first_name: string;

  @ApiProperty({ type: String })
  public last_name: string;
}
