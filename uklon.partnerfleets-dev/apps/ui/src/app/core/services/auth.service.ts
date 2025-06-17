import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { GrantType } from '@constant';
import {
  AuthConfirmationMethodDto,
  AuthenticationDto,
  IdentityDto,
  ResetPasswordDto,
  SendPhoneVerificationCodeDto,
} from '@data-access';
import { StorageService } from '@ui/core/services/storage.service';
import { environment } from '@ui-env/environment';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly storage = inject(StorageService);

  public login(credentials: AuthenticationDto): Observable<IdentityDto> {
    return this.http.post<IdentityDto>('api/auth', credentials);
  }

  public sendOTC(model: SendPhoneVerificationCodeDto): Observable<void> {
    return this.http.post<void>(`api/auth/send-otc`, { ...model, client_id: environment.clientId });
  }

  public refreshAuthToken(refreshToken: string, allowEmptyDevice = false): Observable<IdentityDto> {
    const refreshData: AuthenticationDto = {
      client_id: environment.clientId,
      client_secret: environment.clientSecret,
      device_id: allowEmptyDevice ? undefined : this.storage.getOrCreateDeviceId(),
      refresh_token: refreshToken,
      grant_type: GrantType.REFRESH_TOKEN,
    };

    return this.http.post<IdentityDto>('api/auth/refresh', refreshData);
  }

  public getAuthConfirmationMethod(user_contact: string): Observable<AuthConfirmationMethodDto> {
    return this.http.put<AuthConfirmationMethodDto>('api/auth/confirmation-method', {
      user_contact,
      device_id: this.storage.getOrCreateDeviceId(),
      client_id: environment.clientId,
    });
  }

  public resetPassword(model: ResetPasswordDto): Observable<void> {
    return this.http.put<void>(`api/auth/reset-password`, {
      ...model,
      user_agent: window.navigator.userAgent,
    });
  }
}
