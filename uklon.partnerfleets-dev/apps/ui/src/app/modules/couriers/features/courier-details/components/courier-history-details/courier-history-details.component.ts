import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { BlockedListStatusReason, CourierHistoryChange } from '@constant';
import { CourierHistoryChangeItemDto, CourierHistoryProfileChangeProps } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { COURIER_HISTORY_PROPS_MAP } from '@ui/modules/couriers/features/courier-details/consts/history-properties.const';
import { NormalizeStringPipe } from '@ui/shared';
import { Seconds2DatePipe } from '@ui/shared/pipes/seconds-2-date/seconds-2-date.pipe';

@Component({
  selector: 'upf-courier-history-details',
  standalone: true,
  imports: [NgTemplateOutlet, TranslateModule, MatDividerModule, NormalizeStringPipe, Seconds2DatePipe],
  templateUrl: './courier-history-details.component.html',
  styleUrls: ['./courier-history-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourierHistoryDetailsComponent {
  @Input() public info: CourierHistoryChangeItemDto;

  public readonly changeType = CourierHistoryChange;
  public readonly statusReason = BlockedListStatusReason;
  public readonly profileChangeProps: CourierHistoryProfileChangeProps[] = Object.keys(
    COURIER_HISTORY_PROPS_MAP,
  ) as CourierHistoryProfileChangeProps[];
  public readonly profileHistoryPropsMap = COURIER_HISTORY_PROPS_MAP;
}
