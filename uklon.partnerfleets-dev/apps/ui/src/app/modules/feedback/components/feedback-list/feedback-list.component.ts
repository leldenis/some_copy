import { NgClass, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { FeedbackStatus, FleetDriverFeedbackDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { CorePaths } from '@ui/core/models/core-paths';
import { DriverPaths } from '@ui/modules/drivers/models/driver-paths';
import { Seconds2DatePipe } from '@ui/shared/pipes/seconds-2-date/seconds-2-date.pipe';
import { Seconds2TimePipe } from '@ui/shared/pipes/seconds-2-time/seconds-2-time.pipe';
import { NgxTippyModule } from 'ngx-tippy-wrapper';

@Component({
  selector: 'upf-feedback-list',
  standalone: true,
  imports: [
    MatAccordion,
    TranslateModule,
    RouterLink,
    NgClass,
    MatIcon,
    NgxTippyModule,
    MatIconButton,
    NgTemplateOutlet,
    MatDivider,
    MatExpansionPanelHeader,
    MatExpansionPanel,
    Seconds2DatePipe,
    Seconds2TimePipe,
  ],
  templateUrl: './feedback-list.component.html',
  styleUrls: ['./feedback-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackListComponent {
  @Input() public feedbacks: FleetDriverFeedbackDto[];
  @Input() public isMobileView: boolean;

  public readonly path = CorePaths;
  public readonly driverPath = DriverPaths;
  public readonly feedbackStatus = FeedbackStatus;
}
