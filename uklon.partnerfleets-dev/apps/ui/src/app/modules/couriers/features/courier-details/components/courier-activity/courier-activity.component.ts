import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { CourierActivityRateDetailsDto, CourierActivitySettingsDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { LetDirective } from '@ui/shared/directives/let.directive';
import { MaxPipe } from '@ui/shared/pipes/max/max.pipe';
import { Seconds2DatePipe } from '@ui/shared/pipes/seconds-2-date/seconds-2-date.pipe';
import { Seconds2TimePipe } from '@ui/shared/pipes/seconds-2-time/seconds-2-time.pipe';

@Component({
  selector: 'upf-courier-activity',
  standalone: true,
  imports: [
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatIcon,
    TranslateModule,
    MatExpansionPanelDescription,
    LetDirective,
    MaxPipe,
    Seconds2DatePipe,
    Seconds2TimePipe,
  ],
  templateUrl: './courier-activity.component.html',
  styleUrl: './courier-activity.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourierActivityComponent {
  @Input() public rating: number;
  @Input() public activity: CourierActivityRateDetailsDto;
  @Input() public activitySettings: CourierActivitySettingsDto;
  @Input() public registeredAt: number;
}
