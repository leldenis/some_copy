import { NgClass, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { ActiveOrderItemDto, LiveMapEmployeeDto, PictureUrlDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { CorePaths } from '@ui/core/models/core-paths';
import { DriverPaths } from '@ui/modules/drivers/models/driver-paths';
import { StatusBadgeComponent } from '@ui/shared';
import { DefaultImgSrcDirective } from '@ui/shared/directives/default-img-src/default-img-src.directive';
import { LetDirective } from '@ui/shared/directives/let.directive';
import { MapRouteComponent } from '@ui/shared/modules/live-map-shared/components/map-route/map-route.component';
import { MapRouteDetailsComponent } from '@ui/shared/modules/live-map-shared/components/map-route-details/map-route-details.component';
import { Seconds2DatePipe } from '@ui/shared/pipes/seconds-2-date/seconds-2-date.pipe';
import { Seconds2TimePipe } from '@ui/shared/pipes/seconds-2-time/seconds-2-time.pipe';

import { ACTIVE_ORDER_STATUS_STYLING } from '../../consts';
import { MapPanelBaseDirective } from '../../directives';

@Component({
  selector: 'upf-map-trip',
  standalone: true,
  imports: [
    MatIcon,
    MatIconButton,
    StatusBadgeComponent,
    LetDirective,
    TitleCasePipe,
    TranslateModule,
    Seconds2DatePipe,
    Seconds2TimePipe,
    NgClass,
    DefaultImgSrcDirective,
    MatDivider,
    MapRouteDetailsComponent,
    MapRouteComponent,
  ],
  templateUrl: './map-trip.component.html',
  styleUrls: ['./map-trip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapTripComponent extends MapPanelBaseDirective {
  @Input() public order: ActiveOrderItemDto;
  @Input() public isDelivery = false;

  @Input() public set entity(entity: LiveMapEmployeeDto) {
    this.mapEntity = entity;
    this.avatar = entity?.vehicle ? entity.photos['driver_avatar_photo'] : entity.photos['courier_avatar_photo'];
  }

  @Output() public goBack = new EventEmitter<void>();
  @Output() public navigateToEntity = new EventEmitter<string>();
  @Output() public navigateToOrder = new EventEmitter<void>();

  public readonly path = CorePaths;
  public readonly driverPath = DriverPaths;
  public readonly orderStatusStyling = ACTIVE_ORDER_STATUS_STYLING;

  public mapEntity: LiveMapEmployeeDto;
  public avatar: PictureUrlDto;

  public onGoBack(): void {
    this.goBack.emit();
  }
}
