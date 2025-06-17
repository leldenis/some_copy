import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DateRangeDto } from '@data-access';
import { Seconds2DatePipe } from '@ui/shared/pipes/seconds-2-date/seconds-2-date.pipe';

@Component({
  selector: 'upf-commission-program-period',
  standalone: true,
  imports: [Seconds2DatePipe],
  templateUrl: './commission-program-period.component.html',
  styleUrl: './commission-program-period.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommissionProgramPeriodComponent {
  public readonly programPeriod = input.required<DateRangeDto>();
}
