import { EmployeeLocationStatus, LiveMapDataDto, LiveMapEmployeeDto, LiveMapLocationDto } from '@data-access';

import { ModuleBase } from '../../_internal';

export type BuildProps = Partial<{
  drivers: LiveMapEmployeeDto[];
  location?: LiveMapLocationDto;
}>;

export class GeolocationDriverModule extends ModuleBase<LiveMapDataDto, BuildProps> {
  public buildDto(props?: BuildProps): LiveMapDataDto {
    return {
      data: props?.drivers ?? [
        {
          active_orders: [],
          first_name: 'Aqadpilu404',
          id: '1fad966a-b2f4-427b-a0da-4b04be5f871f',
          last_name: 'Aqaafeyh404',
          phone: '380506326599',
          photos: {
            driver_avatar_photo: {
              fallback_url: '',
              url: 'https://target-partners-bonefish-staging.s3',
            },
          },
          status: EmployeeLocationStatus.Inactive,
          vehicle: {
            comfort_level: 'Standard',
            id: 'b5bbf6ca-dec6-4073-a1db-4b3bb4dd171c',
            license_plate: 'AQA0001',
            make: 'Aston Martin',
            model: 'Vulcan',
            photos: {
              driver_car_front_photo: {
                fallback_url: '',
                url: 'https://target-partners-bonefish-staging.s3',
              },
            },
          },
          location: {
            latitude: props?.location.latitude ?? 47.109_308,
            longitude: props?.location.longitude ?? 37.553_842,
          },
        } as LiveMapEmployeeDto,
      ],
      actual_on: Date.now() - 5,
      cache_time_to_live: 120,
    };
  }
}
