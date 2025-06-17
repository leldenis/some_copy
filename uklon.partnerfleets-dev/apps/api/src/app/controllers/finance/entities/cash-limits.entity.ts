import { MoneyEntity } from '@api/controllers/finance/entities/money.entity';
import { CashLimitsSettingsDto, CashLimitsSettingsPeriod, CashLimitsSettingsUpdateDto, MoneyDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class CashLimitsSettingsEntity implements CashLimitsSettingsDto {
  @ApiProperty({ enum: CashLimitsSettingsPeriod, enumName: 'CashLimitsSettingsPeriod' })
  public period: CashLimitsSettingsPeriod;

  @ApiProperty({ type: MoneyEntity })
  public limit: MoneyDto;

  @ApiProperty({ type: Boolean })
  public enabled: boolean;
}

export class CashLimitsSettingsUpdateEntity implements CashLimitsSettingsUpdateDto {
  @ApiProperty({ enum: CashLimitsSettingsPeriod, enumName: 'CashLimitsSettingsPeriod' })
  public period: CashLimitsSettingsPeriod;

  @ApiProperty({ type: Number })
  public amount: number;

  @ApiProperty({ type: Boolean })
  public enabled: boolean;
}
