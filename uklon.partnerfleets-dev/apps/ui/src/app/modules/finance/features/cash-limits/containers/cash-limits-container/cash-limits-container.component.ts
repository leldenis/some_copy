import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  signal,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import {
  CashLimitsDriversSettingsUpdateDto,
  CashLimitsSettingsDto,
  CashLimitsSettingsUpdateDto,
  FleetAnalyticsEventType,
  FleetDriversItemDto,
} from '@data-access';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { DriverService } from '@ui/core/services/datasource/driver.service';
import { cashLimitsDialogKey, StorageService } from '@ui/core/services/storage.service';
import { ToastService } from '@ui/core/services/toast.service';
import { AccountState } from '@ui/core/store/account/account.reducer';
import { getSelectedFleetCurrency } from '@ui/core/store/account/account.selectors';
import { DriversFilterDto } from '@ui/modules/drivers/models';
import {
  CashLimitsFiltersComponent,
  CashLimitsInfoDialogTriggerComponent,
  CashLimitsInfoPanelComponent,
  CashLimitsListComponent,
} from '@ui/modules/finance/features/cash-limits/components';
import {
  CashLimitsDriversSettingsDialogComponent,
  CashLimitsSettingsDialogComponent,
} from '@ui/modules/finance/features/cash-limits/dialogs';
import { FinanceService } from '@ui/modules/finance/services';
import { removeEmptyParams, UIService } from '@ui/shared';
import { EmptyStateComponent } from '@ui/shared/components/empty-state/empty-state.component';
import { EmptyStates } from '@ui/shared/components/empty-state/empty-states';
import { DEFAULT_LIMIT } from '@ui/shared/consts';
import { BehaviorSubject, finalize, merge, Observable, of, scan, switchMap, throwError } from 'rxjs';
import { catchError, filter, map, tap } from 'rxjs/operators';

