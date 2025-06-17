import { FleetDto, FleetRole, FleetType } from '@data-access';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FleetEntity implements FleetDto {
  @ApiProperty({ type: String })
  public id: string;

  @ApiProperty({ type: String })
  public name: string;

  @ApiProperty({ type: Number })
  public region_id: number;

  @ApiProperty({ enum: FleetRole, enumName: 'FleetRole' })
  public role: FleetRole;

  @ApiProperty({ type: String })
  public email: string;

  @ApiProperty({ enum: FleetType, enumName: 'FleetType' })
  public fleet_type: FleetType;

  @ApiProperty({ type: Boolean })
  public tin_refused: boolean;

  @ApiPropertyOptional({ type: Boolean })
  public is_fiscalization_enabled?: boolean;

  @ApiPropertyOptional({ type: Boolean })
  public wallet_transfers_allowed?: boolean;
}
