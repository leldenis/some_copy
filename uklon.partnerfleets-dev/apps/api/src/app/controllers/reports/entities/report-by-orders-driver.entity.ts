import { ReportByOrdersEmployeeDto } from '@data-access';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReportByOrdersDriverEntity implements ReportByOrdersEmployeeDto {
  @ApiProperty({ type: String })
  public id: string;

  @ApiPropertyOptional({ type: String })
  public first_name?: string;

  @ApiPropertyOptional({ type: String })
  public last_name?: string;

  @ApiPropertyOptional({ type: Number })
  public signal?: number;

  @ApiPropertyOptional({ type: String })
  public phone?: string;
}
