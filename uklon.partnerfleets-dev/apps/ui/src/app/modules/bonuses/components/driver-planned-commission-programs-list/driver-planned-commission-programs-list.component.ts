import { AsyncPipe, DecimalPipe, NgClass, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
} from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { FleetAnalyticsEventType, CommissionProgramsDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { CorePaths } from '@ui/core/models/core-paths';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { StorageService, userRoleKey } from '@ui/core/services/storage.service';
import { CommissionOrdersProgressStepperComponent } from '@ui/modules/bonuses/components/commission-orders-progress-stepper/commission-orders-progress-stepper.component';
import { CommissionProgramPeriodComponent } from '@ui/modules/bonuses/components/commission-program-period/commission-program-period.component';
import { CommissionProgramPlannedDetailsMobileComponent } from '@ui/modules/bonuses/components/commission-program-planned-details-mobile/commission-program-planned-details-mobile.component';
import { CommissionProgramsProgressIconComponent } from '@ui/modules/bonuses/components/commission-programs-progress-icon/commission-programs-progress-icon.component';
import { MinCommissionPipe } from '@ui/modules/bonuses/pipes/min-commission/min-commission.pipe';
import { MinOrdersForMinCommissionPipe } from '@ui/modules/bonuses/pipes/min-orders-for-min-commission/min-orders-for-min-commission.pipe';
import { SortCommissionsPipe } from '@ui/modules/bonuses/pipes/sort-commissions/sort-commissions.pipe';
import { DriverPaths } from '@ui/modules/drivers/models/driver-paths';
import { VehiclePaths } from '@ui/modules/vehicles/models/vehicle-paths';
import { UIService } from '@ui/shared';
import { RatingComponent } from '@ui/shared/components/rating/rating.component';
import { MoneyPipe } from '@ui/shared/pipes/money';
import { ICONS } from '@ui/shared/tokens';
import { NgxTippyModule } from 'ngx-tippy-wrapper';
import { Observable } from 'rxjs';

import { Currency } from '@uklon/types';

@Component({
  selector: 'upf-driver-planned-commission-programs-list',
  standalone: true,
  imports: [
    MatAccordion,
    TranslateModule,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    RouterLink,
    MatIcon,
    NgxTippyModule,
    RatingComponent,
    CommissionProgramPeriodComponent,
    AsyncPipe,
    NgTemplateOutlet,
    NgClass,
    DecimalPipe,
    MinCommissionPipe,
    MinOrdersForMinCommissionPipe,
    MatExpansionPanelDescription,
    CommissionOrdersProgressStepperComponent,
    SortCommissionsPipe,
    CommissionProgramsProgressIconComponent,
    CommissionProgramPlannedDetailsMobileComponent,
    MoneyPipe,
  ],
  templateUrl: './driver-planned-commission-programs-list.component.html',
  styleUrl: './driver-planned-commission-programs-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriverPlannedCommissionProgramsListComponent {
  public readonly programs = input.required<CommissionProgramsDto[]>();
  public readonly currency = input.required<Currency>();

  public readonly driverPath = DriverPaths;
  public readonly vehiclePath = VehiclePaths;
  public readonly corePath = CorePaths;
  public readonly analyticsEventType = FleetAnalyticsEventType;

  private readonly uiService = inject(UIService);
  private readonly analytics = inject(AnalyticsService);
  private readonly storage = inject(StorageService);
  public readonly icons = inject(ICONS);

  public readonly isMobileView$: Observable<boolean> = this.uiService.breakpointMatch();

  public reportAnalytics(event: FleetAnalyticsEventType, state?: boolean, item?: CommissionProgramsDto): void {
    this.analytics.reportEvent(event, {
      ...(item?.driver_id && { driver_id: item.driver_id }),
      ...(item?.program_id && { program_id: item.program_id }),
      state,
      user_access: this.storage.get(userRoleKey),
    });
  }
}
