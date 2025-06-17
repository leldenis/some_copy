import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { CommissionProgramsParticipantType } from '@constant';
import { TranslateModule } from '@ngx-translate/core';
import { ICONS } from '@ui/shared/tokens';
import { NgxTippyModule } from 'ngx-tippy-wrapper';

@Component({
  selector: 'upf-commission-programs-info-icon-mobile',
  standalone: true,
  imports: [CommonModule, MatIcon, TranslateModule, NgxTippyModule],
  templateUrl: './commission-programs-info-icon-mobile.component.html',
  styleUrl: './commission-programs-info-icon-mobile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommissionProgramsInfoIconMobileComponent {
  public readonly participantType = input<CommissionProgramsParticipantType>(CommissionProgramsParticipantType.DRIVER);

  public readonly mouseEnterEvent = output();

  public readonly showDriverTooltip = computed(
    () => this.participantType() === CommissionProgramsParticipantType.DRIVER,
  );

  public readonly icons = inject(ICONS);
}
