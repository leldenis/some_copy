import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import {
  MissingTranslationHandler,
  MissingTranslationHandlerParams,
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Observable, of } from 'rxjs';

import { AccountLocale } from '@uklon/types';

export class MissingTranslationToEmptyHandler implements MissingTranslationHandler {
  public handle(params: MissingTranslationHandlerParams): Observable<string> {
    console.warn(`Could not find the translation for key '${params.key}'`);
    return of(params.key);
  }
}

@NgModule({
  imports: [
    TranslateModule.forRoot({
      defaultLanguage: AccountLocale.Uk,
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useClass: MissingTranslationToEmptyHandler,
      },
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => new TranslateHttpLoader(http, './assets/i18n/', '.json'),
        deps: [HttpClient],
      },
    }),
  ],
  exports: [TranslateModule],
})
export class TranslationModule {}
