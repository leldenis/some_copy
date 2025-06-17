import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';
import { AppTranslateService } from '@ui/core/services/app-translate.service';

@Component({
  selector: 'upf-language-select',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatIconModule, MatMenuModule],
  templateUrl: './language-select.component.html',
  styleUrls: ['./language-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSelectComponent {
  @Output() public localeChanged = new EventEmitter<string>();

  public availableLanguages = this.appTranslateService.availableLanguages;
  public isOpened: boolean;
  public localeToCountry = AppTranslateService.languageToCountry;
  public currentLocale$ = this.appTranslateService.currentLang$;

  constructor(private readonly appTranslateService: AppTranslateService) {}

  public handleLanguageChange(locale: string): void {
    this.localeChanged.emit(locale);
  }
}
