import { GatewayFleetCashPointDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class GatewayFleetCashPointEntity implements GatewayFleetCashPointDto {
  @ApiProperty({ type: String })
  public org_name: string;

  @ApiProperty({ type: String })
  public name: string;

  @ApiProperty({ type: Number })
  public fiscal_number: number;
}
