import { HistoryChangeInitiatorDto, HistoryInitiatorType } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class HistoryChangeInitiatorEntity implements HistoryChangeInitiatorDto {
  @ApiProperty({ type: String })
  public account_id: string;

  @ApiProperty({ type: String })
  public display_name: string;

  @ApiProperty({ enum: HistoryInitiatorType, enumName: 'HistoryInitiatorType' })
  public type: HistoryInitiatorType;
}
