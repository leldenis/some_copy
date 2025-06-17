import { TotalOrdersByParametersPipe } from './total-orders-by-parameters.pipe';

describe('TotalOrdersByParametersPipe', () => {
  let pipe: TotalOrdersByParametersPipe;

  beforeEach(() => {
    pipe = new TotalOrdersByParametersPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return 0 if input array is empty', () => {
    const result = pipe.transform([]);
    expect(result).toBe(0);
  });

  it('should return total orders', () => {
    const input = [{ range: [1, 2] }, { range: [2, 4] }, { range: [4, 10] }];
    const result = pipe.transform(input);
    expect(result).toBe(4);
  });
});
