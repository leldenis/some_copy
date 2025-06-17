import { SelectedByDriverDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class SelectedByDriverEntity implements SelectedByDriverDto {
  @ApiProperty({ type: String })
  public driver_id: string;

  @ApiProperty({ type: String })
  public first_name: string;

  @ApiProperty({ type: String })
  public last_name: string;

  @ApiProperty({ type: String })
  public phone: string;
}
