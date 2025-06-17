import { EmployeeWalletItemEntity } from '@api/controllers/finance/entities/employee-wallet-item.entity';
import { EmployeeWalletItemDto, EmployeeWalletsCollection } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class EmployeeWalletsEntity implements EmployeeWalletsCollection {
  @ApiProperty({ type: EmployeeWalletItemEntity, isArray: true })
  public items: EmployeeWalletItemDto[];

  @ApiProperty({ type: String })
  public next_cursor: string;

  @ApiProperty({ type: String })
  public previous_cursor: string;
}
