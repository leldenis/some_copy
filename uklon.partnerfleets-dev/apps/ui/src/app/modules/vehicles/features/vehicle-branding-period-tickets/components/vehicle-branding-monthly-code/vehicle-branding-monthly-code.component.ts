import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { InfoPanelComponent } from '@ui/shared/modules/info-panel/components/info-panel/info-panel.component';
import { InfoPanelIconDirective, InfoPanelTitleDirective } from '@ui/shared/modules/info-panel/directives';
import { ICONS } from '@ui/shared/tokens/icons.token';

@Component({
  selector: 'upf-vehicle-branding-monthly-code',
  standalone: true,
  imports: [MatIcon, TranslateModule, InfoPanelComponent, InfoPanelIconDirective, InfoPanelTitleDirective],
  templateUrl: './vehicle-branding-monthly-code.component.html',
  styleUrl: './vehicle-branding-monthly-code.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleBrandingMonthlyCodeComponent {
  public readonly monthlyCode = input.required<string>();

  public readonly icons = inject(ICONS);
}
