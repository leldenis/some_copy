import { AsyncPipe } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, Inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CourierDetailsDto, CourierRestrictionDto } from '@data-access';
import { Store } from '@ngrx/store';
import { CorePaths } from '@ui/core/models/core-paths';
import { selectedFleetId } from '@ui/core/store/account/account.selectors';
import { CourierDetailsTabsComponent } from '@ui/modules/couriers/features/courier-details/containers/courier-details-tabs/courier-details-tabs.component';
import { CourierInfoContainerComponent } from '@ui/modules/couriers/features/courier-details/containers/courier-info-container/courier-info-container.component';
import { courierDetailsActions } from '@ui/modules/couriers/features/courier-details/store/courier-details.actions';
import { CourierDetailsState } from '@ui/modules/couriers/features/courier-details/store/courier-details.reducer';
import {
  getCourierRestrictions,
  getFleetCourierDetails,
} from '@ui/modules/couriers/features/courier-details/store/courier-details.selectors';
import { UIService } from '@ui/shared';
import { IconsConfig } from '@ui/shared/tokens/icons.config';
import { ICONS } from '@ui/shared/tokens/icons.token';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { Observable } from 'rxjs';

@Component({
  selector: 'upf-courier-details-page',
  standalone: true,
  imports: [AsyncPipe, InfiniteScrollDirective, CourierInfoContainerComponent, CourierDetailsTabsComponent],
  templateUrl: './courier-details-page.component.html',
  styleUrls: ['./courier-details-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourierDetailsPageComponent implements OnDestroy, AfterViewInit {
  public courier$: Observable<CourierDetailsDto> = this.store.select(getFleetCourierDetails);
  public restrictions$: Observable<CourierRestrictionDto[]> = this.store.select(getCourierRestrictions);
  public selectedFleetId$: Observable<string> = this.store.select(selectedFleetId);

  constructor(
    private readonly store: Store<CourierDetailsState>,
    private readonly router: Router,
    private readonly uiService: UIService,
    @Inject(ICONS) public icons: IconsConfig,
  ) {}

  public ngAfterViewInit(): void {
    this.uiService.setConfig({
      header: {
        customTitle: 'Header.Title.CourierDetails',
        title: false,
        branding: false,
        backNavigationButton: true,
        hideTitleOnMobile: true,
      },
    });
  }

  public ngOnDestroy(): void {
    this.store.dispatch(courierDetailsActions.clearState());
    this.uiService.resetConfig();
  }

  public navigateBack(): void {
    this.router.navigate([CorePaths.WORKSPACE, CorePaths.COURIERS]);
  }

  public removeCourier(): void {
    this.store.dispatch(courierDetailsActions.openRemoveCourierDialog());
  }
}
