import { FleetUserNameByIdDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class FleetUserNameByIdEntity implements FleetUserNameByIdDto {
  @ApiProperty({ type: String })
  public user_id: string;

  @ApiProperty({ type: String })
  public first_name: string;

  @ApiProperty({ type: String })
  public last_name: string;

  @ApiProperty({ type: String })
  public phone: string;

  @ApiProperty({ type: String })
  public email: string;
}
