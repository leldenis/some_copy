import { SelectionModel } from '@angular/cdk/collections';
import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { TransactionDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { MAT_TABLE_IMPORTS } from '@ui/shared';
import { MoneyComponent } from '@ui/shared/components/money/money.component';
import { Seconds2DatePipe } from '@ui/shared/pipes/seconds-2-date/seconds-2-date.pipe';
import { Seconds2TimePipe } from '@ui/shared/pipes/seconds-2-time/seconds-2-time.pipe';

@Component({
  selector: 'upf-driver-transactions-list',
  standalone: true,
  imports: [
    MAT_TABLE_IMPORTS,
    TranslateModule,
    Seconds2DatePipe,
    Seconds2TimePipe,
    MoneyComponent,
    NgClass,
    MatIcon,
    MatIconButton,
    MatDivider,
  ],
  templateUrl: './driver-transactions-list.component.html',
  styleUrls: ['./driver-transactions-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriverTransactionsListComponent {
  @Input() public transactionsList: TransactionDto[];

  public selection: SelectionModel<number> = new SelectionModel(true, []);
  public columnsToDisplay = ['Date', 'Time', 'TransactionType', 'BalanceDelta', 'Balance', 'Toggle', 'ExpandedView'];
}
