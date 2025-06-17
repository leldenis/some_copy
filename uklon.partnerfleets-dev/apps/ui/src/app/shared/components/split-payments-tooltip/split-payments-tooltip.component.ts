import { KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { AnalyticsMerchantsPopover, FleetAnalyticsEventType, GroupedByEntrepreneurSplitPaymentDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { StorageService, userRoleKey } from '@ui/core/services/storage.service';
import { MoneyComponent } from '@ui/shared/components/money/money.component';
import { PopoverComponent } from '@ui/shared/components/popover/popover.component';

@Component({
  selector: 'upf-split-payments-tooltip',
  standalone: true,
  imports: [MatDividerModule, MoneyComponent, PopoverComponent, KeyValuePipe, TranslateModule],
  templateUrl: './split-payments-tooltip.component.html',
  styleUrls: ['./split-payments-tooltip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SplitPaymentsTooltipComponent {
  @Input() public groupedSplits: GroupedByEntrepreneurSplitPaymentDto | undefined;

  constructor(
    private readonly storage: StorageService,
    private readonly analytics: AnalyticsService,
  ) {}

  public onPopoverOpened(opened: boolean): void {
    if (!opened) return;

    this.analytics.reportEvent<AnalyticsMerchantsPopover>(FleetAnalyticsEventType.FLEET_MERCHANT_POPOVER, {
      receivers_count: Object.keys(this.groupedSplits).length,
      user_access: this.storage.get(userRoleKey),
    });
  }
}
