import { GatewayOrderProductConditionDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class GatewayOrderProductConditionEntity implements GatewayOrderProductConditionDto {
  @ApiProperty({ type: String })
  public name: string;

  @ApiProperty({ type: String })
  public data: string;
}
