import { SelectionModel } from '@angular/cdk/collections';
import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { RestrictionReason } from '@constant';
import { CashLimitType, FleetAnalyticsEventType, FleetDriversItemDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { CorePaths } from '@ui/core/models/core-paths';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { DriverPaths } from '@ui/modules/drivers/models/driver-paths';
import { FADE_IN, FullNamePipe, HasRestrictionPipe } from '@ui/shared';
import { MoneyComponent } from '@ui/shared/components/money/money.component';
import { NgxTippyModule } from 'ngx-tippy-wrapper';
import { map } from 'rxjs/operators';

import { ScrolledDirectiveModule } from '@uklon/fleets/angular/cdk';

@Component({
  selector: 'upf-cash-limits-list',
  standalone: true,
  imports: [
    MatCheckbox,
    MatIconButton,
    MatIcon,
    ScrolledDirectiveModule,
    MoneyComponent,
    NgxTippyModule,
    NgTemplateOutlet,
    MatDivider,
    TranslateModule,
    FullNamePipe,
    RouterLink,
    HasRestrictionPipe,
  ],
  templateUrl: './cash-limits-list.component.html',
  styleUrl: './cash-limits-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [FADE_IN()],
})
export class CashLimitsListComponent {
  public readonly drivers = input.required<FleetDriversItemDto[]>();
  public readonly isMobileView = input.required<boolean | null>();
  public readonly fleetId = input.required<string>();

  public readonly loadMore = output();
  public readonly editDriversLimits = output<FleetDriversItemDto[]>();

  public readonly corePaths = CorePaths;
  public readonly driverPaths = DriverPaths;
  public readonly selection = new SelectionModel<string>(true, []);
  public readonly cashLimitType = CashLimitType;
  public readonly restrictionReason = RestrictionReason;

  public readonly selectedCount = toSignal(this.selection.changed.pipe(map(() => this.selection.selected.length)));
  public readonly allSelected = computed(() => this.drivers().length === this.selectedCount());

  private readonly analytics = inject(AnalyticsService);

  public toggleDriverSelection(driverId: string): void {
    this.selection.toggle(driverId);
  }

  public onEditDrivers(): void {
    const drivers = this.selection.selected.map((driverId) => this.drivers().find(({ id }) => id === driverId));
    this.analytics.reportEvent(FleetAnalyticsEventType.FINANCE_CASH_LIMITS_BATCH_DRIVERS_EDIT, {
      driver_amount: drivers.length,
    });
    this.editDriversLimits.emit(drivers);
  }

  public onEditSingleDriver(driver: FleetDriversItemDto): void {
    this.analytics.reportEvent(FleetAnalyticsEventType.FINANCE_CASH_LIMITS_EDIT_DRIVER_CLICK, { driver_id: driver.id });
    this.editDriversLimits.emit([driver]);
  }

  public onSelectAll(): void {
    const ids = this.drivers().map(({ id }) => id);
    this.allSelected() ? this.clearSelection() : this.selection.select(...ids);
  }

  public clearSelection(manual = false): void {
    if (manual) {
      this.analytics.reportEvent(FleetAnalyticsEventType.FINANCE_CASH_LIMITS_BATCH_DRIVERS_CANCEL, {
        drivers_amount: this.selection.selected.length,
      });
    }

    this.selection.clear();
  }
}
