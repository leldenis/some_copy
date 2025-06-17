import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { RestrictionReason } from '@constant';
import { EmployeeRestrictionDetailsDto, DriverRestrictionDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { RESTRICTION_REASON_GROUP_INTL, RESTRICTION_REASON_GROUP_RESTRICTION_INTL } from '@ui/modules/drivers/consts';
import { DotMarkerIconComponent } from '@ui/shared';
import { InfoPanelComponent } from '@ui/shared/modules/info-panel/components/info-panel/info-panel.component';
import { InfoPanelIconDirective, InfoPanelTitleDirective } from '@ui/shared/modules/info-panel/directives';

function mapRestrictions(restrictions: DriverRestrictionDto[]): EmployeeRestrictionDetailsDto[] {
  const restrictedBySet = new Set(restrictions.map(({ restricted_by }) => restricted_by));

  return [...restrictedBySet].map((restrictedBy) => {
    const restriction_items = restrictions.filter(({ restricted_by }) => restricted_by === restrictedBy);

    return { restricted_by: restrictedBy, restriction_items };
  });
}

@Component({
  selector: 'upf-employee-restriction-panel',
  standalone: true,
  imports: [
    MatExpansionModule,
    MatIconModule,
    TranslateModule,
    DotMarkerIconComponent,
    InfoPanelComponent,
    InfoPanelIconDirective,
    InfoPanelTitleDirective,
  ],
  templateUrl: './employee-restriction-panel.component.html',
  styleUrls: ['./employee-restriction-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeRestrictionPanelComponent {
  public readonly restrictions = input([], { transform: mapRestrictions });
  public readonly opened = input<boolean>(true);
  public readonly restrictionTitleKey = input<string>('DriverRestriction.Title');

  public removeCashLimitRestriction = output();

  public readonly restrictionReasonIntl = RESTRICTION_REASON_GROUP_INTL;
  public readonly restrictionTypeIntl = RESTRICTION_REASON_GROUP_RESTRICTION_INTL;
  public readonly restrictionReason = RestrictionReason;
}
