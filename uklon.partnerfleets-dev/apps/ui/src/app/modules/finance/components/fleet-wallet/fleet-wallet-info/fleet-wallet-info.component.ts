import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MoneyDto, PaymentCardDto, WalletDto } from '@data-access';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { getSelectedFleet } from '@ui/core/store/account/account.selectors';
import { MoneyPipe } from '@ui/shared/pipes/money';
import { ICONS } from '@ui/shared/tokens';
import { NgxTippyModule } from 'ngx-tippy-wrapper';

@Component({
  selector: 'upf-fleet-wallet-info',
  standalone: true,
  imports: [MatIcon, TranslateModule, NgClass, NgxTippyModule, MatButton, MoneyPipe],
  templateUrl: './fleet-wallet-info.component.html',
  styleUrls: ['./fleet-wallet-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FleetWalletInfoComponent implements OnChanges {
  @Input() public wallet: WalletDto;
  @Input() public card: PaymentCardDto;
  @Input() public showButton = true;

  @Output() public withdraw = new EventEmitter<{ balance: MoneyDto; pan: string }>();
  @Output() public transfer = new EventEmitter<void>();
  @Output() public withdrawDisabledClick = new EventEmitter<void>();

  public canWithdraw = false;
  public balance = 0;
  public tooltip: string;

  public readonly icons = inject(ICONS);
  private readonly store = inject(Store);

  public fleet$ = this.store.select(getSelectedFleet);

  public ngOnChanges({ wallet, card }: SimpleChanges): void {
    if (wallet?.currentValue || card?.currentValue) {
      this.setCanWithdraw();
      this.setBalance();
    }
  }

  public handleWithdrawClick(): void {
    const { balance } = this.wallet;
    const { pan } = this.card;
    this.withdraw.emit({ balance, pan });
  }

  public handleTransferClick(): void {
    this.transfer.emit();
  }

  public reportDisabledClick(): void {
    if (this.canWithdraw) return;
    this.withdrawDisabledClick.emit();
  }

  private setBalance(): void {
    this.balance = this.wallet?.balance?.amount || 0;
  }

  private setCanWithdraw(): void {
    const canWithdraw = this.wallet?.balance?.amount && this.wallet?.balance?.amount > 0 && this.card?.pan;
    this.canWithdraw = !!canWithdraw;
    this.tooltip = this.card?.pan
      ? 'FleetWalletInfo.Buttons.WithdrawalTooltipNoBalance'
      : 'FleetWalletInfo.Buttons.WithdrawalTooltip';
  }
}
