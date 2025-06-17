import { PhotosEntity } from '@api/common/entities/photos.entitiy';
import { LiveMapVehicleEntity } from '@api/controllers/geolocation/entities/drivers-locations.entity';
import { MapLocationEntity } from '@api/controllers/geolocation/entities/map-location.entity';
import {
  DriverFilter,
  EmployeeLocationStatus,
  LiveMapActiveOrderDto,
  LiveMapDataDto,
  LiveMapEmployeeDto,
  LiveMapLocationDto,
  LiveMapVehicleDto,
  PhotosDto,
} from '@data-access';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LiveMapActiveOrderEntity implements LiveMapActiveOrderDto {
  @ApiProperty({ type: String })
  public id: string;

  @ApiProperty({ type: String })
  public status: string;
}

export class LiveMapEmployeeEntity implements LiveMapEmployeeDto {
  @ApiProperty({ type: String })
  public id: string;

  @ApiProperty({ type: String })
  public phone: string;

  @ApiProperty({ type: String })
  public last_name: string;

  @ApiProperty({ type: String })
  public first_name: string;

  @ApiProperty({ type: Boolean })
  public is_device_online: boolean;

  @ApiProperty({ type: Boolean })
  public is_driver_in_idle: boolean;

  @ApiProperty({ enum: EmployeeLocationStatus, enumName: 'EmployeeLocationStatus' })
  public status: EmployeeLocationStatus;

  @ApiProperty({ type: LiveMapActiveOrderEntity, isArray: true })
  public active_orders: LiveMapActiveOrderDto[];

  @ApiProperty({ type: MapLocationEntity })
  public location: LiveMapLocationDto;

  @ApiProperty({ type: PhotosEntity })
  public photos: PhotosDto;

  @ApiPropertyOptional({ enum: DriverFilter, enumName: 'DriverFilter', isArray: true })
  public order_accepting_methods?: DriverFilter[];

  @ApiPropertyOptional({ type: LiveMapVehicleEntity })
  public vehicle?: LiveMapVehicleDto;
}

export class EmployeesLocationsEntity implements LiveMapDataDto {
  @ApiProperty({ type: LiveMapEmployeeEntity, isArray: true })
  public data: LiveMapEmployeeDto[];

  @ApiProperty({ type: Number })
  public actual_on: number;

  @ApiProperty({ type: Number })
  public cache_time_to_live: number;
}
