import { SelectedByDriverEntity } from '@api/controllers/vehicles/entities/selected-by-driver.entity';
import { VehicleBlockListStatusEntity } from '@api/controllers/vehicles/entities/vehicle-block-list-status-entity';
import { VehicleBrandingPeriodEntity } from '@api/controllers/vehicles/entities/vehicle-branding-period.entity';
import { BodyType, FleetVehicleComfortLevel } from '@constant';
import { BlockedListStatusDto, SelectedByDriverDto, VehicleBrandingPeriodDto, VehicleDetailsDto } from '@data-access';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class VehicleDetailsEntity implements VehicleDetailsDto {
  @ApiPropertyOptional({ type: String })
  public id?: string;

  @ApiPropertyOptional({ type: String })
  public vin_code?: string;

  @ApiPropertyOptional({ type: String })
  public color?: string;

  @ApiPropertyOptional({ enum: BodyType, enumName: 'BodyType' })
  public body_type?: BodyType;

  @ApiPropertyOptional({ type: String })
  public license_plate?: string;

  @ApiPropertyOptional({ type: String })
  public make?: string;

  @ApiPropertyOptional({ type: String })
  public make_id?: string;

  @ApiPropertyOptional({ type: String })
  public model?: string;

  @ApiPropertyOptional({ type: String })
  public model_id?: string;

  @ApiPropertyOptional({ type: Number })
  public production_year?: number;

  @ApiPropertyOptional({ type: Number })
  public added_to_fleet?: number;

  @ApiPropertyOptional({ type: String, isArray: true })
  public options?: string[];

  @ApiPropertyOptional({ enum: FleetVehicleComfortLevel, enumName: 'FleetVehicleComfortLevel' })
  public comfort_level?: FleetVehicleComfortLevel;

  @ApiPropertyOptional({ type: SelectedByDriverEntity })
  public selected_by_driver?: SelectedByDriverDto;

  @ApiPropertyOptional({ type: Number })
  public passenger_seats_count?: number;

  @ApiProperty({ type: VehicleBlockListStatusEntity })
  public status: BlockedListStatusDto;

  @ApiPropertyOptional({ type: VehicleBrandingPeriodEntity })
  public branding_period?: VehicleBrandingPeriodDto;
}
