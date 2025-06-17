import { Pipe, PipeTransform } from '@angular/core';
import { DRIVER_PHOTO_GROUP_BY_CATEGORY, VEHICLE_PHOTO_GROUP_BY_CATEGORY } from '@constant';

type GroupByCategory = 'vehicle' | 'driver';

@Pipe({
  name: 'photoCategories',
  standalone: true,
})
export class PhotoCategoriesPipe implements PipeTransform {
  public transform<T, K>(photos: T[], groups: K[], category: GroupByCategory = 'vehicle'): T[] {
    const categoryGroup = (
      category === 'vehicle' ? VEHICLE_PHOTO_GROUP_BY_CATEGORY : DRIVER_PHOTO_GROUP_BY_CATEGORY
    ) as Map<K, T[]>;

    if (!Array.isArray(photos) || photos.length === 0) {
      return [];
    }

    if (!Array.isArray(groups) || groups.length === 0) {
      return photos;
    }

    let result: T[] = [];

    groups.forEach((item) => {
      const categoryItems = categoryGroup.get(item);
      if (categoryItems) {
        result = [...result, ...categoryItems];
      }
    });

    return photos.filter((photo) => result.includes(photo));
  }
}
