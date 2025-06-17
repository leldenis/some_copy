import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MoneyDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { MoneyPipe } from '@ui/shared/pipes/money';
import { ICONS } from '@ui/shared/tokens';

@Component({
  selector: 'upf-couriers-balances-info',
  standalone: true,
  imports: [MatIcon, TranslateModule, NgClass, MoneyPipe, MatDivider],
  templateUrl: './couriers-balances-info.component.html',
  styleUrls: ['./couriers-balances-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CouriersBalancesInfoComponent {
  @Input() public totalBalance: MoneyDto;

  @Input() public withdrawalSum: number;

  public readonly icons = inject(ICONS);
}
