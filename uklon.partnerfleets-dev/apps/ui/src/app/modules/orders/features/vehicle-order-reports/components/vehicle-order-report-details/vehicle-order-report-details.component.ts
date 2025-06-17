import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { StatisticLossDto, VehicleOrderReportItemDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { DurationPipe } from '@ui/shared';
import { MoneyComponent } from '@ui/shared/components/money/money.component';
import { ICONS } from '@ui/shared/tokens';
import { NgxTippyModule } from 'ngx-tippy-wrapper';

@Component({
  selector: 'upf-vehicle-order-report-details',
  standalone: true,
  imports: [MatIcon, TranslateModule, NgxTippyModule, MoneyComponent, DurationPipe, DecimalPipe],
  templateUrl: './vehicle-order-report-details.component.html',
  styleUrls: ['./vehicle-order-report-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleOrderReportDetailsComponent {
  @Input() public report: VehicleOrderReportItemDto;
  @Input() public loss: StatisticLossDto;

  public readonly icons = inject(ICONS);
}
