import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { BrandingBonusSpecOrderCountDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { MoneyPipe } from '@ui/shared/pipes/money';
import { ICONS } from '@ui/shared/tokens';

import { Currency } from '@uklon/types';

@Component({
  selector: 'upf-branding-bonus-progress-values',
  standalone: true,
  imports: [MatIconModule, TranslateModule, MoneyPipe],
  templateUrl: './branding-bonus-progress-values.component.html',
  styleUrls: ['./branding-bonus-progress-values.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandingBonusProgressValuesComponent {
  public readonly currency = input.required<Currency>();
  public readonly steps = input.required<BrandingBonusSpecOrderCountDto[]>();
  public readonly currentStep = input<number>(0);

  public readonly icons = inject(ICONS);

  public stepCompleted(step: BrandingBonusSpecOrderCountDto, isLast: boolean): boolean {
    return this.currentStep() > step.range[0] && this.currentStep() >= step.range[1] && !isLast;
  }

  public stepInProgress(step: BrandingBonusSpecOrderCountDto, isLast: boolean): boolean {
    return (
      (this.currentStep() >= step.range[0] && this.currentStep() < step.range[1]) ||
      (this.currentStep() >= step.range[1] && isLast)
    );
  }

  public stepNotStarted(step: BrandingBonusSpecOrderCountDto): boolean {
    return this.currentStep() < step.range[0];
  }
}
