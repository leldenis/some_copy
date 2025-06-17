import { registerLocaleData } from '@angular/common';
import localeUkExtra from '@angular/common/locales/extra/uk';
import localeUk from '@angular/common/locales/uk';
import { EventEmitter, inject, Injectable } from '@angular/core';
import { Language, LanguageExpression } from '@data-access';
import { Store } from '@ngrx/store';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { localeIdKey, StorageService } from '@ui/core/services/storage.service';
import { rootActions } from '@ui/core/store/root/root.actions';
import { LanguageFallback, LanguageSection } from '@ui-env/environment.model';
import { distinctUntilChanged, map, Observable, startWith } from 'rxjs';

type LanguageSource = 'account' | 'browser' | 'params';

interface AppLanguage {
  code: LanguageExpression;
  source?: LanguageSource;
}

@Injectable({ providedIn: 'root' })
export class AppTranslateService {
  public static readonly defaultLanguage = Language.UK;
  public static readonly defaultLanguages = [Language.UK, Language.UZ, Language.EN, Language.RU];

  public static readonly languageToCountry: Record<string, string> = {
    [Language.EN]: 'EN',
    [Language.RU]: 'RU',
    [Language.UK]: 'UA',
    [Language.UZ]: 'UZ',
  };

  private appLanguage: AppLanguage;
  private fallbacks?: LanguageFallback[];
  private readonly sourcePriority = new Map<LanguageSource, number>([
    ['browser', 1],
    ['account', 2],
    ['params', 3],
  ]);

  private defaultLanguageValue?: LanguageExpression;
  private availableLanguagesValue?: LanguageExpression[];

  private readonly store = inject(Store);
  private readonly translateService = inject(TranslateService);
  private readonly storageService = inject(StorageService);

  public get defaultLanguage(): LanguageExpression {
    return this.defaultLanguageValue;
  }

  public get availableLanguages(): LanguageExpression[] {
    return this.availableLanguagesValue;
  }

  public get currentLang$(): Observable<string> {
    return this.onLangChange.pipe(
      startWith({ lang: this.currentLang }),
      distinctUntilChanged(),
      map(({ lang }) => lang),
    );
  }

  public get currentLang(): string {
    return this.translateService.currentLang;
  }

  public get onLangChange(): EventEmitter<LangChangeEvent> {
    return this.translateService.onLangChange;
  }

  public isLanguageValid(code: string): boolean {
    return this.availableLanguages.includes(code) || !!this.getFallbackCode(code);
  }

  public setDefaults(language?: LanguageSection): void {
    this.availableLanguagesValue = language?.available ?? AppTranslateService.defaultLanguages;
    this.translateService.addLangs(this.availableLanguagesValue);

    this.defaultLanguageValue = language?.default ?? AppTranslateService.defaultLanguage;
    this.translateService.setDefaultLang(this.defaultLanguageValue);

    this.fallbacks = language?.fallbacks;

    registerLocaleData(localeUk, 'uk', localeUkExtra);
  }

  public changeLanguage(code: LanguageExpression, source?: LanguageSource): void {
    let currentCode: LanguageExpression = code;

    if (!this.isLanguageValid(currentCode) || this.appLanguage?.code === currentCode) {
      return;
    }

    const prevSourcePriority = this.sourcePriority.get(this.appLanguage?.source) ?? 0;
    const nextSourcePriority = this.sourcePriority.get(source) ?? 0;

    if (prevSourcePriority > nextSourcePriority) {
      return;
    }

    const fallbackCode = this.getFallbackCode(currentCode);
    if (fallbackCode) {
      currentCode = fallbackCode;
    }

    this.appLanguage = { code: currentCode, source };

    this.translateService.use(code);

    this.store.dispatch(rootActions.setLanguage({ language: code }));
  }

  public resetLanguage(): void {
    const language = this.defaultLanguage ?? AppTranslateService.defaultLanguage;

    this.changeLanguage(language);
    this.storageService.set(localeIdKey, language);
  }

  public getLangs(): string[] {
    return this.translateService.getLangs();
  }

  private getFallbackCode(code: LanguageExpression): LanguageExpression | undefined {
    return this.fallbacks?.length > 0 ? this.fallbacks?.find((f) => f?.from === code)?.to : undefined;
  }
}
