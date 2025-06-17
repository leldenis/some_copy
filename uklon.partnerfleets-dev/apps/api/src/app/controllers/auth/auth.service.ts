import { HttpControllerService } from '@api/common/http/http-controller.service';
import { PartnersService } from '@api/datasource';
import { IdentityService } from '@api/datasource/identity.service';
import {
  IdentityDto,
  AuthenticationDto,
  SendPhoneVerificationCodeDto,
  AuthConfirmationDto,
  AuthConfirmationMethodDto,
  AuthMethod,
  AccountDto,
} from '@data-access';
import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Observable, of, switchMap, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

const BAD_REQUEST_CODE = 'ERR_BAD_REQUEST';

@Injectable()
export class AuthService extends HttpControllerService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly identityService: IdentityService,
    private readonly partnersService: PartnersService,
  ) {
    super();
  }

  public auth(body: AuthenticationDto): Observable<IdentityDto> {
    return this.identityService.post<IdentityDto>('api/v2/auth', body).pipe(
      switchMap((identity) => {
        const token = identity?.access_token;

        if (!token) {
          return throwError(() => new UnauthorizedException('Token not found'));
        }

        return this.partnersService
          .get<AccountDto>('api/v1/fleets/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .pipe(
            map((account) => {
              if (!account?.fleets?.length) {
                throw new BadRequestException('No fleets assigned');
              }

              return identity;
            }),
            catchError((error) => {
              if (error?.status === 404) {
                return throwError(() => new BadRequestException('Account not found'));
              }
              return throwError(() => error);
            }),
          );
      }),
      catchError((error) => {
        return throwError(() => (error?.code === BAD_REQUEST_CODE ? new BadRequestException() : error));
      }),
    );
  }

  public authRefresh(body: AuthenticationDto): Observable<IdentityDto> {
    return this.identityService.post<IdentityDto>('api/v2/auth', body).pipe(
      catchError((error) => {
        return throwError(() => (error?.code === BAD_REQUEST_CODE ? new BadRequestException() : error));
      }),
    );
  }

  public sendOTC(body: SendPhoneVerificationCodeDto): Observable<void> {
    return this.identityService.post<void>(`api/v1/confirmation/phone/send-code`, body).pipe(
      catchError((error) => {
        this.logger.error(`Error sending OTC to ${body?.device_id}: ${error?.message}`);
        return throwError(() => error);
      }),
    );
  }

  public getConfirmationMethod(body: AuthConfirmationDto): Observable<AuthConfirmationMethodDto> {
    return this.identityService
      .put(`/api/v1/confirmation/phone/confirmation-method`, body)
      .pipe(catchError(() => of({ method: AuthMethod.PASSWORD })));
  }

  public resetPassword(body: SendPhoneVerificationCodeDto): Observable<void> {
    return this.identityService.put('api/v1/accounts/reset', body);
  }
}
