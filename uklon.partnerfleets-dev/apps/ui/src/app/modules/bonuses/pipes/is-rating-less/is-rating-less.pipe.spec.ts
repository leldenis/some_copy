import { IsRatingLessPipe } from './is-rating-less.pipe';

describe('IsRatingLessPipe', () => {
  let pipe: IsRatingLessPipe;

  beforeEach(() => {
    pipe = new IsRatingLessPipe();
  });

  it('create an instance', () => {
    pipe = new IsRatingLessPipe();
    expect(pipe).toBeTruthy();
  });

  describe('should return true if rating is less than the specified range', () => {
    const testCases = [
      { rating: 400, expected: true, specRating: { range: [4.8, 5] } },
      { rating: 370, expected: false, specRating: { range: [2.5, 4] } },
      { rating: 0, expected: true, specRating: { range: [1.2, 4.5] } },
      { rating: 498, expected: false, specRating: { range: [1.2, 4] } },
    ];

    describe.each(testCases)('when rating is "$rating"', ({ rating, expected, specRating }) => {
      it(`should return "${expected}"`, () => {
        const result = pipe.transform(rating, specRating);
        expect(result).toBe(expected);
      });
    });
  });

  describe(`should return false if data isn't correct`, () => {
    const testCases = [
      { rating: null, specRating: { range: [4.8, 5] } },
      { rating: undefined, specRating: { range: [1.2, 4] } },
      { rating: 0, specRating: { range: [0, 4] } },
      { rating: -10, specRating: { range: [] } },
    ];

    describe.each(testCases)('when rating is "$rating"', ({ rating, specRating }) => {
      it(`should return false`, () => {
        const result = pipe.transform(rating, specRating);
        expect(result).toBe(false);
      });
    });
  });
});