@Component({
  selector: 'upf-cash-limits-container',
  standalone: true,
  imports: [
    CashLimitsListComponent,
    MatButton,
    CashLimitsInfoPanelComponent,
    TranslateModule,
    CashLimitsInfoDialogTriggerComponent,
    AsyncPipe,
    CashLimitsFiltersComponent,
    EmptyStateComponent,
  ],
  templateUrl: './cash-limits-container.component.html',
  styleUrl: './cash-limits-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashLimitsContainerComponent {
  @ViewChild(CashLimitsListComponent) public list: CashLimitsListComponent;

  public readonly fleetId = input.required<string>();
  public readonly settings = input.required<CashLimitsSettingsDto | null>();

  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  private readonly financeService = inject(FinanceService);
  private readonly storageService = inject(StorageService);
  private readonly toastsService = inject(ToastService);
  private readonly translateService = inject(TranslateService);
  private readonly driversService = inject(DriverService);
  private readonly uiService = inject(UIService);
  private readonly analytics = inject(AnalyticsService);

  public readonly isLoading = signal(true);
  public readonly offset = signal(0);
  public readonly limit = signal(DEFAULT_LIMIT);
  public readonly totalCount = signal(0);
  public readonly filters = signal<DriversFilterDto>(null);
  public readonly updatedSettings = signal<CashLimitsSettingsDto>(null);
  public readonly currency = toSignal(inject(Store<AccountState>).select(getSelectedFleetCurrency));
  public readonly cashLimitsSettings = computed(() => this.updatedSettings() ?? this.settings());
  public readonly hasNext = computed(() => this.totalCount() > this.offset() + DEFAULT_LIMIT);

  public readonly emptyState = EmptyStates;
  public readonly isMobileView$ = this.uiService.breakpointMatch();
  public readonly loadNext$ = new BehaviorSubject<boolean>(false);
  public readonly drivers$ = merge(toObservable(this.filters), toObservable(this.updatedSettings), this.loadNext$).pipe(
    filter(Boolean),
    switchMap(() => this.getDrivers()),
    scan((acc, val) => (this.loadNext$.getValue() ? [...acc, ...val] : val)),
    takeUntilDestroyed(this.destroyRef),
  );

  constructor() {
    effect(() => {
      if (this.settings()) return;

      if (this.dialogNotOpenedYet) {
        this.openDialog(true);
      }
    });
  }

  private get dialogNotOpenedYet(): boolean {
    const fleetsMap = this.storageService.get<Record<string, boolean>>(cashLimitsDialogKey);
    return !fleetsMap?.[this.fleetId()];
  }

  public openDialog(onFirstVisit = false): void {
    if (!onFirstVisit) {
      this.analytics.reportEvent(FleetAnalyticsEventType.FINANCE_CASH_LIMITS_SETTINGS_BUTTON_CLICK, {
        action: this.cashLimitsSettings() ? 'edit' : 'setup',
      });
    }

    this.dialog
      .open<CashLimitsSettingsDialogComponent, any, CashLimitsSettingsUpdateDto>(CashLimitsSettingsDialogComponent, {
        autoFocus: false,
        panelClass: 'mat-dialog-no-padding',
        data: { settings: this.cashLimitsSettings(), totalCount: this.totalCount(), fleetId: this.fleetId() },
      })
      .afterClosed()
      .pipe(
        tap((settings) => {
          if (settings) return;
          this.analytics.reportEvent(FleetAnalyticsEventType.FINANCE_CASH_LIMITS_SETTINGS_CLOSED, {
            action: this.cashLimitsSettings() ? 'edit' : 'setup',
          });
        }),
        filter(Boolean),
        switchMap((settings) => this.updateCashLimitsSettings(settings)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  public onLoadNext(): void {
    if (!this.hasNext() || this.isLoading()) return;

    this.offset.update((offset) => offset + DEFAULT_LIMIT);
    this.loadNext$.next(true);
  }

  public onFiltersChange(filters: DriversFilterDto): void {
    this.loadNext$.next(false);
    this.offset.set(0);
    this.filters.set(filters);
  }

  public onEditDriversLimits(drivers: FleetDriversItemDto[]): void {
    this.dialog
      .open<CashLimitsDriversSettingsDialogComponent, any, CashLimitsDriversSettingsUpdateDto>(
        CashLimitsDriversSettingsDialogComponent,
        {
          autoFocus: false,
          panelClass: 'mat-dialog-no-padding',
          data: {
            drivers,
            currency: this.currency(),
            settings: this.cashLimitsSettings(),
            list: this.list,
          },
        },
      )
      .afterClosed()
      .pipe(
        tap((result) => {
          if (!result) {
            const eventType =
              drivers.length > 1
                ? FleetAnalyticsEventType.FINANCE_CASH_LIMITS_BATCH_DRIVERS_EDIT_POPUP_CLOSED
                : FleetAnalyticsEventType.FINANCE_CASH_LIMITS_EDIT_DRIVER_POPUP_CLOSED;
            const props = removeEmptyParams({
              driver_id: drivers.length > 1 ? null : drivers[0].id,
              drivers_amount: drivers.length > 1 ? drivers.length : null,
            });
            this.analytics.reportEvent(eventType, props);
          }
          this.list?.clearSelection();
        }),
        filter(Boolean),
        switchMap((settings) => this.updateDriversCashLimitSettings(settings)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  private getDrivers(): Observable<FleetDriversItemDto[]> {
    this.isLoading.set(true);

    return this.driversService.getFleetDrivers(this.fleetId(), this.filters(), this.limit(), this.offset()).pipe(
      tap(({ total_count }) => {
        this.totalCount.set(total_count);
        if (!this.loadNext$.getValue()) this.list?.clearSelection();
      }),
      map(({ items }) => items),
      finalize(() => this.isLoading.set(false)),
      catchError(() => of([])),
    );
  }

  private updateCashLimitsSettings({
    amount,
    period,
    enabled,
  }: CashLimitsSettingsUpdateDto): Observable<CashLimitsSettingsDto> {
    const settings = {
      period,
      enabled,
      amount: enabled && amount ? amount * 100 : null,
    };
    const analyticsProps = { period, type: enabled ? 'FleetLimit' : 'NoLimit', amount };

    return this.financeService.updateCashLimitsSettings(this.fleetId(), settings).pipe(
      map(() => ({
        period,
        enabled,
        limit: { amount: settings.amount, currency: this.cashLimitsSettings()?.limit?.currency ?? this.currency() },
      })),
      tap((updatedSettings) => {
        this.loadNext$.next(false);
        this.offset.set(0);
        this.updatedSettings.set(updatedSettings);
        this.toastsService.success(this.translateService.instant('CashLimits.Notifications.SettingsSaved'));
        this.analytics.reportEvent(FleetAnalyticsEventType.FINANCE_CASH_LIMITS_SETTING_SAVE, {
          ...removeEmptyParams(analyticsProps),
          action: this.cashLimitsSettings() ? 'edit' : 'setup',
        });
      }),
      catchError((error) => {
        this.toastsService.error(this.translateService.instant('Common.Error.TryLater'));
        this.analytics.reportEvent(FleetAnalyticsEventType.FINANCE_CASH_LIMITS_SETTING_SAVE, {
          ...removeEmptyParams({
            ...analyticsProps,
            error_code: error?.status,
            error_text: error?.statusText,
          }),
          action: this.cashLimitsSettings() ? 'edit' : 'setup',
        });
        return throwError(() => error);
      }),
    );
  }

  private updateDriversCashLimitSettings({
    amount,
    enabled,
    driver_ids,
    type,
  }: CashLimitsDriversSettingsUpdateDto): Observable<void> {
    const settings = {
      enabled,
      driver_ids,
      amount: enabled && amount ? amount : null,
    };
    const eventType =
      driver_ids.length > 1
        ? FleetAnalyticsEventType.FINANCE_CASH_LIMITS_BATCH_DRIVERS_EDIT_POPUP_SAVE
        : FleetAnalyticsEventType.FINANCE_CASH_LIMITS_EDIT_DRIVER_POPUP_SAVE;
    const props = removeEmptyParams({
      type,
      amount,
      driver_id: driver_ids.length > 1 ? null : driver_ids[0],
      drivers_amount: driver_ids.length > 1 ? driver_ids.length : null,
    });

    return this.financeService.updateDriversCashLimitsSettings(this.fleetId(), settings).pipe(
      tap(() => {
        this.onFiltersChange({ ...this.filters() });
        this.toastsService.success(this.translateService.instant('CashLimits.Notifications.SettingsSaved'));
        this.analytics.reportEvent(eventType, props);
      }),
      catchError((error) => {
        this.toastsService.error(this.translateService.instant('Common.Error.TryLater'));
        this.analytics.reportEvent(eventType, {
          ...props,
          error_code: error?.status,
          error_text: error?.statusText,
        });
        return throwError(() => error);
      }),
    );
  }
}
