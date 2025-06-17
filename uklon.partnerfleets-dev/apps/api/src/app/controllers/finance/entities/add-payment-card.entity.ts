import { AddPaymentCardDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class AddPaymentCardEntity implements AddPaymentCardDto {
  @ApiProperty({ type: String })
  public pan: string;

  @ApiProperty({ type: Number })
  public expiration_year: number;

  @ApiProperty({ type: Number })
  public expiration_month: number;

  @ApiProperty({ type: String })
  public verification_code: string;
}
