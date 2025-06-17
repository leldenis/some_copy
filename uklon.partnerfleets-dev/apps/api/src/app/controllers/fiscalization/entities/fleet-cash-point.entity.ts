import { FleetCashPointDto, FleetCashPointVehicleDto } from '@data-access';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FleetCashPointVehicleEntity implements FleetCashPointVehicleDto {
  @ApiProperty({ type: String })
  public id: string;
}

export class FleetCashPointEntity implements FleetCashPointDto {
  @ApiProperty({ type: String })
  public id: string;

  @ApiPropertyOptional({ type: String })
  public organization_name?: string;

  @ApiPropertyOptional({ type: String })
  public name?: string;

  @ApiProperty({ type: Number })
  public fiscal_number: number;

  @ApiPropertyOptional({ type: FleetCashPointVehicleEntity, isArray: true })
  public vehicles?: FleetCashPointVehicleDto[];
}
