import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { ChangePaymentProviderDto, FleetMerchant } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { PaymentChannels } from '@ui/core/services/payment-channels.service';
import { cleanGuid } from '@ui/shared/utils/clean-guid';

@Component({
  selector: 'upf-individual-entrepreneur-changed-details-desktop',
  standalone: true,
  imports: [MatExpansionModule, MatIconModule, TranslateModule, MatDivider],
  templateUrl: './individual-entrepreneur-changed-details-desktop.component.html',
  styleUrls: ['./individual-entrepreneur-changed-details-desktop.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndividualEntrepreneurChangedDetailsDesktopComponent {
  public oldName = input.required<string>();
  public newName = input.required<string>();
  public oldPaymentProviders = input.required<Partial<Record<FleetMerchant, ChangePaymentProviderDto>>>();
  public newPaymentProviders = input.required<Partial<Record<FleetMerchant, ChangePaymentProviderDto>>>();

  public paymentChannels = inject(PaymentChannels);

  public readonly merchant = FleetMerchant;
  public readonly cleanGuid = cleanGuid;
  public readonly allPaymentProviders = Object.values(FleetMerchant) as FleetMerchant[];

  constructor() {
    effect(() => {
      const paymentChannelIds = [
        ...Object.values(this.oldPaymentProviders()).map((item) => item?.payment_channel_id),
        ...Object.values(this.newPaymentProviders()).map((item) => item?.payment_channel_id),
      ];
      this.paymentChannels.getPaymentChannels(paymentChannelIds);
    });
  }
}
