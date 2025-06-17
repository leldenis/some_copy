import { EmployeeWalletItemEntity } from '@api/controllers/finance/entities/employee-wallet-item.entity';
import { MoneyEntity } from '@api/controllers/finance/entities/money.entity';
import { MoneyDto, DriverWalletsDto, EmployeeWalletItemDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class DriverWalletsEntity implements DriverWalletsDto {
  @ApiProperty({ type: MoneyEntity })
  public total_drivers_balance: MoneyDto;

  @ApiProperty({ type: EmployeeWalletItemEntity, isArray: true })
  public items: EmployeeWalletItemDto[];
}
