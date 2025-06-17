import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { UklonGarageApplicationStatus, UklonGarageFleetApplicationDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { HasScrollDirective, StatusBadgeComponent, StatusColor } from '@ui/shared';
import { EmptyStateComponent } from '@ui/shared/components/empty-state/empty-state.component';
import { Seconds2DatePipe } from '@ui/shared/pipes/seconds-2-date/seconds-2-date.pipe';
import { NgxTippyModule } from 'ngx-tippy-wrapper';

@Component({
  selector: 'upf-applications-list',
  standalone: true,
  imports: [
    MatIcon,
    StatusBadgeComponent,
    TranslateModule,
    NgxTippyModule,
    HasScrollDirective,
    MatMenu,
    MatMenuItem,
    MatIconButton,
    MatMenuTrigger,
    EmptyStateComponent,
    Seconds2DatePipe,
  ],
  templateUrl: './applications-list.component.html',
  styleUrl: './applications-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicationsListComponent {
  public readonly applications = input.required<UklonGarageFleetApplicationDto[]>();

  public readonly handleApprove = output<{ approve: boolean; index: number }>();
  public readonly reviewApplication = output<number>();

  public readonly applicationStatus = UklonGarageApplicationStatus;
  public readonly statusColorMap: Record<UklonGarageApplicationStatus, StatusColor> = {
    [UklonGarageApplicationStatus.NEW]: 'accent',
    [UklonGarageApplicationStatus.APPROVED]: 'success',
    [UklonGarageApplicationStatus.CLOSED_BY_PARALLEL_REGISTRATION]: 'success',
    [UklonGarageApplicationStatus.REJECTED]: 'error',
    [UklonGarageApplicationStatus.REVIEW]: 'warn',
  };

  public onHandleApplication(approve: boolean, index: number): void {
    this.handleApprove.emit({ approve, index });
  }
}
