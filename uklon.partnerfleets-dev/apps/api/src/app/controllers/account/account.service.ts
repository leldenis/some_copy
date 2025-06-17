import { HttpControllerService } from '@api/common/http/http-controller.service';
import { IdentityService, PartnersService } from '@api/datasource';
import { AccountDto } from '@data-access';
import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

import { Jwt } from '@uklon/nest-core';

@Injectable()
export class AccountService extends HttpControllerService {
  constructor(
    private readonly partnersService: PartnersService,
    private readonly identityService: IdentityService,
  ) {
    super();
  }

  public getMe(token: Jwt): Observable<AccountDto> {
    return this.partnersService.get<AccountDto>('api/v1/fleets/me', { token });
  }

  public sendVerificationCode(token: Jwt): Observable<void> {
    return this.partnersService.post<void>('api/v1/me/send-verification-code', null, { token });
  }

  public changePassword(token: Jwt, body: { password: string }): Observable<void> {
    return this.partnersService.put(`api/v1/me/fleets/password`, body, { token });
  }

  public updateLocale(token: Jwt, body: { locale: string }): Observable<void> {
    return this.partnersService.put(`api/v1/me/locale`, body, { token });
  }
}
