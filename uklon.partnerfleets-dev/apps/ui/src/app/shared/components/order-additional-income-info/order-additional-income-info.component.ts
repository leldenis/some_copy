import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FleetOrderRecordDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { MoneyComponent } from '@ui/shared/components/money/money.component';

@Component({
  selector: 'upf-order-additional-income-info',
  standalone: true,
  imports: [MoneyComponent, TranslateModule, NgClass],
  templateUrl: './order-additional-income-info.component.html',
  styleUrls: ['./order-additional-income-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderAdditionalIncomeInfoComponent {
  @Input() public order: FleetOrderRecordDto;
}
