import { AsyncPipe, DecimalPipe, NgClass, NgTemplateOutlet } from '@angular/common';
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
import { VehicleProgramRequirementsInfoErrorComponent } from '@ui/modules/bonuses/components/vehicle-program-requirements-info-error/vehicle-program-requirements-info-error.component';
import { CurrentCommissionFromRangePipe } from '@ui/modules/bonuses/pipes/current-commission-from-range/current-commission-from-range.pipe';
import { RatingLessRequirementPipe } from '@ui/modules/bonuses/pipes/rating-less-requirement/rating-less-requirement.pipe';
import { SortCommissionsPipe } from '@ui/modules/bonuses/pipes/sort-commissions/sort-commissions.pipe';
import { DriverPaths } from '@ui/modules/drivers/models/driver-paths';
import { VehiclePaths } from '@ui/modules/vehicles/models/vehicle-paths';
import { UIService, VehicleLinkComponent } from '@ui/shared';
import { RatingComponent } from '@ui/shared/components/rating/rating.component';
import { MoneyPipe } from '@ui/shared/pipes/money';
import { ICONS } from '@ui/shared/tokens/icons.token';
import { NgxTippyModule } from 'ngx-tippy-wrapper';

import { Currency } from '@uklon/types';

@Component({
  selector: 'upf-vehicle-active-commission-programs-list',
  standalone: true,
  imports: [
    CommissionOrdersProgressStepperComponent,
    CommissionProgressBarComponent,
    CurrentCommissionFromRangePipe,
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
    VehicleProgramRequirementsInfoErrorComponent,
    CommissionProgramPeriodComponent,
    VehicleLinkComponent,
    AsyncPipe,
    NgTemplateOutlet,
    NgClass,
    DecimalPipe,
    CommissionProgramsProgressIconComponent,
    MoneyPipe,
  ],
  templateUrl: './vehicle-active-commission-programs-list.component.html',
  styleUrl: './vehicle-active-commission-programs-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleActiveCommissionProgramsListComponent {
  public readonly currency = input.required<Currency>();
  public readonly programs = input.required<CommissionProgramsDto[]>();

  public readonly corePaths = CorePaths;
  public readonly vehiclePaths = VehiclePaths;
  public readonly driverPaths = DriverPaths;
  public readonly analyticsEventType = FleetAnalyticsEventType;

  public readonly icons = inject(ICONS);
  private readonly uiService = inject(UIService);
  private readonly analytics = inject(AnalyticsService);
  private readonly storage = inject(StorageService);

  public readonly isMobileView$ = this.uiService.breakpointMatch();

  public reportAnalytics(event: FleetAnalyticsEventType, state?: boolean, item?: CommissionProgramsDto): void {
    this.analytics.reportEvent(event, {
      ...(item?.driver_id && { driver_id: item.driver_id }),
      ...(item?.program_id && { program_id: item.program_id }),
      state,
      user_access: this.storage.get(userRoleKey),
    });
  }
}
