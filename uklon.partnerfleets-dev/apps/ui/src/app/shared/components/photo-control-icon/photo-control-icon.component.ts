import { ChangeDetectionStrategy, Component, computed, HostBinding, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TicketStatus } from '@constant';
import { TranslateModule } from '@ngx-translate/core';
import { PhotoControlDeadlineMessagePipe } from '@ui/modules/vehicles/pipes/photo-control-deadline-message/photo-control-deadline-message.pipe';
import { LetDirective } from '@ui/shared/directives/let.directive';
import { NgxTippyModule } from 'ngx-tippy-wrapper';

@Component({
  selector: 'upf-photo-control-icon',
  standalone: true,
  imports: [LetDirective, MatIcon, PhotoControlDeadlineMessagePipe, TranslateModule, NgxTippyModule],
  templateUrl: './photo-control-icon.component.html',
  styleUrl: './photo-control-icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoControlIconComponent {
  @HostBinding('class.!tw-hidden')
  public get showIcon(): boolean {
    return (
      [TicketStatus.SENT, TicketStatus.REVIEW, TicketStatus.APPROVED, TicketStatus.REJECTED].includes(this.status()) &&
      !this.blockImmediately()
    );
  }

  public path = input<string>('PhotoControl.Tooltips.VehiclesList');
  public status = input.required<TicketStatus>();
  public blockImmediately = input.required<boolean>();
  public deadline = input<number>(0);
  public tooltipTitle = computed(
    () =>
      (this.blockImmediately() && `${this.path()}.DraftTitle`) ||
      (this.status() === TicketStatus.CLARIFICATION && `${this.path()}.ClarificationTitle`) ||
      `${this.path()}.DraftTitle`,
  );
}
