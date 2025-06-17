import { MoneyEntity } from '@api/controllers/finance/entities/money.entity';
import { MoneyDto, TransactionDto, TransactionErrorCode, TransactionStatus, TransactionStatusDto } from '@data-access';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TransactionEntity implements TransactionDto {
  @ApiProperty({ type: Number })
  public transaction_date: number;

  @ApiProperty({ type: String })
  public transaction_type: string;

  @ApiProperty({ type: MoneyEntity })
  public balance_delta: MoneyDto;

  @ApiProperty({ type: MoneyEntity })
  public balance: MoneyDto;
}

export class TransactionStatusEntity implements TransactionStatusDto {
  @ApiPropertyOptional({ enum: TransactionErrorCode, enumName: 'TransactionErrorCode' })
  public error_code?: TransactionErrorCode;

  @ApiProperty({ type: String })
  public transfer_id: string;

  @ApiProperty({ enum: TransactionStatus, enumName: 'TransactionStatus' })
  public status: TransactionStatus;
}
