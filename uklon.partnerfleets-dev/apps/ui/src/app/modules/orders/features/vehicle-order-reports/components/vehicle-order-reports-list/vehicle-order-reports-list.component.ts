import { SelectionModel } from '@angular/cdk/collections';
import { DecimalPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AnalyticsTogglePanel, FleetAnalyticsEventType, VehicleOrderReportItemDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { CorePaths } from '@ui/core/models/core-paths';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { StorageService, userRoleKey } from '@ui/core/services/storage.service';
import { VehicleBrandedIconComponent } from '@ui/modules/orders/features/vehicle-order-reports/components/vehicle-branded-icon/vehicle-branded-icon.component';
import { VehicleOrderReportDetailsComponent } from '@ui/modules/orders/features/vehicle-order-reports/components/vehicle-order-report-details/vehicle-order-report-details.component';
import { VehiclePaths } from '@ui/modules/vehicles/models/vehicle-paths';
import { DurationPipe, MAT_TABLE_IMPORTS } from '@ui/shared';
import { MoneyComponent } from '@ui/shared/components/money/money.component';
import { NgxTippyModule } from 'ngx-tippy-wrapper';

@Component({
  selector: 'upf-vehicle-order-reports-list',
  standalone: true,
  imports: [
    MAT_TABLE_IMPORTS,
    TranslateModule,
    RouterLink,
    VehicleBrandedIconComponent,
    DurationPipe,
    DecimalPipe,
    MoneyComponent,
    MatIcon,
    NgxTippyModule,
    NgClass,
    VehicleOrderReportDetailsComponent,
    MatIconButton,
  ],
  templateUrl: './vehicle-order-reports-list.component.html',
  styleUrls: ['./vehicle-order-reports-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleOrderReportsListComponent {
  @Input() public reports: VehicleOrderReportItemDto[];

  public readonly corePaths = CorePaths;
  public readonly vehiclePaths = VehiclePaths;
  public readonly columns = [
    'licencePlace',
    'ordersCompleted',
    'onlineTime',
    'orderDistance',
    'totalEarning',
    'netEarning',
    'toggle',
    'expandedView',
  ];
  public readonly selection = new SelectionModel<number>();

  constructor(
    private readonly analytics: AnalyticsService,
    private readonly storage: StorageService,
  ) {}

  public toggle(value: number): void {
    this.selection.toggle(value);

    this.analytics.reportEvent<AnalyticsTogglePanel>(FleetAnalyticsEventType.FLEET_VEHICLE_REPORT_DETAILS, {
      user_access: this.storage.get(userRoleKey),
      view: this.selection.isSelected(value) ? 'opened' : 'closed',
    });
  }
}
