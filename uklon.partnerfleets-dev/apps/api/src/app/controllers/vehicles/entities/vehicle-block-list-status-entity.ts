import { BlockedListStatusReason, BlockedListStatusValue } from '@constant';
import { BlockedListStatusDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class VehicleBlockListStatusEntity implements BlockedListStatusDto {
  @ApiProperty({ enum: BlockedListStatusValue, enumName: 'BlockedListStatusValue' })
  public value: BlockedListStatusValue;

  @ApiProperty({ enum: BlockedListStatusReason, enumName: 'BlockedListStatusReason' })
  public reason: BlockedListStatusReason;
}
