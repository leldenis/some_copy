import { DictionaryCollectionDto, DictionaryDto } from '@data-access';
import { Injectable } from '@nestjs/common';
import { Observable, of } from 'rxjs';

import { Currency } from '@uklon/types';

const mockData: DictionaryCollectionDto<DictionaryDto> = {
  items: [
    {
      id: 1,
      code: 'Kyiv',
      currency: Currency.UAH,
    },
    {
      id: 2,
      code: 'Lviv',
      currency: Currency.UAH,
    },
    {
      id: 3,
      code: 'Sumy',
      currency: Currency.UAH,
    },
  ],
};

@Injectable()
export class DictionariesMockService {
  public getRegions(): Observable<DictionaryCollectionDto<DictionaryDto>> {
    return of(mockData);
  }
}
