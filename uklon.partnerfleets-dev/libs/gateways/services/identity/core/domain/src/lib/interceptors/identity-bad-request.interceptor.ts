import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { catchError, Observable, throwError } from 'rxjs';

import { IdentityServiceErrorDto, IdentityServiceExceptionDto } from '@uklon/gateways/services/identity/core/types';
import { ServiceRegistryDto } from '@uklon/gateways/shared/types';

import { IdentityBadRequestException } from '../exceptions';

const UNKNOWN_ERROR: IdentityServiceErrorDto = {
  code: 0,
  sub_code: 0,
  sub_code_description: '',
  message: 'Unknown error',
};

@Injectable()
export class IdentityBadRequestInterceptor implements NestInterceptor {
  private readonly serviceUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.serviceUrl = this.configService.get<ServiceRegistryDto>('serviceRegistry').identityService;
  }

  public intercept(_context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(catchError((error: unknown) => this.createOrPropagate(error)));
  }

  private createOrPropagate(error: unknown): Observable<never> {
    if (this.canIntercept(error)) {
      return throwError(() => {
        const { response } = error as AxiosError<IdentityServiceExceptionDto>;
        return new IdentityBadRequestException(response?.data?.error || UNKNOWN_ERROR);
      });
    }
    return throwError(() => error);
  }

  private canIntercept(error: unknown): boolean {
    if (!(error instanceof AxiosError)) {
      return false;
    }

    const isIdentityServiceError = error.config.url.match(this.serviceUrl);
    if (!isIdentityServiceError) {
      return false;
    }

    return error?.response?.status === HttpStatus.BAD_REQUEST;
  }
}
