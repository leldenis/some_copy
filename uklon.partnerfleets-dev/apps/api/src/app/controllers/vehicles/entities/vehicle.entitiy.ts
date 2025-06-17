import { SelectedByDriverEntity } from '@api/controllers/vehicles/entities/selected-by-driver.entity';
import { VehicleDto, SelectedByDriverDto } from '@data-access';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class VehicleEntity implements VehicleDto {
  @ApiProperty({ type: String })
  public id: string;

  @ApiProperty({ type: String })
  public license_plate: string;

  @ApiProperty({ type: String })
  public make: string;

  @ApiProperty({ type: String })
  public make_id: string;

  @ApiProperty({ type: String })
  public model: string;

  @ApiProperty({ type: String })
  public model_id: string;

  @ApiProperty({ type: Number })
  public production_year: number;

  @ApiProperty({ type: SelectedByDriverEntity })
  public selected_by_driver: SelectedByDriverDto;

  @ApiProperty({ type: String })
  public comfort_level: string;

  @ApiProperty({ type: String })
  public color: string;

  @ApiProperty({ type: Number })
  public added_to_fleet: number;

  @ApiPropertyOptional({ type: Number })
  public passenger_seats_count?: number;
}
