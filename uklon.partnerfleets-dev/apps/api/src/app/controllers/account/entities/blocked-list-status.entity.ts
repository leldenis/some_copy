import { BlockedListStatusReason, BlockedListStatusValue } from '@constant';
import { BlockedListStatusDto } from '@data-access';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BlockedListStatusEntity implements BlockedListStatusDto {
  @ApiProperty({ enum: BlockedListStatusValue, enumName: 'BlockedListStatusValue' })
  public value: BlockedListStatusValue;

  @ApiPropertyOptional({ enum: BlockedListStatusReason, enumName: 'BlockedListStatusReason' })
  public reason?: BlockedListStatusReason;
}
