import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ReportByOrdersDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { CorePaths } from '@ui/core/models/core-paths';
import { CourierPaths } from '@ui/modules/couriers/models/courier-paths';
import { CourierReportInfoComponent } from '@ui/modules/couriers-orders/components/courier-report-info/courier-report-info.component';
import { MAT_ACCORDION_IMPORTS } from '@ui/shared';
import { MoneyComponent } from '@ui/shared/components/money/money.component';
import { NgxTippyModule } from 'ngx-tippy-wrapper';

@Component({
  selector: 'upf-couriers-reports-list',
  standalone: true,
  imports: [
    MAT_ACCORDION_IMPORTS,
    TranslateModule,
    NgxTippyModule,
    MatIcon,
    RouterLink,
    MoneyComponent,
    NgClass,
    CourierReportInfoComponent,
  ],
  templateUrl: './couriers-reports-list.component.html',
  styleUrls: ['./couriers-reports-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CouriersReportsListComponent {
  @Input() public isMobileView: boolean;

  @Input() public reports: ReportByOrdersDto[];

  public readonly corePath = CorePaths;
  public readonly courierPath = CourierPaths;
}
