import { VehicleDetailsPhotoControlEntity } from '@api/controllers/tickets/entities/vehicle-ticket.entity';
import { LiveMapVehicleDto, PhotosDto, PictureUrlDto, VehicleDetailsPhotoControlDto } from '@data-access';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LiveMapCarPhotoEntity implements PhotosDto {
  @ApiProperty({ type: String })
  public driver_car_front_photo: PictureUrlDto;

  @ApiProperty({ type: String })
  public vehicle_angled_front: PictureUrlDto;
}

export class LiveMapVehicleEntity implements LiveMapVehicleDto {
  @ApiProperty({ type: String })
  public id: string;

  @ApiProperty({ type: String })
  public license_plate: string;

  @ApiProperty({ type: String })
  public make: string;

  @ApiProperty({ type: String })
  public model: string;

  @ApiProperty({ type: String })
  public comfort_level: string;

  @ApiProperty({ type: LiveMapCarPhotoEntity })
  public photos: { driver_car_front_photo: PictureUrlDto; vehicle_angled_front: PictureUrlDto };

  @ApiPropertyOptional({ type: VehicleDetailsPhotoControlEntity })
  public photo_control?: VehicleDetailsPhotoControlDto;
}
