import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, Input, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { OrderRecordDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { CorePaths } from '@ui/core/models/core-paths';
import { DriverPaths } from '@ui/modules/drivers/models/driver-paths';
import { VehiclePaths } from '@ui/modules/vehicles/models/vehicle-paths';
import { DurationPipe, NormalizeStringPipe, StatusBadgeComponent } from '@ui/shared';
import { ORDER_STATUS_COLOR } from '@ui/shared/consts';
import { DefaultImgSrcDirective } from '@ui/shared/directives/default-img-src/default-img-src.directive';
import { MapPanelBaseDirective } from '@ui/shared/modules/live-map-shared/directives';
import { MoneyPipe } from '@ui/shared/pipes/money';
import { Seconds2DatePipe } from '@ui/shared/pipes/seconds-2-date/seconds-2-date.pipe';
import { Seconds2TimePipe } from '@ui/shared/pipes/seconds-2-time/seconds-2-time.pipe';
import { Observable, interval, map, of, startWith } from 'rxjs';

import { toServerDate } from '@uklon/angular-core';

const INTERVAL = 60_000;

@Component({
  selector: 'upf-order-details-panel',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatDividerModule,
    TranslateModule,
    StatusBadgeComponent,
    MatIconModule,
    DurationPipe,
    NormalizeStringPipe,
    MoneyPipe,
    DefaultImgSrcDirective,
    Seconds2DatePipe,
    Seconds2TimePipe,
  ],
  templateUrl: './order-details-panel.component.html',
  styleUrls: ['./order-details-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderDetailsPanelComponent extends MapPanelBaseDirective implements OnInit {
  @Input() public order: OrderRecordDto;

  @HostBinding('[attr.data-opened]')
  public get opened(): boolean {
    return this.isOpened;
  }

  public timeDiff$: Observable<number>;
  public readonly path = CorePaths;
  public readonly vehiclePath = VehiclePaths;
  public readonly driverPath = DriverPaths;
  public readonly statusColor = ORDER_STATUS_COLOR;

  public ngOnInit(): void {
    this.timeDiff$ = this.order?.completedAt
      ? of(this.order.completedAt - this.order.createdAt)
      : interval(INTERVAL).pipe(
          startWith(0),
          map(() => toServerDate(new Date()) - this.order.createdAt),
        );
  }
}
