import { Body, Controller, Headers, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PasswordRecoveryDto } from '@uklon/fleets/shared/domains/user/data-access';
import { AccountResetService } from '@uklon/gateways/services/identity/account/reset-feature';

const LOCALE_ID_MAP = new Map<string, number>([
  ['RU', 1],
  ['UK', 2],
  ['EN', 3],
  ['KA', 4],
  ['NL', 5],
  ['TR', 6],
  ['SW', 7],
]);

@Controller()
export class PasswordRecoveryController {
  constructor(private readonly accountResetService: AccountResetService) {}

  @Post()
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Password recovery code sent.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  public sendConfirmationMessage(
    @Headers('user-agent') userAgent: string,
    @Body() body: PasswordRecoveryDto,
  ): Observable<void> {
    const locale = body.locale.toUpperCase();
    const localeId = LOCALE_ID_MAP.get(locale) || 2;
    return this.accountResetService
      .reset({
        user_contact: body.phoneNumber,
        device_id: body.deviceId,
        user_agent: userAgent,
        locale_id: localeId,
      })
      .pipe(map(() => null));
  }
}
