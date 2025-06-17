import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';

import { AccountResetDto } from '@uklon/gateways/services/identity/account/domain';

@Injectable()
export class AccountResetService {
  constructor(private readonly httpService: HttpService) {}

  public reset(data: AccountResetDto): Observable<AxiosResponse<void, void>> {
    return this.httpService.put('reset', data);
  }
}
