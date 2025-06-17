import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DriverPaymentAccountType, DriverPaymentInfoDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'upf-driver-payment-info',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './driver-payment-info.component.html',
  styleUrls: ['./driver-payment-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriverPaymentInfoComponent {
  @Input() public paymentInfo: DriverPaymentInfoDto;

  public accountType: typeof DriverPaymentAccountType = DriverPaymentAccountType;
}
