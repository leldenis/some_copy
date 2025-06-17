import { HistoryChangeInitiatorEntity } from '@api/common/entities';
import { HistoryChangeInitiatorDto, VehicleHistoryChangeItemDto, VehicleHistoryType } from '@data-access';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class VehicleHistoryChangeItemEntity implements VehicleHistoryChangeItemDto {
  @ApiProperty({ type: String })
  public id: string;

  @ApiProperty({ enum: VehicleHistoryType, enumName: 'VehicleHistoryType' })
  public change_type: VehicleHistoryType;

  @ApiProperty({ type: Number })
  public occurred_at: number;

  @ApiProperty({ type: HistoryChangeInitiatorEntity })
  public initiator: HistoryChangeInitiatorDto;

  @ApiProperty({ type: Object })
  public linked_entities: Record<string, string>;

  @ApiProperty({ type: Boolean })
  public has_additional_data: boolean;

  @ApiPropertyOptional({ type: Object })
  public details?: Record<string, unknown>;
}
