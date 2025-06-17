import { CommissionRateEntity } from '@api/controllers/bonuses/entities';
import { FleetWithArchivedDriversBasicInfoEntity, NumberRangeEntity } from '@api/controllers/drivers/entities';
import { FleetVehicleBasicInfoEntity } from '@api/controllers/vehicles/entities';
import {
  CommissionProgramsDto,
  CommissionRateDto,
  DateRangeDto,
  FleetWithArchivedDriversBasicInfoDto,
  VehicleBasicInfoDto,
} from '@data-access';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CommissionProgramsEntity implements CommissionProgramsDto {
  @ApiProperty({ type: String })
  public program_id: string;

  @ApiProperty({ type: String })
  public participant_id: string;

  @ApiPropertyOptional({ type: String })
  public fleet_id?: string;

  @ApiPropertyOptional({ type: String })
  public vehicle_id?: string;

  @ApiPropertyOptional({ type: String })
  public driver_id?: string;

  @ApiPropertyOptional({ type: String })
  public wallet_id?: string;

  @ApiProperty({ type: String })
  public program_name: string;

  @ApiProperty({ type: Number })
  public min_rating: number;

  @ApiProperty({ type: Number })
  public current_completed_orders: number;

  @ApiProperty({ type: NumberRangeEntity })
  public period: DateRangeDto;

  @ApiProperty({ type: CommissionRateEntity, isArray: true })
  public commissions: CommissionRateDto[];

  @ApiPropertyOptional({ type: String, isArray: true })
  public order_acceptance_methods?: string[];

  @ApiPropertyOptional({ type: String, isArray: true })
  public product_types?: string[];

  @ApiPropertyOptional({ type: Number, isArray: true })
  public region_ids?: number[];

  @ApiProperty({ type: Boolean })
  public is_profit_budget: boolean;

  @ApiPropertyOptional({ type: Number })
  public profit_budget?: number;

  @ApiPropertyOptional({ type: Number })
  public used_profit_budget?: number;

  @ApiProperty({ type: Boolean })
  public always_add_progress_if_satisfied: boolean;

  @ApiProperty({ type: String })
  public participant_type: string;

  @ApiPropertyOptional({ type: FleetVehicleBasicInfoEntity })
  public vehicle?: VehicleBasicInfoDto;

  @ApiPropertyOptional({ type: FleetWithArchivedDriversBasicInfoEntity })
  public driver?: FleetWithArchivedDriversBasicInfoDto;
}
