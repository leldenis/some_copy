import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import {
  AnalyticsBase,
  AnalyticsPhoneCode,
  AuthMethod,
  CountryPhoneFormatDto,
  FleetAnalyticsEventType,
} from '@data-access';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { AuthService } from '@ui/core/services/auth.service';
import { ReferencesService } from '@ui/core/services/references.service';
import { StorageService } from '@ui/core/services/storage.service';
import { accountActions } from '@ui/core/store/account/account.actions';
import { AccountState } from '@ui/core/store/account/account.reducer';
import { getSelectedCountryPhoneNumber } from '@ui/core/store/account/account.selectors';
import { LoginFormGroupDto } from '@ui/modules/auth/models/auth-form.dto';
import { PhoneInputComponent } from '@ui/shared';
import { LoaderButtonComponent } from '@ui/shared/components/loader-button/loader-button.component';
import { LetDirective } from '@ui/shared/directives/let.directive';
import { BehaviorSubject, filter, finalize, map, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

@Component({
  selector: 'upf-login-phone',
  standalone: true,
  imports: [
    FormsModule,
    PhoneInputComponent,
    ReactiveFormsModule,
    TranslateModule,
    LetDirective,
    LoaderButtonComponent,
    MatCheckbox,
    AsyncPipe,
  ],
  templateUrl: './login-phone.component.html',
  styleUrl: './login-phone.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPhoneComponent {
  public readonly isLoading$ = new BehaviorSubject<boolean>(false);
  public readonly loginForm = new FormGroup<Omit<LoginFormGroupDto, 'password'>>({
    contact: new FormControl<string>(null, Validators.required),
    isRememberMe: new FormControl<boolean>(true),
  });
  public readonly selectedCountryPhoneNumber$: Observable<string> = this.store.select(getSelectedCountryPhoneNumber);
  public readonly formats$: Observable<CountryPhoneFormatDto[]> = this.referencesService
    .getCountriesPhoneFormats()
    .pipe(
      filter(Boolean),
      map(({ items }) => items),
    );

  constructor(
    private readonly referencesService: ReferencesService,
    private readonly authService: AuthService,
    private readonly store: Store<AccountState>,
    private readonly analytics: AnalyticsService,
    private readonly router: Router,
    private readonly storage: StorageService,
  ) {}

  public getAuthMethod(): void {
    if (this.isLoading$.value) return;

    this.authService
      .getAuthConfirmationMethod(this.loginForm.value.contact)
      .pipe(
        tap(() => {
          this.isLoading$.next(true);
          this.analytics.reportEvent<AnalyticsBase>(FleetAnalyticsEventType.LOGIN_CONTINUE);
        }),
        delay(500),
        finalize(() => this.isLoading$.next(false)),
      )
      .subscribe(({ method }) => {
        const { contact, isRememberMe } = this.loginForm.value;
        this.router.navigate(['auth', 'password'], { queryParams: { contact, isRememberMe, method } });
      });
  }

  public handleCountryChange({ phone_prefix, country_code }: CountryPhoneFormatDto): void {
    this.analytics.reportEvent<AnalyticsPhoneCode>(FleetAnalyticsEventType.PHONE_INPUT_CODE_CHANGED, {
      phone_code: phone_prefix,
    });

    this.store.dispatch(accountActions.selectedCountryPhoneNumber({ country: country_code }));
  }

  public handleRememberMeClick(): void {
    this.analytics.reportEvent<AnalyticsBase>(FleetAnalyticsEventType.LOGIN_REMEMBER_ME);
  }

  private handleAuthMethod(method: AuthMethod = AuthMethod.SMS): Observable<AuthMethod> {
    this.analytics.reportEvent<AnalyticsBase>(FleetAnalyticsEventType.LOGIN_CONTINUE);

    const payload = { device_id: this.storage.getOrCreateDeviceId(), user_contact: this.loginForm.value.contact };
    const request$ = method === AuthMethod.SMS ? this.authService.sendOTC(payload) : of(null);
    return request$.pipe(map(() => method));
  }
}
