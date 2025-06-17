import { RatingLessRequirementPipe } from './rating-less-requirement.pipe';

describe('RatingRequirementPipe', () => {
  let pipe: RatingLessRequirementPipe;

  beforeEach(() => {
    pipe = new RatingLessRequirementPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return true when rating is less than requirement', () => {
    const driverRating = 450;
    const ratingRequirement = 4.9;
    const result = pipe.transform(driverRating, ratingRequirement);
    expect(result).toBe(true);
  });

  it('should return true when rating is equal to requirement', () => {
    const driverRating = 453;
    const ratingRequirement = 4.53;
    const result = pipe.transform(driverRating, ratingRequirement);
    expect(result).toBe(false);
  });

  it('should return false when rating is greater than requirement', () => {
    const driverRating = 411;
    const ratingRequirement = 3.25;
    const result = pipe.transform(driverRating, ratingRequirement);
    expect(result).toBe(false);
  });
});
