import { CardPanPipe } from './card-pan.pipe';

describe('CardPanPipe', () => {
  let pipe: CardPanPipe;

  beforeEach(() => {
    pipe = new CardPanPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('when value is truncated pan', () => {
    let pan: string;

    beforeEach(() => {
      pan = '53****1234';
    });

    it('should format pan', () => {
      const actual = pipe.transform(pan);
      const expected = '**** **** **** 1234';
      expect(actual).toBe(expected);
    });

    describe('when `addStartPan` is `true`', () => {
      beforeEach(() => {
        pan = '53****1234';
      });

      it('should format pan', () => {
        const actual = pipe.transform(pan, true);
        const expected = '53** **** **** 1234';
        expect(actual).toBe(expected);
      });
    });
  });
});
