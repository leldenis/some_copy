import { LowerCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CashLimitsSettingsDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { InfoPanelComponent } from '@ui/shared/modules/info-panel/components/info-panel/info-panel.component';
import { CurrencySymbolPipe } from '@ui/shared/pipes/currency-symbol/currency-symbol.pipe';

@Component({
  selector: 'upf-cash-limits-info-panel',
  standalone: true,
  imports: [MatIconButton, MatIcon, TranslateModule, LowerCasePipe, InfoPanelComponent, CurrencySymbolPipe],
  templateUrl: './cash-limits-info-panel.component.html',
  styleUrl: './cash-limits-info-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashLimitsInfoPanelComponent {
  public readonly editCashLimits = output();

  public readonly cashLimitsSettings = input.required<CashLimitsSettingsDto>();
}
