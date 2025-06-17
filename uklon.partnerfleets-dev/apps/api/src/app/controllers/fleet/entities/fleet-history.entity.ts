import { HistoryChangeInitiatorEntity } from '@api/common/entities';
import { FleetHistoryChangeItemDto, FleetHistoryType, HistoryChangeInitiatorDto, LinkedEntity } from '@data-access';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FleetHistoryItemEntity implements FleetHistoryChangeItemDto {
  @ApiProperty({ type: String })
  public id: string;

  @ApiProperty({ enum: FleetHistoryType, enumName: 'FleetHistoryType' })
  public change_type: FleetHistoryType;

  @ApiProperty({ type: Number })
  public occurred_at: number;

  @ApiProperty({ type: HistoryChangeInitiatorEntity })
  public initiator: HistoryChangeInitiatorDto;

  @ApiPropertyOptional({ type: Object })
  public linked_entities?: Record<LinkedEntity, unknown>;

  @ApiPropertyOptional({ type: Boolean })
  public has_additional_data?: boolean;

  @ApiPropertyOptional({ type: Object })
  public details?: Record<string, unknown>;
}
