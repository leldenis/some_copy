import {
  AnalyticsEventDto,
  FleetAnalyticsEventType,
  AnalyticsEventAppDto,
  CustomAnalyticsPropertiesDto,
} from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class AnalyticsEventEntity implements AnalyticsEventDto {
  @ApiProperty({ enum: FleetAnalyticsEventType, enumName: 'FleetAnalyticsEventType' })
  public event_type: FleetAnalyticsEventType;

  @ApiProperty({ type: String })
  public client_id: string;

  @ApiProperty({ type: String })
  public device_id: string;

  @ApiProperty({ type: String })
  public user_id: string;

  @ApiProperty({ type: String })
  public locale: string;

  @ApiProperty({ type: String })
  public client_type: string;

  @ApiProperty({ type: Object })
  public custom_properties: CustomAnalyticsPropertiesDto;

  @ApiProperty({ type: Object })
  public app: AnalyticsEventAppDto;

  @ApiProperty({ type: Number })
  public event_timestamp: number;
}
