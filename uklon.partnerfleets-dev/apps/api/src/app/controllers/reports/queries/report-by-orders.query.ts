import { ReportByOrdersQueryDto } from '@data-access';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReportByOrdersQuery implements ReportByOrdersQueryDto {
  @ApiProperty({ type: Number })
  public date_from: number;

  @ApiProperty({ type: Number })
  public date_to: number;

  @ApiPropertyOptional({ type: String })
  public driver_id?: string;

  @ApiPropertyOptional({ type: String })
  public vehicle_id?: string;

  @ApiProperty({ type: Number })
  public limit: number;

  @ApiProperty({ type: Number })
  public offset: number;
}
