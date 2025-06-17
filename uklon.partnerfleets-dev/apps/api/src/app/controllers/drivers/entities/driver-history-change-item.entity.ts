import { HistoryChangeInitiatorEntity } from '@api/common/entities';
import {
  DriverHistoryChange,
  DriverHistoryChangeItemDto,
  DriverHistoryChangeItemDetailsDto,
  HistoryChangeInitiatorDto,
} from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class DriverHistoryChangeItemEntity implements DriverHistoryChangeItemDto {
  @ApiProperty({ type: String })
  public id: string;

  @ApiProperty({ enum: DriverHistoryChange, enumName: 'DriverHistoryChange' })
  public change_type: DriverHistoryChange;

  @ApiProperty({ type: Number })
  public occurred_at: number;

  @ApiProperty({ type: HistoryChangeInitiatorEntity })
  public initiator: HistoryChangeInitiatorDto;

  @ApiProperty({ type: Object })
  public linked_entities: Record<string, string>;

  @ApiProperty({ type: Object })
  public details: DriverHistoryChangeItemDetailsDto;

  @ApiProperty({ type: Boolean })
  public has_additional_data: boolean;
}
