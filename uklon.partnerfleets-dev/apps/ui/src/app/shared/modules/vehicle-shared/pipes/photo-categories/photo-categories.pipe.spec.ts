import { VehiclePhotoGroupCategory, VehiclePhotosCategory } from '@constant';

import { PhotoCategoriesPipe } from './photo-categories.pipe';

describe('PhotoCategoriesPipe', () => {
  let pipe: PhotoCategoriesPipe;

  beforeEach(() => {
    pipe = new PhotoCategoriesPipe();
  });

  it('create an instance', () => {
    pipe = new PhotoCategoriesPipe();
    expect(pipe).toBeTruthy();
  });

  it('should return empty array if no photos', () => {
    const photos: VehiclePhotosCategory[] = [];
    const groups: VehiclePhotoGroupCategory[] = [VehiclePhotoGroupCategory.BODY];
    expect(pipe.transform(photos, groups)).toEqual([]);
  });

  it('should return empty array if no photos and groups', () => {
    const photos: VehiclePhotosCategory[] = [];
    const groups: VehiclePhotoGroupCategory[] = [];
    expect(pipe.transform(photos, groups)).toEqual([]);
  });

  it('should return the same array if no groups', () => {
    const photos: VehiclePhotosCategory[] = [VehiclePhotosCategory.VEHICLE_FRONT];
    const emptyCases: [null, undefined, []] = [null, undefined, []];

    emptyCases.forEach((item) => {
      expect(pipe.transform(photos, item)).toEqual(photos);
    });
  });

  it('should filter photos by group: BODY', () => {
    const photos: VehiclePhotosCategory[] = [
      VehiclePhotosCategory.VEHICLE_FRONT,
      VehiclePhotosCategory.VEHICLE_BACK,
      VehiclePhotosCategory.VEHICLE_INTERIOR_FRONT,
    ];
    const groups: VehiclePhotoGroupCategory[] = [VehiclePhotoGroupCategory.BODY];
    const expectedPhotos: VehiclePhotosCategory[] = [
      VehiclePhotosCategory.VEHICLE_FRONT,
      VehiclePhotosCategory.VEHICLE_BACK,
    ];
    expect(pipe.transform(photos, groups)).toEqual(expectedPhotos);
  });

  it('should filter photos by group: INTERIOR', () => {
    const photos: VehiclePhotosCategory[] = [
      VehiclePhotosCategory.VEHICLE_FRONT,
      VehiclePhotosCategory.VEHICLE_INTERIOR_FRONT,
      VehiclePhotosCategory.VEHICLE_INTERIOR_BACK,
    ];
    const groups: VehiclePhotoGroupCategory[] = [VehiclePhotoGroupCategory.INTERIOR];
    const expectedPhotos: VehiclePhotosCategory[] = [
      VehiclePhotosCategory.VEHICLE_INTERIOR_FRONT,
      VehiclePhotosCategory.VEHICLE_INTERIOR_BACK,
    ];
    expect(pipe.transform(photos, groups)).toEqual(expectedPhotos);
  });

  it('should filter photos by multiple groups', () => {
    const photos: VehiclePhotosCategory[] = [
      VehiclePhotosCategory.VEHICLE_FRONT,
      VehiclePhotosCategory.VEHICLE_INTERIOR_FRONT,
      VehiclePhotosCategory.VEHICLE_WHEELS,
      VehiclePhotosCategory.VEHICLE_TRUNK,
    ];
    const groups: VehiclePhotoGroupCategory[] = [VehiclePhotoGroupCategory.INTERIOR, VehiclePhotoGroupCategory.OTHER];
    const expectedPhotos: VehiclePhotosCategory[] = [
      VehiclePhotosCategory.VEHICLE_INTERIOR_FRONT,
      VehiclePhotosCategory.VEHICLE_WHEELS,
      VehiclePhotosCategory.VEHICLE_TRUNK,
    ];
    expect(pipe.transform(photos, groups)).toEqual(expectedPhotos);
  });

  it('should return an empty array if no photos match the provided groups', () => {
    const photos: VehiclePhotosCategory[] = [VehiclePhotosCategory.VEHICLE_LEFT, VehiclePhotosCategory.VEHICLE_RIGHT];
    const groups: VehiclePhotoGroupCategory[] = [VehiclePhotoGroupCategory.INTERIOR, VehiclePhotoGroupCategory.OTHER];
    expect(pipe.transform(photos, groups)).toEqual([]);
  });
});
