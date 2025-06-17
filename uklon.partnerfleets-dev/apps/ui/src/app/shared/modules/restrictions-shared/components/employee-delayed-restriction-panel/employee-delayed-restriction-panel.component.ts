import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { EmployeeRestrictionDetailsDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { RESTRICTION_REASON_GROUP_INTL, RESTRICTION_REASON_GROUP_RESTRICTION_INTL } from '@ui/modules/drivers/consts';
import { DotMarkerIconComponent } from '@ui/shared';
import { InfoPanelComponent } from '@ui/shared/modules/info-panel/components/info-panel/info-panel.component';
import { InfoPanelIconDirective, InfoPanelTitleDirective } from '@ui/shared/modules/info-panel/directives';

import { UklAngularCoreModule } from '@uklon/angular-core';

@Component({
  selector: 'upf-delayed-employee-restriction-panel',
  templateUrl: './employee-delayed-restriction-panel.component.html',
  styleUrls: ['./employee-delayed-restriction-panel.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatIcon,
    TranslateModule,
    DotMarkerIconComponent,
    DatePipe,
    UklAngularCoreModule,
    InfoPanelComponent,
    InfoPanelIconDirective,
    InfoPanelTitleDirective,
  ],
})
export class EmployeeDelayedRestrictionPanelComponent {
  public readonly restrictions = input.required<EmployeeRestrictionDetailsDto[]>();
  public readonly opened = input<boolean>(true);

  public readonly restrictionReasonIntl = RESTRICTION_REASON_GROUP_INTL;
  public readonly restrictionTypeIntl = RESTRICTION_REASON_GROUP_RESTRICTION_INTL;
}
