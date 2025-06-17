import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import moment from 'moment';

import { NotificationDatePipe } from './notification-date.pipe';

export class TranslateServiceMock {
  public instant(key: string): string {
    return key === 'NotificationCenter.Today' ? 'Сьогодні' : 'Вчора';
  }
}

describe('NotificationDatePipe', () => {
  let pipe: NotificationDatePipe;
  const translateMock = new TranslateServiceMock();
  const cases = [
    { value: moment().startOf('day').valueOf(), expected: 'Сьогодні' },
    { value: moment().startOf('day').subtract(1, 'day').valueOf(), expected: 'Вчора' },
    { value: 1_711_950_864_000, expected: '01 квітня 2024' },
    { value: 1_709_015_122_000, expected: '27 лютого 2024' },
  ] as const;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        {
          provide: TranslateService,
          useClass: TranslateServiceMock,
        },
      ],
    });

    pipe = new NotificationDatePipe(translateMock as TranslateService);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe.each(cases)('It should transform valid time', ({ value, expected }) => {
    it(`should return ${expected}`, () => {
      const result = pipe.transform(value, 'uk');
      expect(result).toBe(expected);
    });
  });
});
