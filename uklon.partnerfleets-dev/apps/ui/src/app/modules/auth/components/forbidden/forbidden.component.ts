import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AnalyticsBase, FleetAnalyticsEventType } from '@data-access';
import { Store } from '@ngrx/store';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { AccountState } from '@ui/core/store/account/account.reducer';
import { AppState } from '@ui/core/store/app.state';
import { getConfig } from '@ui/core/store/root/root.selectors';
import { TranslationModule } from '@ui/core/translation.module';
import { environment } from '@ui-env/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'upf-forbidden',
  templateUrl: './forbidden.component.html',
  styleUrls: ['./forbidden.component.scss'],
  standalone: true,
  imports: [AsyncPipe, TranslationModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForbiddenComponent {
  public redirectUrl$: Observable<SafeUrl>;

  constructor(
    private readonly store: Store<AccountState | AppState>,
    private readonly domSanitizer: DomSanitizer,
    private readonly analytics: AnalyticsService,
  ) {
    this.redirectUrl$ = this.store
      .select(getConfig)
      .pipe(
        map((config) =>
          this.domSanitizer.bypassSecurityTrustUrl(config?.externalLinks?.uklon ?? environment?.externalLinks?.uklon),
        ),
      );

    this.analytics.reportEvent<AnalyticsBase>(FleetAnalyticsEventType.LOGIN_ACCESS_DENIED_SCREEN);
  }
}
