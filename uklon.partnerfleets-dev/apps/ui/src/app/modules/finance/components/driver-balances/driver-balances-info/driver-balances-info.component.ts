import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { MoneyPipe } from '@ui/shared/pipes/money';
import { ICONS } from '@ui/shared/tokens';

@Component({
  selector: 'upf-driver-balances-info',
  standalone: true,
  imports: [MatIcon, TranslateModule, NgClass, MoneyPipe],
  templateUrl: './driver-balances-info.component.html',
  styleUrls: ['./driver-balances-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriverBalancesInfoComponent {
  @Input() public withdrawalAmount: number;
  @Input() public balance: number;
  @Input() public currency: string;

  public readonly icons = inject(ICONS);
}
