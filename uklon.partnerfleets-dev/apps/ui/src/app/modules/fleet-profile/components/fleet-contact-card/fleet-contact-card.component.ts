import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconAnchor } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { BlockedListStatusReason, BlockedListStatusValue } from '@constant';
import { FleetContactDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { CorePaths } from '@ui/core/models/core-paths';
import { FullNamePipe } from '@ui/shared';
import { Id2ColorPipe } from '@ui/shared/pipes/id-2-color/id-2-color.pipe';
import { NgxTippyModule } from 'ngx-tippy-wrapper';

@Component({
  selector: 'upf-fleet-contact-card',
  standalone: true,
  templateUrl: './fleet-contact-card.component.html',
  styleUrls: ['./fleet-contact-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Id2ColorPipe, FullNamePipe, TranslateModule, MatIcon, NgxTippyModule, NgClass, RouterLink, MatIconAnchor],
})
export class FleetContactCardComponent {
  public readonly contact = input.required<FleetContactDto>();
  public readonly isMe = input.required<boolean>();

  public readonly corePath = CorePaths;
  public readonly contactStatus = BlockedListStatusValue;
  public readonly statusReason = BlockedListStatusReason;
}
