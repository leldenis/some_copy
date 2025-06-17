import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, retry, throwError, timer } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { SentryClientService } from '@uklon/angular-sentry';

const OFFLINE_STATUS = 0;

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private readonly sentryService = inject(SentryClientService);

  public intercept<T>(request: HttpRequest<T>, next: HttpHandler): Observable<HttpEvent<T>> {
    return next.handle(request).pipe(
      catchError((error) => {
        const code = error.status;

        if (error instanceof HttpErrorResponse && code >= 500) {
          return this.handle5xxError(error, request);
        }

        if (error.status === OFFLINE_STATUS) {
          return next.handle(request).pipe(retry({ count: 2, delay: () => timer(2000) }));
        }

        return throwError(() => error);
      }),
    );
  }

  private handle5xxError<T>(error: HttpErrorResponse, request: HttpRequest<T>): Observable<never> {
    const errorStatus = error?.status ?? '5xx';

    this.sentryService.captureEvent({
      message: `HTTP ${errorStatus}`,
      level: 'warning',
      tags: {
        'http.error': errorStatus,
      },
      extra: {
        error,
        request,
      },
    });

    return throwError(() => error);
  }
}
