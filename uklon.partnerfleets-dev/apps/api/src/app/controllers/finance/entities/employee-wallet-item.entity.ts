import { WalletEntity } from '@api/controllers/finance/entities/wallet.entity';
import { EmployeeWalletItemDto, WalletDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class EmployeeWalletItemEntity implements EmployeeWalletItemDto {
  @ApiProperty({ type: String })
  public employee_id: string;

  @ApiProperty({ type: String })
  public first_name: string;

  @ApiProperty({ type: String })
  public last_name: string;

  @ApiProperty({ type: String })
  public phone: string;

  @ApiProperty({ type: Number })
  public signal: number;

  @ApiProperty({ type: WalletEntity })
  public wallet: WalletDto;
}
