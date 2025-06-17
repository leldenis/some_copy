import { NgClass, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { TransactionDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { MAT_ACCORDION_IMPORTS } from '@ui/shared';
import { MoneyComponent } from '@ui/shared/components/money/money.component';
import { Seconds2DatePipe } from '@ui/shared/pipes/seconds-2-date/seconds-2-date.pipe';
import { Seconds2TimePipe } from '@ui/shared/pipes/seconds-2-time/seconds-2-time.pipe';

@Component({
  selector: 'upf-courier-transactions-list',
  standalone: true,
  imports: [
    MAT_ACCORDION_IMPORTS,
    TranslateModule,
    NgTemplateOutlet,
    MatDivider,
    MoneyComponent,
    Seconds2DatePipe,
    Seconds2TimePipe,
    NgClass,
    MatIcon,
  ],
  templateUrl: './courier-transactions-list.component.html',
  styleUrls: ['./courier-transactions-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourierTransactionsListComponent {
  @Input() public isMobileView: boolean;

  @Input() public transactions: TransactionDto[];
}
