import { MoneyEntity } from '@api/controllers/finance/entities/money.entity';
import { MoneyDto, WalletTransferItemDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class WalletTransferItemEntity implements WalletTransferItemDto {
  @ApiProperty({ type: String })
  public employee_id: string;

  @ApiProperty({ type: MoneyEntity })
  public amount: MoneyDto;
}
