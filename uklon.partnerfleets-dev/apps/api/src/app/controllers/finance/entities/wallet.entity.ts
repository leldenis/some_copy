import { MoneyEntity } from '@api/controllers/finance/entities/money.entity';
import { FleetWithdrawalTypeDto, MoneyDto, WalletDto, WithdrawalType } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class WalletEntity implements WalletDto {
  @ApiProperty({ type: String })
  public id: string;

  @ApiProperty({ type: MoneyEntity })
  public balance: MoneyDto;
}

export class WithdrawalTypeEntity implements FleetWithdrawalTypeDto {
  @ApiProperty({ enum: WithdrawalType, enumName: 'WithdrawalType' })
  public withdrawal_type: WithdrawalType;
}
