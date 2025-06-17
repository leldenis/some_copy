import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatAnchor } from '@angular/material/button';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AnalyticsBase, CountryDto, FleetAnalyticsEventType } from '@data-access';
import { Store } from '@ngrx/store';
import { CorePaths } from '@ui/core/models/core-paths';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { AppTranslateService } from '@ui/core/services/app-translate.service';
import { accountActions } from '@ui/core/store/account/account.actions';
import { AccountState } from '@ui/core/store/account/account.reducer';
import { account, getAccountSupportWidget } from '@ui/core/store/account/account.selectors';
import { AppState } from '@ui/core/store/app.state';
import { getConfig } from '@ui/core/store/root/root.selectors';
import { TranslationModule } from '@ui/core/translation.module';
import { LanguageSelectComponent, SupportWidgetComponent } from '@ui/shared';
import { LetDirective } from '@ui/shared/directives/let.directive';
import { environment } from '@ui-env/environment';
import { SupportWidgetSection } from '@ui-env/environment.model';
import { Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

@Component({
  selector: 'upf-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    TranslationModule,
    AsyncPipe,
    RouterOutlet,
    RouterLink,
    LanguageSelectComponent,
    SupportWidgetComponent,
    LetDirective,
    MatAnchor,
    NgOptimizedImage,
  ],
})
export class LoginComponent {
  public readonly supportWidget$: Observable<SupportWidgetSection> = this.store.select(getAccountSupportWidget);
  public readonly redirectUrl$: Observable<SafeUrl> = this.store.select(getConfig).pipe(
    filter(Boolean),
    map((config) =>
      this.domSanitizer.bypassSecurityTrustUrl(config?.externalLinks?.uklon ?? environment?.externalLinks?.uklon),
    ),
  );
  public readonly loggedIn$ = this.store.select(account).pipe(
    filter((currentAccount) => !!currentAccount?.user_id),
    takeUntilDestroyed(),
    tap(() => {
      this.router.navigateByUrl(`/${CorePaths.WORKSPACE}/${CorePaths.GENERAL}`);
    }),
  );

  constructor(
    private readonly router: Router,
    private readonly store: Store<AccountState | AppState>,
    private readonly domSanitizer: DomSanitizer,
    private readonly appTranslateService: AppTranslateService,
    private readonly analytics: AnalyticsService,
  ) {
    this.analytics.reportEvent<AnalyticsBase>(FleetAnalyticsEventType.LOGIN_SCREEN);
  }

  public handleLocaleChange(code: string): void {
    this.appTranslateService.changeLanguage(code);
  }

  public handleSupportWidgetOpened(): void {
    this.analytics.reportEvent<AnalyticsBase>(FleetAnalyticsEventType.LOGIN_SUPPORT_WIDGET);
  }

  public handleSupportWidgetCountryChanged(value: CountryDto): void {
    this.store.dispatch(accountActions.selectedCountrySupportWidget(value));
  }

  public handleApplyBtnClick(): void {
    this.analytics.reportEvent<AnalyticsBase>(FleetAnalyticsEventType.LOGIN_APPLY_FOR_ACCOUNT);
  }
}
