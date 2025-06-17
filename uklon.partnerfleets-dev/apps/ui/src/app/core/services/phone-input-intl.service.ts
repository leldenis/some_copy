import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { map, Observable, startWith, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PhoneInputIntlService {
  constructor(private readonly translateService: TranslateService) {}

  public getTranslations(): Observable<Record<string, string>> {
    return this.translateService.onLangChange.pipe(
      startWith(this.translateService.currentLang),
      switchMap(() => this.translateService.get(['Common.CountryCode', 'PhoneInput'])),
      map((translations) => {
        return { ...translations['Common.CountryCode'], ...translations['PhoneInput'] };
      }),
    );
  }
}
