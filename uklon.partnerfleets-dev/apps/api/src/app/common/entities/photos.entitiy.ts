import { PictureUrlDtoEntity } from '@api/common/entities/picture-url.entitiy';
import { PhotosDto, PictureUrlDto } from '@data-access';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PhotosEntity implements PhotosDto {
  @ApiPropertyOptional({ type: PictureUrlDtoEntity })
  public driver_car_front_photo?: PictureUrlDto;

  @ApiPropertyOptional({ type: PictureUrlDtoEntity })
  public driver_car_sight_photo?: PictureUrlDto;

  @ApiPropertyOptional({ type: PictureUrlDtoEntity })
  public driver_car_right_sight_photo?: PictureUrlDto;

  @ApiPropertyOptional({ type: PictureUrlDtoEntity })
  public vehicle_interior_back_photo?: PictureUrlDto;

  @ApiPropertyOptional({ type: PictureUrlDtoEntity })
  public vehicle_interior_front_photo?: PictureUrlDto;

  @ApiPropertyOptional({ type: PictureUrlDtoEntity })
  public driver_car_back_photo?: PictureUrlDto;

  @ApiPropertyOptional({ type: PictureUrlDtoEntity })
  public driver_insurance_front_copy?: PictureUrlDto;

  @ApiPropertyOptional({ type: PictureUrlDtoEntity })
  public driver_insurance_reverse_copy?: PictureUrlDto;

  @ApiPropertyOptional({ type: PictureUrlDtoEntity })
  public driver_vehicle_registration_front_copy?: PictureUrlDto;

  @ApiPropertyOptional({ type: PictureUrlDtoEntity })
  public driver_vehicle_registration_reverse_copy?: PictureUrlDto;

  @ApiPropertyOptional({ type: PictureUrlDtoEntity })
  public driver_avatar_photo?: PictureUrlDto;

  @ApiPropertyOptional({ type: PictureUrlDtoEntity })
  public driver_license_front_copy?: PictureUrlDto;

  @ApiPropertyOptional({ type: PictureUrlDtoEntity })
  public driver_license_reverse_copy?: PictureUrlDto;

  @ApiPropertyOptional({ type: PictureUrlDtoEntity })
  public residence?: PictureUrlDto;

  @ApiPropertyOptional({ type: PictureUrlDtoEntity })
  public vehicle_angled_front?: PictureUrlDto;

  @ApiPropertyOptional({ type: PictureUrlDtoEntity })
  public vehicle_angled_back?: PictureUrlDto;
}
