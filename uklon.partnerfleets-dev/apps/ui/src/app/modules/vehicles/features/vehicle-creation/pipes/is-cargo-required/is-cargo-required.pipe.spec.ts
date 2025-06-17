import { BodyType, LoadCapacity } from '@constant';
import { IsCargoRequiredPipe } from '@ui/modules/vehicles/features/vehicle-creation/pipes/is-cargo-required/is-cargo-required.pipe';

describe('IsCargoRequiredPipe', () => {
  let pipe: IsCargoRequiredPipe;

  beforeEach(() => {
    pipe = new IsCargoRequiredPipe();
  });

  it('should return true if bodyType is Cargo and loadCapacity is not Small, Medium or Large', () => {
    const bodyType = BodyType.CARGO;

    const result = pipe.transform(bodyType, null);
    expect(result).toBe(true);
  });

  it('should return false if bodyType is not Cargo', () => {
    const bodyType = BodyType.HATCHBACK;
    const loadCapacity = LoadCapacity.SMALL;

    const result = pipe.transform(bodyType, loadCapacity);
    expect(result).toBe(false);
  });

  it('should return false if bodyType is Cargo and has any loadCapacity', () => {
    const bodyType = BodyType.CARGO;
    const loadCapacity = LoadCapacity.SMALL;

    const result = pipe.transform(bodyType, loadCapacity);
    expect(result).toBe(false);
  });
});
