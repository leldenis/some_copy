import { PaymentCardDto, WalletToCardTransferSettingsDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class PaymentCardEntity implements PaymentCardDto {
  @ApiProperty({ type: String })
  public pan_truncated: string;

  @ApiProperty({ type: String })
  public pan: string;

  @ApiProperty({ type: String })
  public card_id: string;
}

export class WalletToCardTransferSettingsEntity implements WalletToCardTransferSettingsDto {
  @ApiProperty({ type: Number })
  public min_amount: number;

  @ApiProperty({ type: Number })
  public max_amount: number;

  @ApiProperty({ type: Number })
  public max_count_per_day: number;

  @ApiProperty({ type: Number })
  public max_amount_per_day: number;
}
