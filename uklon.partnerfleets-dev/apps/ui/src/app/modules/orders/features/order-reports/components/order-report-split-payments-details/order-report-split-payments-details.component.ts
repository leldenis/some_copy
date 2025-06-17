import { KeyValuePipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { GroupedByEntrepreneurSplitPaymentDto, MoneyDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { MoneyComponent } from '@ui/shared/components/money/money.component';

@Component({
  selector: 'upf-order-report-split-payments-details',
  standalone: true,
  imports: [NgClass, KeyValuePipe, MatDividerModule, MoneyComponent, TranslateModule],
  templateUrl: './order-report-split-payments-details.component.html',
  styleUrls: ['./order-report-split-payments-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderReportSplitPaymentsDetailsComponent {
  @Input() public groupedSplits: GroupedByEntrepreneurSplitPaymentDto;
  @Input() public merchantsProfit: MoneyDto;
}
