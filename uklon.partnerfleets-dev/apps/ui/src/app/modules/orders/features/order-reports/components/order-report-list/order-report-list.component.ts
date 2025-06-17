import { SelectionModel } from '@angular/cdk/collections';
import { DecimalPipe, NgClass, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AnalyticsTogglePanel, DriversOrdersReportDto, FleetAnalyticsEventType } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { CorePaths } from '@ui/core/models/core-paths';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { StorageService, userRoleKey } from '@ui/core/services/storage.service';
import { DriverPaths } from '@ui/modules/drivers/models/driver-paths';
import { OrderReportInformationComponent } from '@ui/modules/orders/features/order-reports/components/order-report-information/order-report-information.component';
import { DurationPipe, MAT_TABLE_IMPORTS } from '@ui/shared';
import { MoneyPipe } from '@ui/shared/pipes/money';
import { ICONS } from '@ui/shared/tokens';
import { NgxTippyModule } from 'ngx-tippy-wrapper';

import { Currency } from '@uklon/types';

@Component({
  selector: 'upf-order-report-list',
  standalone: true,
  imports: [
    MAT_TABLE_IMPORTS,
    DecimalPipe,
    TranslateModule,
    NgTemplateOutlet,
    MatIcon,
    NgxTippyModule,
    NgClass,
    MatIconButton,
    DurationPipe,
    MoneyPipe,
    RouterLink,
    OrderReportInformationComponent,
  ],
  templateUrl: './order-report-list.component.html',
  styleUrls: ['./order-report-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderReportListComponent {
  @Input() public reports: DriversOrdersReportDto[] = [];
  @Input() public currency = Currency.UAH;

  public readonly selection = new SelectionModel<number>();

  public readonly visibleColumns: string[] = [
    'driver',
    'rides',
    'onlineTime',
    'totalExecutingTime',
    'ridesPerHour',
    'totalDistance',
    'ridesTotalAmount',
    'averagePricePerHour',
    'averagePricePerKm',
    'totalAmount',
    'toggle',
    'detail',
  ];

  public readonly corePaths = CorePaths;
  public readonly driverPaths = DriverPaths;

  public readonly icons = inject(ICONS);
  private readonly analytics = inject(AnalyticsService);
  private readonly storage = inject(StorageService);

  public toggle(value: number): void {
    this.selection.toggle(value);

    this.analytics.reportEvent<AnalyticsTogglePanel>(FleetAnalyticsEventType.FLEET_DRIVER_REPORT_DETAILS, {
      user_access: this.storage.get(userRoleKey),
      view: this.selection.isSelected(value) ? 'opened' : 'closed',
    });
  }
}
