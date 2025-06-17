import { MoneyDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

import { Currency } from '@uklon/types';

export class MoneyEntity implements MoneyDto {
  @ApiProperty({ type: Number })
  public amount: number;

  @ApiProperty({ enum: Currency, enumName: 'Currency' })
  public currency: Currency;
}
