import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { CommissionProgramsDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { CommissionOrdersProgressStepperComponent } from '@ui/modules/bonuses/components/commission-orders-progress-stepper/commission-orders-progress-stepper.component';
import { CommissionProgramPeriodComponent } from '@ui/modules/bonuses/components/commission-program-period/commission-program-period.component';
import { CommissionProgramsProgressIconComponent } from '@ui/modules/bonuses/components/commission-programs-progress-icon/commission-programs-progress-icon.component';
import { MinCommissionPipe } from '@ui/modules/bonuses/pipes/min-commission/min-commission.pipe';
import { MinOrdersForMinCommissionPipe } from '@ui/modules/bonuses/pipes/min-orders-for-min-commission/min-orders-for-min-commission.pipe';
import { SortCommissionsPipe } from '@ui/modules/bonuses/pipes/sort-commissions/sort-commissions.pipe';
import { MoneyPipe } from '@ui/shared/pipes/money';
import { ICONS } from '@ui/shared/tokens/icons.token';
import { NgxTippyModule } from 'ngx-tippy-wrapper';

import { Currency } from '@uklon/types';

@Component({
  selector: 'upf-commission-program-planned-details-mobile',
  standalone: true,
  imports: [
    MatIcon,
    CommissionOrdersProgressStepperComponent,
    CommissionProgramPeriodComponent,
    DecimalPipe,
    MatDivider,
    MinCommissionPipe,
    MinOrdersForMinCommissionPipe,
    SortCommissionsPipe,
    TranslateModule,
    NgxTippyModule,
    CommissionProgramsProgressIconComponent,
    MoneyPipe,
  ],
  templateUrl: './commission-program-planned-details-mobile.component.html',
  styleUrl: './commission-program-planned-details-mobile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommissionProgramPlannedDetailsMobileComponent {
  public readonly program = input.required<CommissionProgramsDto>();
  public readonly currency = input.required<Currency>();
  public readonly showDriverPhone = input<boolean>(false);

  public readonly showProfitBudgetTooltip = output();
  public readonly showProgramProgressTooltip = output();

  public readonly icons = inject(ICONS);
}
