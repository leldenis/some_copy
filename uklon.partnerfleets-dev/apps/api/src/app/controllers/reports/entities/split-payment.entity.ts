import { MoneyEntity } from '@api/controllers/finance/entities/money.entity';
import { FleetMerchant, MoneyDto, SplitPaymentDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class SplitPaymentEntity implements SplitPaymentDto {
  @ApiProperty({ type: String })
  public split_payment_id: string;

  @ApiProperty({ enum: FleetMerchant, enumName: 'FleetMerchant' })
  public payment_provider: FleetMerchant;

  @ApiProperty({ type: String })
  public merchant_id: string;

  @ApiProperty({ type: MoneyEntity })
  public total: MoneyDto;

  @ApiProperty({ type: MoneyEntity })
  public fee: MoneyDto;
}
