import { SelectionModel } from '@angular/cdk/collections';
import { AsyncPipe, DecimalPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import {
  AnalyticsTogglePanel,
  BrandingBonusProgramCalculationDto,
  BrandingCalculationProgramParamsDto,
  FleetAnalyticsEventType,
} from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { CorePaths } from '@ui/core/models/core-paths';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { StorageService, userRoleKey } from '@ui/core/services/storage.service';
import { BrandingBonusProgressValuesComponent } from '@ui/modules/bonuses/components/branding-bonus-progress-values/branding-bonus-progress-values.component';
import { IsCancellationPercentMorePipe } from '@ui/modules/bonuses/pipes/is-cancellation-percent-more/is-cancellation-percent-more.pipe';
import { IsRatingLessPipe } from '@ui/modules/bonuses/pipes/is-rating-less/is-rating-less.pipe';
import { OrdersCompletedPipe } from '@ui/modules/bonuses/pipes/orders-completed/orders-completed.pipe';
import { RatingLessRequirementPipe } from '@ui/modules/bonuses/pipes/rating-less-requirement/rating-less-requirement.pipe';
import { TotalOrdersByParametersPipe } from '@ui/modules/bonuses/pipes/total-orders-by-parameters/total-orders-by-parameters.pipe';
import { DriverPaths } from '@ui/modules/drivers/models/driver-paths';
import { VehiclePaths } from '@ui/modules/vehicles/models/vehicle-paths';
import { MAT_TABLE_IMPORTS, ProgressBarComponent, ProgressBarValuePipe, UIService } from '@ui/shared';
import { RatingComponent } from '@ui/shared/components/rating/rating.component';
import { MoneyPipe } from '@ui/shared/pipes/money';
import { ICONS } from '@ui/shared/tokens';
import { NgxTippyModule } from 'ngx-tippy-wrapper';
import { Observable } from 'rxjs';

import { Currency } from '@uklon/types';

@Component({
  selector: 'upf-branding-bonus-program-list',
  standalone: true,
  imports: [
    MAT_TABLE_IMPORTS,
    TranslateModule,
    MatIcon,
    NgxTippyModule,
    ProgressBarValuePipe,
    ProgressBarComponent,
    RouterLink,
    RatingComponent,
    MatIconButton,
    BrandingBonusProgressValuesComponent,
    MatDivider,
    IsRatingLessPipe,
    IsCancellationPercentMorePipe,
    OrdersCompletedPipe,
    TotalOrdersByParametersPipe,
    RatingLessRequirementPipe,
    MoneyPipe,
    DecimalPipe,
    NgClass,
    AsyncPipe,
  ],
  templateUrl: './branding-bonus-program-list.component.html',
  styleUrl: './branding-bonus-program-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandingBonusProgramListComponent {
  public readonly programItems = input.required<BrandingBonusProgramCalculationDto[]>();
  public readonly programParameters = input.required<BrandingCalculationProgramParamsDto>();

  public readonly corePaths = CorePaths;
  public readonly vehiclePaths = VehiclePaths;
  public readonly driverPath = DriverPaths;
  public readonly columns = [
    'licencePlace',
    'cancellationPercentage',
    'ordersCompleted',
    'currentGuaranteedEarnings',
    'driverOnCar',
    'driverRating',
    'toggle',
    'expandedView',
  ];
  public readonly selection = new SelectionModel<number>();
  public readonly defaultCurrency = Currency.UAH;

  private readonly uiService = inject(UIService);
  private readonly analytics = inject(AnalyticsService);
  private readonly storage = inject(StorageService);
  public readonly icons = inject(ICONS);

  public isMobileView$: Observable<boolean> = this.uiService.breakpointMatch();

  public toggle(value: number): void {
    this.selection.toggle(value);

    this.analytics.reportEvent<AnalyticsTogglePanel>(FleetAnalyticsEventType.BONUSES_VEHICLES_TOGGLE_ROW, {
      user_access: this.storage.get(userRoleKey),
      view: this.selection.isSelected(value) ? 'opened' : 'closed',
    });
  }
}
