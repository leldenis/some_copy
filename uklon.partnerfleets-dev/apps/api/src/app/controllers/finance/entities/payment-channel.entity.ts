import { PaymentChannelDto } from '@data-access';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PaymentChannelEntity implements PaymentChannelDto {
  @ApiProperty({ type: String })
  public id: string;

  @ApiPropertyOptional({ type: String })
  public name?: string;
}
