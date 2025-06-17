import { PhotosDto, PictureUrlDto } from '@data-access';

import { ModuleBase } from '../../_internal';

type DriverPicture = Pick<
  PhotosDto,
  'driver_license_front_copy' | 'driver_license_reverse_copy' | 'driver_avatar_photo' | 'residence'
>;

export type BuildProps = Partial<{
  avatar: Partial<PictureUrlDto>;
  licenseFront: Partial<PictureUrlDto>;
  licenseReverse: Partial<PictureUrlDto>;
  residence: Partial<PictureUrlDto>;
}>;

const placeholder =
  'data:image/png;base64,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';

export class DriverImagesModule extends ModuleBase<DriverPicture, BuildProps> {
  public buildDto(props?: BuildProps): DriverPicture {
    return {
      driver_license_front_copy: this.buildPicture(props?.licenseFront),
      driver_license_reverse_copy: this.buildPicture(props?.licenseReverse),
      driver_avatar_photo: this.buildPicture(props?.avatar),
      residence: this.buildPicture(props?.residence),
    };
  }

  private buildPicture(picture?: Partial<PictureUrlDto>): PictureUrlDto {
    return {
      url: placeholder,
      fallback_url: placeholder,
      uploaded_at: 1_667_286_956,
      ...picture,
    };
  }
}
