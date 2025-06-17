import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { map, Observable } from 'rxjs';

import { PasswordRecoveryConfirmationDto } from '@uklon/fleets/shared/domains/user/data-access';
import { CodeVerificationDto } from '@uklon/gateways/services/identity/confirmation/domain';
import { ConfirmationResetPasswordService } from '@uklon/gateways/services/identity/confirmation/reset-password-feature';

@Controller()
export class PasswordRecoveryConfirmationController {
  constructor(private readonly confirmationResetPassword: ConfirmationResetPasswordService) {}

  @Post()
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Password successfully recovered.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  public confirmPasswordRecovery(@Body() confirmation: PasswordRecoveryConfirmationDto): Observable<void> {
    return this.confirmationResetPassword
      .resetPassword({
        device_id: confirmation.deviceId,
        new_password: confirmation.password,
        phone_number: confirmation.phoneNumber,
        verification_code: confirmation.code,
      })
      .pipe(map(() => null));
  }

  @Post('/password-reset-code-verification')
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  public resetCodeVerification(@Body() body: CodeVerificationDto): Observable<void> {
    return this.confirmationResetPassword.resetCodeVerification(body).pipe(map(() => null));
  }
}
