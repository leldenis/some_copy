import { FleetDriverBasicInfoDto } from '@data-access';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DriverBasicInfoEntity implements FleetDriverBasicInfoDto {
  @ApiProperty({ type: String })
  public driver_id: string;

  @ApiPropertyOptional({ type: String })
  public first_name?: string;

  @ApiPropertyOptional({ type: String })
  public last_name?: string;

  @ApiPropertyOptional({ type: String })
  public phone?: string;

  @ApiProperty({ type: Number })
  public rating: number;
}
