import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { ICONS } from '@ui/shared/tokens/icons.token';
import { NgxTippyModule } from 'ngx-tippy-wrapper';

@Component({
  selector: 'upf-commission-programs-progress-icon',
  standalone: true,
  imports: [MatIcon, NgxTippyModule, TranslateModule],
  templateUrl: './commission-programs-progress-icon.component.html',
  styleUrl: './commission-programs-progress-icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommissionProgramsProgressIconComponent {
  public readonly showTooltip = output();
  public readonly icons = inject(ICONS);
}
