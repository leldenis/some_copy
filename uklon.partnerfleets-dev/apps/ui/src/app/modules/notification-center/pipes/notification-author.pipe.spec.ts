import { TestBed } from '@angular/core/testing';
import { NotificationTypeValue } from '@data-access';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { NotificationAuthorPipe } from './notification-author.pipe';

class TranslateServiceMock {
  public instant(key: string): string {
    switch (key) {
      case 'DriverHistory.Roles.UklonManager':
        return 'Менеджер Уклон';
      default:
        return '';
    }
  }
}

describe('NotificationAuthorPipe', () => {
  let pipe: NotificationAuthorPipe;
  const translateMock = new TranslateServiceMock();
  const cases = [
    {
      type: NotificationTypeValue.B2B_SPLIT_ADJUSTMENT_CHANGED,
      expected: 'Менеджер Уклон',
    },
    {
      type: NotificationTypeValue.B2B_SPLIT_DISTRIBUTION_CHANGED,
      expected: 'Менеджер Уклон',
    },
    {
      type: NotificationTypeValue.B2B_SPLIT_ADJUSTMENT_CANCELED,
      expected: 'Менеджер Уклон',
    },
  ];
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

    pipe = new NotificationAuthorPipe(translateMock as TranslateService);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe.each(cases)('should transform return translated value', ({ type, expected }) => {
    it(`should return ${expected}`, () => {
      const value = pipe.transform(type);
      expect(value).toBe(expected);
    });
  });
});
