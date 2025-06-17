import { DecimalPipe, NgClass, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, Input, OnInit } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { DeliveryRecordDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { CorePaths } from '@ui/core/models/core-paths';
import { CourierPaths } from '@ui/modules/couriers/models/courier-paths';
import { StatusBadgeComponent } from '@ui/shared';
import { ORDER_STATUS_COLOR } from '@ui/shared/consts';
import { DefaultImgSrcDirective } from '@ui/shared/directives/default-img-src/default-img-src.directive';
import { MapPanelBaseDirective } from '@ui/shared/modules/live-map-shared';
import { MoneyPipe } from '@ui/shared/pipes/money';
import { Seconds2DatePipe } from '@ui/shared/pipes/seconds-2-date/seconds-2-date.pipe';
import { Observable, of, interval, startWith, map } from 'rxjs';

import { toServerDate } from '@uklon/angular-core';

const INTERVAL = 60_000;

@Component({
  selector: 'upf-delivery-details-panel',
  standalone: true,
  imports: [
    TranslateModule,
    MatIcon,
    NgClass,
    RouterLink,
    DefaultImgSrcDirective,
    StatusBadgeComponent,
    MatDivider,
    Seconds2DatePipe,
    TitleCasePipe,
    MoneyPipe,
    DecimalPipe,
  ],
  templateUrl: './delivery-details-panel.component.html',
  styleUrls: ['./delivery-details-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeliveryDetailsPanelComponent extends MapPanelBaseDirective implements OnInit {
  @Input() public delivery: DeliveryRecordDto;

  @HostBinding('[attr.data-opened]')
  public get opened(): boolean {
    return this.isOpened;
  }

  public timeDiff$: Observable<number>;
  public readonly path = CorePaths;
  public readonly courierPath = CourierPaths;
  public readonly statusColor = ORDER_STATUS_COLOR;

  public ngOnInit(): void {
    this.timeDiff$ = this.delivery?.completedAt
      ? of(this.delivery.completedAt - this.delivery.createdAt)
      : interval(INTERVAL).pipe(
          startWith(0),
          map(() => toServerDate(new Date()) - this.delivery.createdAt),
        );
  }
}
