import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSidenav } from '@angular/material/sidenav';
import { AnalyticsBase, FleetAnalyticsEventType } from '@data-access';
import { Store } from '@ngrx/store';
import { UserDto } from '@ui/core/models/user.dto';
import { AccountService } from '@ui/core/services/account.service';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { AppTranslateService } from '@ui/core/services/app-translate.service';
import { LoadingIndicatorService } from '@ui/core/services/loading-indicator.service';
import { NotificationsService } from '@ui/core/services/notifications.service';
import { localeIdKey, StorageService, storageUserKey } from '@ui/core/services/storage.service';
import { WebsocketService } from '@ui/core/services/websocket.service';
import { accountActions } from '@ui/core/store/account/account.actions';
import { AccountState } from '@ui/core/store/account/account.reducer';
import { selectedFleetId } from '@ui/core/store/account/account.selectors';
import { AuthState } from '@ui/core/store/auth/auth.reducer';
import { getIsLoggedInUser } from '@ui/core/store/auth/auth.selectors';
import { interval, of, skip, switchMap } from 'rxjs';
import { filter, tap, withLatestFrom } from 'rxjs/operators';

const FIFTEEN_MINUTES = 900_000;

@Component({
  selector: 'upf-root',
  template: `
    @if (loading$ | async; as loading) {
      @if (loading?.show) {
        <upf-loading-indicator [size]="loadingIndicatorSize" [title]="loading?.title"></upf-loading-indicator>
      }
    }

    <mat-sidenav-container class="tw-h-full">
      <mat-sidenav position="end" class="tw-w-full sm:!tw-w-[468px]">
        @if (sidenav?.opened) {
          <upf-notification-center-sidenav (closeSidenav)="sidenav.close()"></upf-notification-center-sidenav>
        }
      </mat-sidenav>

      <router-outlet></router-outlet>
    </mat-sidenav-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild(MatSidenav)
  public readonly sidenav: MatSidenav;

  public readonly loadingIndicatorSize = 60;
  public readonly loading$ = this.loaderService.isLoading$;

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly analytics: AnalyticsService,
    private readonly appTranslateService: AppTranslateService,
    private readonly storageService: StorageService,
    private readonly loaderService: LoadingIndicatorService,
    private readonly store: Store<AuthState | AccountState>,
    private readonly cdr: ChangeDetectorRef,
    private readonly notificationsService: NotificationsService,
    private readonly websocketService: WebsocketService,
    private readonly accountService: AccountService,
  ) {}

  public get isLoggedIn(): boolean {
    return !!this.storageService.get<UserDto>(storageUserKey)?.accessToken;
  }

  public ngOnInit(): void {
    this.getCustomNotifications();
    this.listenBlockedStatus();
    this.listenLanguageChange();
    this.listenNotificationsSidebarEvents();

    const language = this.storageService.get(localeIdKey);
    if (this.appTranslateService.isLanguageValid(language)) {
      this.appTranslateService.changeLanguage(language);
    } else {
      this.appTranslateService.resetLanguage();
    }
  }

  public ngOnDestroy(): void {
    this.websocketService.disconnect();
  }

  private listenBlockedStatus(): void {
    interval(FIFTEEN_MINUTES)
      .pipe(
        withLatestFrom(this.store.select(getIsLoggedInUser)),
        filter(([_, isLoggedIn]) => isLoggedIn),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.store.dispatch(accountActions.getAccountInfo());
        this.cdr.markForCheck();
      });
  }

  private listenLanguageChange(): void {
    this.appTranslateService.onLangChange
      .pipe(
        skip(1),
        tap(({ lang }) => {
          this.storageService.set(localeIdKey, lang);
          this.analytics.reportEvent<AnalyticsBase>(FleetAnalyticsEventType.LANGUAGE_CHANGED);
        }),
        switchMap(({ lang }) => (this.isLoggedIn ? this.accountService.updateLocale(lang) : of(null))),
      )
      .subscribe();
  }

  private listenNotificationsSidebarEvents(): void {
    this.notificationsService.openSidenav$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.sidenav.open();
    });

    this.notificationsService.closeSidenav$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.sidenav.close();
    });
  }

  private getCustomNotifications(): void {
    this.store
      .select(selectedFleetId)
      .pipe(
        filter(Boolean),
        switchMap((id) => this.notificationsService.getTopUnreadCustomNotifications(id)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}
