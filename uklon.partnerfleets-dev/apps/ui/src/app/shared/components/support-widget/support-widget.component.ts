import { LowerCasePipe, NgClass, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CountryDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { SupportWidgetSection } from '@ui-env/environment.model';

import { AccountCountry } from '@uklon/types';

@Component({
  selector: 'upf-support-widget',
  standalone: true,
  imports: [LowerCasePipe, NgClass, MatButtonModule, MatIconModule, TranslateModule, NgTemplateOutlet],
  templateUrl: './support-widget.component.html',
  styleUrls: ['./support-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupportWidgetComponent {
  @Input() public set data(widget: SupportWidgetSection) {
    this.widget = widget;
    this.selectedCountry = widget.capital?.country_code || widget.country?.country_code || AccountCountry.Ukraine;
  }

  @HostBinding('class.upf-support-widget--expanded')
  @Input()
  public expand: boolean;

  @Output() public opened = new EventEmitter<boolean>();
  @Output() public widgetCountryChanged = new EventEmitter<CountryDto>();

  public readonly countries = [AccountCountry.Ukraine, AccountCountry.Uzbekistan];
  public widget: SupportWidgetSection;
  public selectedCountry: string;

  public toggleSupportPanel(): void {
    this.expand = !this.expand;

    if (this.expand) {
      this.opened.emit(true);
    }
  }

  public onSelectCountry(country: string): void {
    this.widgetCountryChanged.emit({ country });
  }
}
