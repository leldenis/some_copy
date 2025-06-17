import { NgClass, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, input, Output, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';
import { AppTranslateService } from '@ui/core/services/app-translate.service';

@Component({
  selector: 'upf-shell-language-selector',
  standalone: true,
  imports: [MatIcon, MatMenu, MatMenuItem, TranslateModule, MatMenuTrigger, NgClass, TitleCasePipe],
  templateUrl: './shell-language-selector.component.html',
  styleUrl: './shell-language-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellLanguageSelectorComponent {
  @Output() public languageSelectOpened = new EventEmitter<void>();

  public drawerOpened = input.required<boolean>();

  public readonly availableLanguages = this.translateService.availableLanguages;
  public readonly languageToCountry = AppTranslateService.languageToCountry;
  public readonly opened = signal<boolean>(false);

  constructor(private readonly translateService: AppTranslateService) {}

  public get currentLanguage(): string {
    return this.translateService.currentLang;
  }

  public onLanguageChange(language: string): void {
    this.translateService.changeLanguage(language);
  }

  public onLanguageSelectOpened(): void {
    this.opened.set(true);
    this.languageSelectOpened.emit();
  }
}
