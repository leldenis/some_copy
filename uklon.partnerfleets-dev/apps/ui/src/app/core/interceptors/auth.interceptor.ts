import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpStatusCode,
} from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { IdentityDto } from '@data-access';
import { Store } from '@ngrx/store';
import { UserDto } from '@ui/core/models/user.dto';
import { AuthService } from '@ui/core/services/auth.service';
import { LoadingIndicatorService } from '@ui/core/services/loading-indicator.service';
import { SurveysService } from '@ui/core/services/surveys.service';
import { authActions } from '@ui/core/store/auth/auth.actions';
import { AuthState } from '@ui/core/store/auth/auth.reducer';
import * as authSelectors from '@ui/core/store/auth/auth.selectors';
import { BehaviorSubject, finalize, Observable, retry, Subject, throwError, timer } from 'rxjs';
import { catchError, filter, first, mergeMap, switchMap, takeUntil, tap } from 'rxjs/operators';

const AUTH_URL = 'api/auth';

@Injectable()
export class AuthInterceptor implements HttpInterceptor, OnDestroy {
  private readonly minDelay = 1000;
  private readonly maxDelay = 60_000;
  private readonly maxRetries = 3;

  private readonly refreshTokenSubject = new BehaviorSubject<string>(null);
  private readonly destroyed$ = new Subject<void>();

  private refreshTokenInProgress = false;
  private user: UserDto;

  constructor(
    private readonly authService: AuthService,
    private readonly loaderService: LoadingIndicatorService,
    private readonly authStore: Store<AuthState>,
    private readonly surveyService: SurveysService,
  ) {
    this.authStore
      .select(authSelectors.getRefreshToken)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((token) => this.refreshTokenSubject.next(token));

    this.authStore
      .select(authSelectors.getUser)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((user) => {
        this.user = user;
      });
  }

  public ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  public intercept<T>(req: HttpRequest<T>, next: HttpHandler): Observable<HttpEvent<T>> {
    return next.handle(this.addAuthenticationToken(req, this.user?.accessToken)).pipe(
      catchError((error) => {
        if (this.isAuthRequest(req.url)) {
          return throwError(() => error);
        }

        if (error.status !== HttpStatusCode.Unauthorized) {
          return throwError(() => error);
        }

        if (this.refreshTokenInProgress) {
          return this.getDelayedByRefreshTokenRequest(req, next);
        }

        this.refreshTokenInProgress = true;
        this.refreshTokenSubject.next(null);

        this.loaderService.show();
        return this.authService.refreshAuthToken(this.user?.refreshToken).pipe(
          retry({
            count: this.maxRetries,
            delay: (err: HttpErrorResponse, retryCount: number) => {
              if (err.status >= HttpStatusCode.InternalServerError) {
                return timer(Math.min(this.maxDelay, this.minDelay * retryCount));
              }
              return throwError(() => err);
            },
          }),
          switchMap((identity: IdentityDto) => {
            this.authStore.dispatch(authActions.refreshToken(identity));
            this.refreshTokenInProgress = false;
            this.refreshTokenSubject.next(identity.access_token);
            return next.handle(this.addAuthenticationToken(req, identity.access_token));
          }),
          catchError((err) => throwError(() => err)),
          tap(() => this.surveyService.getNPS()),
          finalize(() => this.loaderService.hide()),
        );
      }),
    );
  }

  private getDelayedByRefreshTokenRequest<T>(req: HttpRequest<T>, next: HttpHandler): Observable<HttpEvent<T>> {
    return this.refreshTokenSubject.pipe(
      filter((accessToken) => accessToken != null),
      first(),
      mergeMap((accessToken: string) => next.handle(this.addAuthenticationToken(req, accessToken))),
    );
  }

  private addAuthenticationToken<T>(req: HttpRequest<T>, accessToken: string): HttpRequest<T> {
    if (this.isAuthRequest(req.url) || !accessToken || req.headers.get('skipIntercept')) {
      return req;
    }

    return req.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` },
    });
  }

  private isAuthRequest(url: string): boolean {
    return url.includes(AUTH_URL);
  }
}
