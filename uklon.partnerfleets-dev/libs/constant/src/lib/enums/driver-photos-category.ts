export enum DriverPhotoCategory {
  DRIVER_AVATAR = 'driver_avatar_photo',
  LICENSE_FRONT = 'driver_license_front_copy',
  LICENSE_BACK = 'driver_license_reverse_copy',
  RESIDENCE_PERMIT = 'residence',
  ID_CARD_FRONT = 'id_card_front',
  ID_CARD_BACK = 'id_card_reverse',
  CRIMINAL_RECORD_CERTIFICATE = 'criminal_record_certificate',
  COMBAT_STATUS_CERTIFICATE = 'combatant_status_certificate',
}

export enum DriverPhotoGroupCategory {
  AVATAR,
  LICENSE,
  RESIDENCE,
  COMBAT_CERTIFICATE,
  CRIMINAL_RECORD_CERTIFICATE,
  ID_CARD,
}

export const DRIVER_PHOTO_GROUP_BY_CATEGORY = new Map<DriverPhotoGroupCategory, DriverPhotoCategory[]>([
  [DriverPhotoGroupCategory.AVATAR, [DriverPhotoCategory.DRIVER_AVATAR]],
  [DriverPhotoGroupCategory.LICENSE, [DriverPhotoCategory.LICENSE_FRONT, DriverPhotoCategory.LICENSE_BACK]],
  [DriverPhotoGroupCategory.RESIDENCE, [DriverPhotoCategory.RESIDENCE_PERMIT]],
  [DriverPhotoGroupCategory.COMBAT_CERTIFICATE, [DriverPhotoCategory.COMBAT_STATUS_CERTIFICATE]],
  [DriverPhotoGroupCategory.CRIMINAL_RECORD_CERTIFICATE, [DriverPhotoCategory.CRIMINAL_RECORD_CERTIFICATE]],
  [DriverPhotoGroupCategory.ID_CARD, [DriverPhotoCategory.ID_CARD_FRONT, DriverPhotoCategory.ID_CARD_BACK]],
]);
