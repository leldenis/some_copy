import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatTab, MatTabContent, MatTabGroup, MatTabLabel } from '@angular/material/tabs';
import { CourierRestriction } from '@data-access';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { CourierDeliveriesComponent } from '@ui/modules/couriers/features/courier-details/containers/courier-deliveries/courier-deliveries.component';
import { CourierHistoryContainerComponent } from '@ui/modules/couriers/features/courier-details/containers/courier-history-container/courier-history-container.component';
import { CourierPhotosComponent } from '@ui/modules/couriers/features/courier-details/containers/courier-photos/courier-photos.component';
import { CourierProductsComponent } from '@ui/modules/couriers/features/courier-details/containers/courier-products/courier-products.component';
import { CourierRestrictionsComponent } from '@ui/modules/couriers/features/courier-details/containers/courier-restrictions/courier-restrictions.component';
import { CourierStatisticsContainerComponent } from '@ui/modules/couriers/features/courier-details/containers/courier-statistics-container/courier-statistics-container.component';
import { courierDetailsActions } from '@ui/modules/couriers/features/courier-details/store/courier-details.actions';
import { CourierDetailsState } from '@ui/modules/couriers/features/courier-details/store/courier-details.reducer';
import { getCourierCashRestrictionSettings } from '@ui/modules/couriers/features/courier-details/store/courier-details.selectors';
import { NAMED_FRAGMENTS, NamedFragmentsDirective, UIService } from '@ui/shared';
import { LetDirective } from '@ui/shared/directives/let.directive';

@Component({
  selector: 'upf-courier-details-tabs',
  standalone: true,
  imports: [
    LetDirective,
    MatTabGroup,
    AsyncPipe,
    MatTab,
    MatTabLabel,
    TranslateModule,
    MatTabContent,
    CourierHistoryContainerComponent,
    CourierPhotosComponent,
    CourierProductsComponent,
    CourierDeliveriesComponent,
    CourierRestrictionsComponent,
    CourierStatisticsContainerComponent,
  ],
  templateUrl: './courier-details-tabs.component.html',
  styleUrls: ['./courier-details-tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NAMED_FRAGMENTS,
      useValue: ['statistics', 'filters', 'history', 'photos', 'deliveries', 'restrictions'],
    },
  ],
})
export class CourierDetailsTabsComponent extends NamedFragmentsDirective {
  @Input() public selectedFleetId: string;
  @Input() public selectedCourierId: string;

  public cashRestrictionSettings$ = this.store.select(getCourierCashRestrictionSettings);

  public readonly isMobileView$ = this.uiService.breakpointMatch();

  constructor(
    private readonly store: Store<CourierDetailsState>,
    private readonly uiService: UIService,
  ) {
    super();
  }

  public updateCourierRestriction(restrictionType: CourierRestriction): void {
    this.store.dispatch(courierDetailsActions.updateFleetCourierRestriction({ restrictionType }));
  }

  public removeCourierRestriction(restrictionType: CourierRestriction): void {
    this.store.dispatch(courierDetailsActions.removeFleetCourierRestriction({ restrictionType }));
  }
}
