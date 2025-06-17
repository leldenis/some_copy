import { HistoryChangeInitiatorEntity } from '@api/common/entities';
import { CourierHistoryChange } from '@constant';
import {
  CourierHistoryChangeItemDto,
  CourierHistoryChangeItemDetailsDto,
  HistoryChangeInitiatorDto,
} from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class CourierHistoryChangeItemEntity implements CourierHistoryChangeItemDto {
  @ApiProperty({ type: String })
  public id: string;

  @ApiProperty({ enum: CourierHistoryChange, enumName: 'CourierHistoryChange' })
  public change_type: CourierHistoryChange;

  @ApiProperty({ type: Number })
  public occurred_at: number;

  @ApiProperty({ type: HistoryChangeInitiatorEntity })
  public initiator: HistoryChangeInitiatorDto;

  @ApiProperty({ type: Object })
  public linked_entities: Record<string, string>;

  @ApiProperty({ type: Object })
  public details: CourierHistoryChangeItemDetailsDto;

  @ApiProperty({ type: Boolean })
  public has_additional_data: boolean;
}
