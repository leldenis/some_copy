import { ChangeDetectionStrategy, Component, inject, input, OnInit, signal } from '@angular/core';
import { CommissionProgramType } from '@constant';
import { FleetAnalyticsEventType, FleetDataDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { StorageFiltersKey, StorageService, userRoleKey } from '@ui/core/services/storage.service';
import { CommissionProgramsInfoIconMobileComponent } from '@ui/modules/bonuses/components/commission-programs-info-icon-mobile/commission-programs-info-icon-mobile.component';
import { CommissionProgramsSubTabsComponent } from '@ui/modules/bonuses/components/commission-programs-sub-tabs/commission-programs-sub-tabs.component';
import { DriverActiveCommissionProgramsComponent } from '@ui/modules/bonuses/containers/driver-active-commission-programs/driver-active-commission-programs.component';
import { DriverArchivedCommissionProgramsComponent } from '@ui/modules/bonuses/containers/driver-archived-commission-programs/driver-archived-commission-programs.component';
import { DriverPlannedCommissionProgramsComponent } from '@ui/modules/bonuses/containers/driver-planned-commission-programs/driver-planned-commission-programs.component';

@Component({
  selector: 'upf-driver-commission-programs',
  standalone: true,
  imports: [
    TranslateModule,
    DriverPlannedCommissionProgramsComponent,
    DriverActiveCommissionProgramsComponent,
    DriverArchivedCommissionProgramsComponent,
    CommissionProgramsSubTabsComponent,
    CommissionProgramsInfoIconMobileComponent,
  ],
  templateUrl: './driver-commission-programs.component.html',
  styleUrl: './driver-commission-programs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriverCommissionProgramsComponent implements OnInit {
  public readonly fleetData = input.required<FleetDataDto | null>();

  public readonly programTypes = CommissionProgramType;
  public readonly analyticsEventType = FleetAnalyticsEventType;

  private readonly storage = inject(StorageService);
  private readonly analytics = inject(AnalyticsService);

  public readonly activatedProgramType = signal<CommissionProgramType>(null);

  public ngOnInit(): void {
    this.analytics.reportEvent(FleetAnalyticsEventType.COMMISSION_PROGRAMS_SCREEN, {
      user_access: this.storage.get(userRoleKey),
    });
  }

  public handlerProgramType(programType: CommissionProgramType): void {
    this.activatedProgramType.set(programType);
    this.reportAnalytics(FleetAnalyticsEventType.COMMISSION_PROGRAMS_SUB_TAB_CLICK);
  }

  public reportAnalytics(event: FleetAnalyticsEventType): void {
    this.analytics.reportEvent(event, {
      user_access: this.storage.get(userRoleKey),
      active_tab: this.storage.get(StorageFiltersKey.DRIVER_ACTIVE_COMMISSION_TAB),
    });
  }
}
