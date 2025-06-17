import { KeyDeadlineDto, KeyDeadlinePipe } from './key-deadline.pipe';

describe('KeyDeadlinePipe', () => {
  let pipe: KeyDeadlinePipe;
  const secondsInDay = 60 * 60 * 24;

  beforeEach(() => {
    pipe = new KeyDeadlinePipe();
  });

  it('create an instance', () => {
    pipe = new KeyDeadlinePipe();
    expect(pipe).toBeTruthy();
  });

  it('should return null is targetTime is not number', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const targetTime: any = '';
    expect(pipe.transform(targetTime)).toBe(null);
  });

  it('should return expired: false and expireSoon:true if less than or equal to 30 days left', () => {
    const currentTime = Math.floor(Date.now() / 1000);
    const days = 30;
    const targetTime = currentTime + days * secondsInDay;
    const testCase: KeyDeadlineDto = {
      expired: false,
      expireSoon: true,
    };
    expect(pipe.transform(targetTime)).toEqual(testCase);
  });

  it('should return expired:false and expireSoon:true if exactly 30 days left', () => {
    const currentTime = Math.floor(Date.now() / 1000);
    const days = 30;
    const targetTime = currentTime + days * secondsInDay;
    const testCase: KeyDeadlineDto = {
      expired: false,
      expireSoon: true,
    };
    expect(pipe.transform(targetTime)).toEqual(testCase);
  });

  it('should return expired:false and expireSoon:false if more than 30 days left', () => {
    const currentTime = Math.floor(Date.now() / 1000);
    const days = 31;
    const targetTime = currentTime + days * secondsInDay;
    const testCase: KeyDeadlineDto = {
      expired: false,
      expireSoon: false,
    };
    expect(pipe.transform(targetTime)).toEqual(testCase);
  });

  it('should return expired:true and expireSoon:false if time is expired one day ago', () => {
    const currentTime = Math.floor(Date.now() / 1000);
    const targetTime = currentTime - secondsInDay;
    const testCase: KeyDeadlineDto = {
      expired: true,
      expireSoon: false,
    };
    expect(pipe.transform(targetTime)).toEqual(testCase);
  });
});
