import { PictureUrlDto } from './picture-url-dto.interface';

export interface PhotosDto {
  driver_car_front_photo?: PictureUrlDto;
  driver_car_sight_photo?: PictureUrlDto;
  driver_car_right_sight_photo?: PictureUrlDto;
  vehicle_interior_back_photo?: PictureUrlDto;
  vehicle_interior_back?: PictureUrlDto;
  vehicle_interior_front_photo?: PictureUrlDto;
  vehicle_angled_front?: PictureUrlDto;
  vehicle_angled_back?: PictureUrlDto;
  driver_car_back_photo?: PictureUrlDto;
  driver_insurance_front_copy?: PictureUrlDto;
  driver_insurance_reverse_copy?: PictureUrlDto;
  driver_vehicle_registration_front_copy?: PictureUrlDto;
  driver_vehicle_registration_reverse_copy?: PictureUrlDto;
  driver_taxi_license_front_copy?: PictureUrlDto;
  driver_taxi_license_reverse_copy?: PictureUrlDto;

  driver_avatar_photo?: PictureUrlDto;
  driver_license_front_copy?: PictureUrlDto;
  driver_license_reverse_copy?: PictureUrlDto;
  residence?: PictureUrlDto;

  id_card_front?: PictureUrlDto;
  id_card_reverse?: PictureUrlDto;

  criminal_record_certificate?: PictureUrlDto;
  combatant_status_certificate?: PictureUrlDto;

  vehicle_safety_belts?: PictureUrlDto;
  vehicle_trunk?: PictureUrlDto;
  vehicle_third_seats_row?: PictureUrlDto;
  vehicle_wheels?: PictureUrlDto;

  courier_avatar_photo?: PictureUrlDto;
}

export type PhotoType = keyof PhotosDto;
