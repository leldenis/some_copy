import { NgClass, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { FleetCourierFeedbackDto, FeedbackStatus } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { CorePaths } from '@ui/core/models/core-paths';
import { CourierPaths } from '@ui/modules/couriers/models/courier-paths';
import { Seconds2DatePipe } from '@ui/shared/pipes/seconds-2-date/seconds-2-date.pipe';
import { Seconds2TimePipe } from '@ui/shared/pipes/seconds-2-time/seconds-2-time.pipe';
import { NgxTippyModule } from 'ngx-tippy-wrapper';

@Component({
  selector: 'upf-couriers-feedbacks-list',
  standalone: true,
  imports: [
    MatAccordion,
    TranslateModule,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    RouterLink,
    Seconds2DatePipe,
    Seconds2TimePipe,
    NgClass,
    MatIcon,
    NgxTippyModule,
    MatIconButton,
    NgTemplateOutlet,
    MatDivider,
  ],
  templateUrl: './couriers-feedbacks-list.component.html',
  styleUrls: ['./couriers-feedbacks-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CouriersFeedbacksListComponent {
  @Input() public feedbacks: FleetCourierFeedbackDto[];
  @Input() public isMobileView: boolean;

  public readonly path = CorePaths;
  public readonly courierPath = CourierPaths;
  public readonly feedbackStatus = FeedbackStatus;
}
