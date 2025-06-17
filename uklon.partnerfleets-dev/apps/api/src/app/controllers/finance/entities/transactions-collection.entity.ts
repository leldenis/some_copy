import { TransactionEntity } from '@api/controllers/finance/entities/transaction.entity';
import { InfinityScrollCollectionDto, TransactionDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class TransactionsCollectionEntity implements InfinityScrollCollectionDto<TransactionDto> {
  @ApiProperty({ type: Boolean })
  public has_more_items: boolean;

  @ApiProperty({ type: TransactionEntity, isArray: true })
  public items: TransactionDto[];
}
