import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';

import {
  CodeVerificationDto,
  ConfirmationResetPasswordDto,
} from '@uklon/gateways/services/identity/confirmation/domain';

@Injectable()
export class ConfirmationResetPasswordService {
  constructor(private readonly httpService: HttpService) {}

  public resetPassword(data: ConfirmationResetPasswordDto): Observable<AxiosResponse<void, void>> {
    return this.httpService.post('reset-password', data);
  }

  public resetCodeVerification(data: CodeVerificationDto): Observable<AxiosResponse<void, void>> {
    return this.httpService.post('password-reset-code-verification', data);
  }
}
