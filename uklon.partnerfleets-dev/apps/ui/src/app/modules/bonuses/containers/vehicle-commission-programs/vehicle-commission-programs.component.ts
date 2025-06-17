import { ChangeDetectionStrategy, Component, inject, input, OnInit, signal } from '@angular/core';
import { CommissionProgramsParticipantType, CommissionProgramType } from '@constant';
import { FleetAnalyticsEventType, FleetDataDto } from '@data-access';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { StorageFiltersKey, StorageService, userRoleKey } from '@ui/core/services/storage.service';
import { CommissionProgramsInfoIconMobileComponent } from '@ui/modules/bonuses/components/commission-programs-info-icon-mobile/commission-programs-info-icon-mobile.component';
import { CommissionProgramsSubTabsComponent } from '@ui/modules/bonuses/components/commission-programs-sub-tabs/commission-programs-sub-tabs.component';
import { VehicleActiveCommissionProgramsComponent } from '@ui/modules/bonuses/containers/vehicle-active-commission-programs/vehicle-active-commission-programs.component';
import { VehicleArchivedCommissionProgramsComponent } from '@ui/modules/bonuses/containers/vehicle-archived-commission-programs/vehicle-archived-commission-programs.component';
import { VehiclePlannedCommissionProgramsComponent } from '@ui/modules/bonuses/containers/vehicle-planned-commission-programs/vehicle-planned-commission-programs.component';

@Component({
  selector: 'upf-vehicle-commission-programs',
  standalone: true,
  imports: [
    CommissionProgramsInfoIconMobileComponent,
    CommissionProgramsSubTabsComponent,
    VehicleActiveCommissionProgramsComponent,
    VehiclePlannedCommissionProgramsComponent,
    VehicleArchivedCommissionProgramsComponent,
  ],
  templateUrl: './vehicle-commission-programs.component.html',
  styleUrl: './vehicle-commission-programs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleCommissionProgramsComponent implements OnInit {
  public readonly fleetData = input.required<FleetDataDto | null>();

  public readonly participantType = CommissionProgramsParticipantType;
  public readonly programTypes = CommissionProgramType;
  public readonly analyticsEventType = FleetAnalyticsEventType;

  public readonly activatedProgramType = signal<CommissionProgramType>(null);

  private readonly storage = inject(StorageService);
  private readonly analytics = inject(AnalyticsService);

  public ngOnInit(): void {
    this.analytics.reportEvent(FleetAnalyticsEventType.VEHICLE_COMMISSION_PROGRAMS_SCREEN, {
      user_access: this.storage.get(userRoleKey),
    });
  }

  public handlerProgramType(programType: CommissionProgramType): void {
    this.activatedProgramType.set(programType);
    this.reportAnalytics(FleetAnalyticsEventType.VEHICLE_COMMISSION_PROGRAMS_SUB_TAB_CLICK);
  }

  public reportAnalytics(event: FleetAnalyticsEventType): void {
    this.analytics.reportEvent(event, {
      user_access: this.storage.get(userRoleKey),
      active_tab: this.storage.get(StorageFiltersKey.VEHICLE_ACTIVE_COMMISSION_TAB),
    });
  }
}
