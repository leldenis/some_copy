import { AccountDto, FleetRole, FleetType, Locale } from '@data-access';
import { Injectable } from '@nestjs/common';
import { Observable, of } from 'rxjs';

const mockData: AccountDto = {
  user_id: '4214214214',
  phone: '380951234567',
  email: 'yevhen@uklon.com.ua',
  first_name: 'Yevhen',
  last_name: 'Haievyi',
  locale: Locale.RU,
  mfa_enabled: false,
  fleets: [
    {
      id: 'aaa85f64-5717-4562-b3fc-2c963f66afa6',
      region_id: 1,
      name: 'Феникс',
      role: FleetRole.MANAGER,
      email: 'Test1@gmail.com',
      fleet_type: FleetType.COMMERCIAL,
      tin_refused: false,
    },
    {
      id: '2',
      region_id: 2,
      name: 'Лесик',
      role: FleetRole.MANAGER,
      email: 'Test2@mail.com',
      fleet_type: FleetType.COMMERCIAL,
      tin_refused: false,
    },
    {
      id: '3',
      region_id: 3,
      name: 'Лесик',
      role: FleetRole.MANAGER,
      email: 'test3@mail.com',
      fleet_type: FleetType.COMMERCIAL,
      tin_refused: true,
    },
  ],
};

@Injectable()
export class AccountMockService {
  public getMe(): Observable<AccountDto> {
    return of(mockData);
  }
}
