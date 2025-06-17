export enum VehiclePhotosCategory {
  VEHICLE_FRONT = 'driver_car_front_photo',
  VEHICLE_BACK = 'driver_car_back_photo',
  VEHICLE_LEFT = 'driver_car_sight_photo',
  VEHICLE_RIGHT = 'driver_car_right_sight_photo',
  VEHICLE_INTERIOR_FRONT = 'vehicle_interior_front_photo',
  VEHICLE_INTERIOR_BACK = 'vehicle_interior_back_photo',
  DRIVER_REGISTRATION_FRONT = 'driver_vehicle_registration_front_copy',
  DRIVER_REGISTRATION_BACK = 'driver_vehicle_registration_reverse_copy',
  DRIVER_INSURANCE_FRONT = 'driver_insurance_front_copy',
  DRIVER_INSURANCE_BACK = 'driver_insurance_reverse_copy',
  DRIVER_TAXI_LICENSE_FRONT = 'driver_taxi_license_front_copy',
  DRIVER_TAXI_LICENSE_REVERSE = 'driver_taxi_license_reverse_copy',
  VEHICLE_SAFETY_BELTS = 'vehicle_safety_belts',
  VEHICLE_TRUNK = 'vehicle_trunk',
  VEHICLE_THIRD_SEATS_ROW = 'vehicle_third_seats_row',
  VEHICLE_WHEELS = 'vehicle_wheels',
  VEHICLE_ANGLED_FRONT = 'vehicle_angled_front',
  VEHICLE_ANGLED_BACK = 'vehicle_angled_back',
}

export enum VehiclePhotoGroupCategory {
  BODY = 1,
  INTERIOR,
  OTHER,
}

export const VEHICLE_PHOTO_GROUP_BY_CATEGORY = new Map([
  [
    VehiclePhotoGroupCategory.BODY,
    [
      VehiclePhotosCategory.VEHICLE_ANGLED_FRONT,
      VehiclePhotosCategory.VEHICLE_ANGLED_BACK,
      VehiclePhotosCategory.VEHICLE_FRONT,
      VehiclePhotosCategory.VEHICLE_BACK,
      VehiclePhotosCategory.VEHICLE_LEFT,
      VehiclePhotosCategory.VEHICLE_RIGHT,
    ],
  ],
  [
    VehiclePhotoGroupCategory.INTERIOR,
    [VehiclePhotosCategory.VEHICLE_INTERIOR_FRONT, VehiclePhotosCategory.VEHICLE_INTERIOR_BACK],
  ],
  [
    VehiclePhotoGroupCategory.OTHER,
    [
      VehiclePhotosCategory.VEHICLE_SAFETY_BELTS,
      VehiclePhotosCategory.VEHICLE_TRUNK,
      VehiclePhotosCategory.VEHICLE_THIRD_SEATS_ROW,
      VehiclePhotosCategory.VEHICLE_WHEELS,
    ],
  ],
]);
