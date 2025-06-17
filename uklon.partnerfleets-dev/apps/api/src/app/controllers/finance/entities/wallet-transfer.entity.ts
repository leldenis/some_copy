import { WalletTransferItemEntity } from '@api/controllers/finance/entities/wallet-transfer-item.entity';
import { WalletTransferDto, WalletTransferItemDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class WalletTransferEntity implements WalletTransferDto {
  @ApiProperty({ type: WalletTransferItemEntity, isArray: true })
  public items: WalletTransferItemDto[];
}
