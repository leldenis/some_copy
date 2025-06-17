import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { AccountDto, CountryDto, RegionLocaleSettingsDto } from '@data-access';
import { AppTranslateService } from '@ui/core/services/app-translate.service';
import { ReferencesService } from '@ui/core/services/references.service';
import { DEFAULT_LANGUAGE_REGION_SETTINGS, languageToLocale } from '@ui/shared/consts';
import { map, Observable, of, switchMap } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AccountCountry } from '@uklon/types';

@Injectable()
export class AccountService {
  private readonly http = inject(HttpClient);
  private readonly referencesService = inject(ReferencesService);
  private readonly appTranslateService = inject(AppTranslateService);

  public readonly userCountry = signal<{ country: string }>(null);

  public getMe(): Observable<AccountDto> {
    return this.http
      .get<AccountDto>('api/me')
      .pipe(switchMap((account) => this.validateAndUpdateCurrentLocale(account)));
  }

  public sendVerificationCode(): Observable<void> {
    return this.http.put<void>('api/me/send-verification-code', null);
  }

  public getUserCountry(): Observable<CountryDto> {
    return this.http.get<{ country: string }>('api/me/user-country').pipe(
      map(({ country }) => {
        if ((Object.values(AccountCountry) as string[]).includes(country)) {
          return { country };
        }

        return { country: null };
      }),
      tap((country) => this.userCountry.set(country)),
    );
  }

  public changePassword(password: string): Observable<void> {
    return this.http.put<void>(`api/me/change-password`, { password });
  }

  public updateLocale(language: string): Observable<void> {
    const locale = languageToLocale(
      this.appTranslateService.isLanguageValid(language) ? language : this.appTranslateService.defaultLanguage,
    );

    return this.http.put<void>('api/me/update-locale', { locale });
  }

  public getAvailableLanguages(): Observable<RegionLocaleSettingsDto | null> {
    const getCountry$ = this.userCountry() ? of(this.userCountry()) : this.getUserCountry();

    return getCountry$.pipe(
      switchMap(({ country }) =>
        this.referencesService.getRegions().pipe(
          map(({ items }) => {
            if (!country) return DEFAULT_LANGUAGE_REGION_SETTINGS;

            return items.find(({ country_code }) => country_code === country)?.locale_settings ?? null;
          }),
        ),
      ),
    );
  }

  private validateAndUpdateCurrentLocale(account: AccountDto): Observable<AccountDto> {
    const isValidLanguage = this.appTranslateService.isLanguageValid(account.locale.toLowerCase());

    this.appTranslateService.changeLanguage(
      isValidLanguage ? account.locale.toLowerCase() : this.appTranslateService.defaultLanguage,
    );

    const updateLocale$ = isValidLanguage ? of(null) : this.updateLocale(this.appTranslateService.defaultLanguage);

    return updateLocale$.pipe(map(() => account));
  }
}
