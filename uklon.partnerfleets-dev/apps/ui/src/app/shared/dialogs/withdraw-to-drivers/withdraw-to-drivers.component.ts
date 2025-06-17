import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { BalanceChangeDto, DriverBalanceChangeDto } from '@ui/modules/finance/models';
import { MoneyPipe } from '@ui/shared/pipes/money';
import { ICONS } from '@ui/shared/tokens';

import { Currency } from '@uklon/types';

interface WithdrawToDriversDialogData {
  balanceChange: BalanceChangeDto;
  currency: Currency;
  isCourier: boolean;
}

@Component({
  selector: 'upf-withdraw-to-drivers',
  standalone: true,
  imports: [TranslateModule, MatIconButton, MatIcon, MoneyPipe, MatButton],
  templateUrl: './withdraw-to-drivers.component.html',
  styleUrls: ['./withdraw-to-drivers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WithdrawToDriversComponent implements OnInit {
  public amount: number;
  public changes: DriverBalanceChangeDto[];

  private readonly dialogRef = inject(MatDialogRef<WithdrawToDriversComponent>);

  public readonly icons = inject(ICONS);
  public readonly data = inject<WithdrawToDriversDialogData>(MAT_DIALOG_DATA);

  public ngOnInit(): void {
    this.amount = this.data.balanceChange.total;
    this.changes = this.data.balanceChange.changes;
  }

  public onAcceptClick(): void {
    const payload = {
      items: this.changes.map((change: DriverBalanceChangeDto) => ({
        employee_id: change.driver.driver_id || change.driver.employee_id,
        amount: {
          amount: change.amount,
          currency: this.data.currency,
        },
      })),
    };
    this.dialogRef.close(payload);
  }

  public onCancelClick(): void {
    this.dialogRef.close();
  }
}
