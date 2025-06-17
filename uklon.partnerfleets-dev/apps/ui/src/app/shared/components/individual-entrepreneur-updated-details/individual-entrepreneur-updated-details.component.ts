import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { ChangePaymentProviderDto, FleetMerchant } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { PaymentChannels } from '@ui/core/services/payment-channels.service';
import { cleanGuid } from '@ui/shared/utils/clean-guid';

@Component({
  selector: 'upf-individual-entrepreneur-updated-details',
  standalone: true,
  imports: [MatExpansionModule, MatIconModule, TranslateModule, MatDivider],
  templateUrl: './individual-entrepreneur-updated-details.component.html',
  styleUrls: ['./individual-entrepreneur-updated-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndividualEntrepreneurUpdatedDetailsComponent {
  public changeType = input<string>();
  public name = input.required<string>();
  public paymentProviders = input.required<Partial<Record<FleetMerchant, ChangePaymentProviderDto>>>();

  public paymentChannels = inject(PaymentChannels);

  public readonly merchant = FleetMerchant;
  public readonly cleanGuid = cleanGuid;
  public readonly allPaymentProviders = Object.values(FleetMerchant) as FleetMerchant[];

  constructor() {
    effect(() => {
      const paymentChannelIds = Object.values(this.paymentProviders()).map((item) => item?.payment_channel_id);
      this.paymentChannels.getPaymentChannels(paymentChannelIds);
    });
  }
}
