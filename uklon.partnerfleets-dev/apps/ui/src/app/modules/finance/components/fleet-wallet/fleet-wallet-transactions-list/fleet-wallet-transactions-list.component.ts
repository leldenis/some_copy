import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TransactionDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { MAT_TABLE_IMPORTS } from '@ui/shared';
import { MoneyPipe } from '@ui/shared/pipes/money';
import { Seconds2DatePipe } from '@ui/shared/pipes/seconds-2-date/seconds-2-date.pipe';
import { Seconds2TimePipe } from '@ui/shared/pipes/seconds-2-time/seconds-2-time.pipe';

import { SelectionDirective } from '@uklon/fleets/angular/cdk';

@Component({
  selector: 'upf-fleet-wallet-transactions-list',
  standalone: true,
  imports: [
    MAT_TABLE_IMPORTS,
    TranslateModule,
    Seconds2DatePipe,
    Seconds2TimePipe,
    NgClass,
    MoneyPipe,
    MatIcon,
    MatIconButton,
  ],
  templateUrl: './fleet-wallet-transactions-list.component.html',
  styleUrls: ['./fleet-wallet-transactions-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FleetWalletTransactionsListComponent extends SelectionDirective<number> {
  @Input() public dataSource: TransactionDto[];

  public columns = ['Date', 'Time', 'TransactionType', 'BalanceDelta', 'Balance', 'Toggle', 'ExpandedView'];

  public toggle(value: number): void {
    this.selection.toggle(value);
    this.selectionChange.emit(value);
  }

  protected getSelectionIndex(): number {
    return this.selected;
  }
}
