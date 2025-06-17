import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
} from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CommissionProgramsDto, FleetAnalyticsEventType } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { CorePaths } from '@ui/core/models/core-paths';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { StorageService, userRoleKey } from '@ui/core/services/storage.service';
import { CommissionOrdersProgressStepperComponent } from '@ui/modules/bonuses/components/commission-orders-progress-stepper/commission-orders-progress-stepper.component';
import { CommissionProgramPeriodComponent } from '@ui/modules/bonuses/components/commission-program-period/commission-program-period.component';
import { CommissionProgramsProgressIconComponent } from '@ui/modules/bonuses/components/commission-programs-progress-icon/commission-programs-progress-icon.component';
import { CommissionProgressBarComponent } from '@ui/modules/bonuses/components/commission-progress-bar/commission-progress-bar.component';
import { MinCommissionPipe } from '@ui/modules/bonuses/pipes/min-commission/min-commission.pipe';
import { MinOrdersForMinCommissionPipe } from '@ui/modules/bonuses/pipes/min-orders-for-min-commission/min-orders-for-min-commission.pipe';
import { RatingLessRequirementPipe } from '@ui/modules/bonuses/pipes/rating-less-requirement/rating-less-requirement.pipe';
import { SortCommissionsPipe } from '@ui/modules/bonuses/pipes/sort-commissions/sort-commissions.pipe';
import { DriverPaths } from '@ui/modules/drivers/models/driver-paths';
import { UIService } from '@ui/shared';
import { RatingComponent } from '@ui/shared/components/rating/rating.component';
import { InfoPanelComponent } from '@ui/shared/modules/info-panel/components/info-panel/info-panel.component';
import { MoneyPipe } from '@ui/shared/pipes/money';
import { ICONS } from '@ui/shared/tokens/icons.token';
import { NgxTippyModule } from 'ngx-tippy-wrapper';
import { Observable } from 'rxjs';

import { Currency } from '@uklon/types';

@Component({
  selector: 'upf-driver-archived-commission-programs-list',
  standalone: true,
  imports: [
    CommonModule,
    CommissionOrdersProgressStepperComponent,
    MatAccordion,
    MatDivider,
    MatExpansionPanel,
    MatExpansionPanelDescription,
    MatExpansionPanelHeader,
    MatIcon,
    RatingComponent,
    RatingLessRequirementPipe,
    SortCommissionsPipe,
    TranslateModule,
    NgxTippyModule,
    RouterLink,
    CommissionProgressBarComponent,
    MinCommissionPipe,
    MinOrdersForMinCommissionPipe,
    CommissionProgramPeriodComponent,
    CommissionProgramsProgressIconComponent,
    MoneyPipe,
    InfoPanelComponent,
  ],
  templateUrl: './driver-archived-commission-programs-list.component.html',
  styleUrl: './driver-archived-commission-programs-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriverArchivedCommissionProgramsListComponent {
  public readonly programs = input.required<CommissionProgramsDto[]>();
  public readonly currency = input.required<Currency>();

  public readonly driverPath = DriverPaths;
  public readonly corePath = CorePaths;
  public readonly analyticsEventType = FleetAnalyticsEventType;

  public readonly icons = inject(ICONS);
  private readonly uiService = inject(UIService);
  private readonly analytics = inject(AnalyticsService);
  private readonly storage = inject(StorageService);

  public isMobileView$: Observable<boolean> = this.uiService.breakpointMatch();

  public reportAnalytics(event: FleetAnalyticsEventType, state?: boolean, item?: CommissionProgramsDto): void {
    this.analytics.reportEvent(event, {
      ...(item?.driver_id && { driver_id: item.driver_id }),
      ...(item?.program_id && { program_id: item.program_id }),
      state,
      user_access: this.storage.get(userRoleKey),
    });
  }
}
