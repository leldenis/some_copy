import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { SafeUrl } from '@angular/platform-browser';
import { DateRangeDto, FleetDriverDto, KarmaGroupDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { KarmaBarWidthPipe } from '@ui/modules/drivers/pipes';
import { ICONS } from '@ui/shared/tokens';

@Component({
  selector: 'upf-driver-karma',
  standalone: true,
  imports: [
    MatAccordion,
    MatExpansionPanelHeader,
    MatExpansionPanel,
    MatExpansionPanelDescription,
    MatExpansionPanelTitle,
    MatIcon,
    TranslateModule,
    KarmaBarWidthPipe,
    NgClass,
    MatDivider,
  ],
  templateUrl: './driver-karma.component.html',
  styleUrls: ['./driver-karma.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriverKarmaComponent {
  @Input() public driver: FleetDriverDto;
  @Input() public karmaManual: SafeUrl;
  @Input() public karmaGroupRanges: KarmaGroupDto<DateRangeDto>;

  @Output() public opened = new EventEmitter<void>();
  @Output() public linkClicked = new EventEmitter<void>();

  public readonly sections = [1, 2, 3, 4];

  public readonly icons = inject(ICONS);
}
