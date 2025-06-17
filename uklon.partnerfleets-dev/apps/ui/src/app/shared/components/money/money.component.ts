import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { MoneyDto } from '@data-access';
import { MoneyDisplayType, MoneyPipe } from '@ui/shared/pipes/money';

@Component({
  selector: 'upf-money',
  standalone: true,
  imports: [MoneyPipe],
  templateUrl: './money.component.html',
  styleUrls: ['./money.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoneyComponent {
  @Input() public money: MoneyDto | undefined;
  @Input() public currency: string;
  @Input() public displayType: MoneyDisplayType = 'without-plus';
  @Input() public withNegativeColor = true;

  @HostBinding('class.negative-balance')
  public get negativeBalance(): boolean {
    return this.money?.amount < 0 && this.withNegativeColor;
  }
}
