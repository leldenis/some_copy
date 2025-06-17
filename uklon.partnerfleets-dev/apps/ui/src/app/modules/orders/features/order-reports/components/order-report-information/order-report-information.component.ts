import { AsyncPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { DriversOrdersReportDto } from '@data-access';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { getRegion } from '@ui/core/store/account/account.selectors';
import { OrderReportSplitPaymentsDetailsComponent } from '@ui/modules/orders/features/order-reports/components/order-report-split-payments-details/order-report-split-payments-details.component';
import { DurationPipe } from '@ui/shared';
import { MoneyComponent } from '@ui/shared/components/money/money.component';
import { PopoverComponent } from '@ui/shared/components/popover/popover.component';
import { SplitPaymentsTooltipComponent } from '@ui/shared/components/split-payments-tooltip/split-payments-tooltip.component';
import { FleetRegion } from '@ui/shared/enums/fleet-regions.enum';
import { ICONS } from '@ui/shared/tokens';
import { NgxTippyModule } from 'ngx-tippy-wrapper';
import { map } from 'rxjs';

@Component({
  selector: 'upf-order-report-information',
  standalone: true,
  imports: [
    TranslateModule,
    MoneyComponent,
    SplitPaymentsTooltipComponent,
    OrderReportSplitPaymentsDetailsComponent,
    PopoverComponent,
    NgClass,
    MatIcon,
    DurationPipe,
    AsyncPipe,
    NgxTippyModule,
  ],
  templateUrl: './order-report-information.component.html',
  styleUrls: ['./order-report-information.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderReportInformationComponent {
  @Input() public report: DriversOrdersReportDto;

  private readonly store = inject(Store);
  public readonly icons = inject(ICONS);

  public isRegionUZ$ = this.store.select(getRegion).pipe(map((region) => region?.id === FleetRegion.UZ));

  public get showGroupedSplitsTooltip(): boolean {
    return this.report.profit.merchant.amount > 0;
  }

  public get hasCommissionProgram(): boolean {
    return this.report.commission.actual.amount !== this.report.commission.total.amount;
  }
}
