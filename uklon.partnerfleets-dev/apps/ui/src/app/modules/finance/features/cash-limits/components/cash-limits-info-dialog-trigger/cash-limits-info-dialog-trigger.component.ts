import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, HostBinding, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { FleetAnalyticsEventType } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { CashLimitsInfoDialogComponent } from '@ui/modules/finance/features/cash-limits/dialogs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'upf-cash-limits-info-dialog-trigger',
  standalone: true,
  imports: [CommonModule, MatIcon, TranslateModule],
  templateUrl: './cash-limits-info-dialog-trigger.component.html',
  styleUrl: './cash-limits-info-dialog-trigger.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashLimitsInfoDialogTriggerComponent {
  @HostBinding('attr.data-cy') private get attribute(): string {
    return this.isMobile() ? 'cash-limits-info-dialog-trigger' : 'cash-limits-info-dialog-trigger-desktop';
  }

  public readonly isMobile = input<boolean>(false);

  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  private readonly analytics = inject(AnalyticsService);

  public openDialog(): void {
    this.reportEvent(FleetAnalyticsEventType.FINANCE_CASH_LIMITS_GUIDE_CLICK);

    this.dialog
      .open(CashLimitsInfoDialogComponent)
      .afterClosed()
      .pipe(
        tap(() => this.reportEvent(FleetAnalyticsEventType.FINANCE_CASH_LIMITS_GUIDE_CLOSED)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  private reportEvent(type: FleetAnalyticsEventType): void {
    this.analytics.reportEvent(type);
  }
}
