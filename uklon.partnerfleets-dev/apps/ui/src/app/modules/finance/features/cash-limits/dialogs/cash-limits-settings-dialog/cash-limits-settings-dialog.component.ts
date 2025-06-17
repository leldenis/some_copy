import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  HostBinding,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatChip, MatChipListbox } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel, MatPrefix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import {
  CashLimitsSettingsDto,
  CashLimitsSettingsPeriod,
  CashLimitType,
  DriverByCashLimitDto,
  FleetAnalyticsEventType,
  PaginationCollectionDto,
} from '@data-access';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { DriverService } from '@ui/core';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { cashLimitsDialogKey, fleetIdKey, StorageService } from '@ui/core/services/storage.service';
import { AccountState } from '@ui/core/store/account/account.reducer';
import { getSelectedFleetCurrency } from '@ui/core/store/account/account.selectors';
import { FullNamePipe, GROW_VERTICAL } from '@ui/shared';
import { InfoPanelComponent } from '@ui/shared/modules/info-panel/components/info-panel/info-panel.component';
import { CurrencySymbolPipe } from '@ui/shared/pipes/currency-symbol/currency-symbol.pipe';
import { NgxMaskDirective } from 'ngx-mask';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

interface CashLimitsForm {
  period: FormControl<CashLimitsSettingsPeriod>;
  amount: FormControl<number>;
  enabled: FormControl<boolean>;
}

interface DialogData {
  settings: CashLimitsSettingsDto | null;
  totalCount: number;
  fleetId: string;
}

@Component({
  selector: 'upf-cash-limits-settings-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatIconButton,
    MatIcon,
    MatRadioGroup,
    MatRadioButton,
    MatFormField,
    MatInput,
    MatLabel,
    NgxMaskDirective,
    MatPrefix,
    ReactiveFormsModule,
    MatButton,
    MatError,
    TranslateModule,
    FullNamePipe,
    MatChip,
    MatChipListbox,
    InfoPanelComponent,
    CurrencySymbolPipe,
  ],
  templateUrl: './cash-limits-settings-dialog.component.html',
  styleUrl: './cash-limits-settings-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [GROW_VERTICAL()],
})
export class CashLimitsSettingsDialogComponent implements OnInit {
  @HostBinding('attr.data-cy') private readonly attribute = 'cash-limits-settings-dialog';

  public readonly periodsOptions = [CashLimitsSettingsPeriod.WEEK, CashLimitsSettingsPeriod.DAY];
  public readonly limitsOptions = [
    {
      value: false,
      description: 'CashLimits.SettingsDialog.NoLimitSubtitle',
    },
    {
      value: true,
      description: 'CashLimits.SettingsDialog.FleetLimitSubtitle',
    },
  ];
  public readonly cashLimitsForm = new FormGroup<CashLimitsForm>({
    period: new FormControl(CashLimitsSettingsPeriod.WEEK),
    amount: new FormControl(null),
    enabled: new FormControl(false),
  });
  public readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  public readonly limitPeriod = CashLimitsSettingsPeriod;
  public readonly currency = toSignal(inject(Store<AccountState>).select(getSelectedFleetCurrency));
  public readonly driverToBeBlocked = signal<DriverByCashLimitDto[]>([]);
  public readonly driversCouldBeBlocked = computed(() => this.driverToBeBlocked().length > 0);

  private readonly storage = inject(StorageService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialogRef = inject(MatDialogRef);
  private readonly driversService = inject(DriverService);
  private readonly analytics = inject(AnalyticsService);

  public ngOnInit(): void {
    this.setDialogAlreadyOpened();
    this.patchFormValues();
    this.handleAmountValidation();
  }

  public onSubmit(ignoreBlockedDrivers = false): void {
    if (ignoreBlockedDrivers) {
      this.reportDriversToBeBlocked(FleetAnalyticsEventType.FINANCE_CASH_LIMITS_EDITING_RESTRICTION_WARNING_APPROVE);
    }

    if (
      ignoreBlockedDrivers ||
      this.data.totalCount === 0 ||
      !this.cashLimitsForm.value.enabled ||
      this.data.settings?.period !== this.cashLimitsForm.controls.period.value
    ) {
      this.dialogRef.close(this.cashLimitsForm.getRawValue());
      return;
    }

    this.getDriversToBeBlocked()
      .pipe(
        tap(() => {
          if (this.driversCouldBeBlocked()) return;
          this.dialogRef.close(this.cashLimitsForm.getRawValue());
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  public onCloseDialog(): void {
    if (this.driversCouldBeBlocked()) {
      this.reportDriversToBeBlocked(FleetAnalyticsEventType.FINANCE_CASH_LIMITS_EDITING_RESTRICTION_WARNING_CLOSED);
      this.driverToBeBlocked.set([]);
      return;
    }

    this.dialogRef.close();
  }

  public reportPeriodChange(period: CashLimitsSettingsPeriod): void {
    this.analytics.reportEvent(FleetAnalyticsEventType.FINANCE_CASH_LIMITS_PERIOD_SETTINGS, {
      period,
      action: this.data.settings ? 'edit' : 'setup',
    });
  }

  public reportTypeChange(value: boolean): void {
    this.analytics.reportEvent(FleetAnalyticsEventType.FINANCE_CASH_LIMITS_TYPE_SETTINGS, {
      type: value ? 'FleetLimit' : 'NoLimit',
      action: this.data.settings ? 'edit' : 'setup',
    });
  }

  private setDialogAlreadyOpened(): void {
    const fleetId = this.storage.get(fleetIdKey);
    const currentFleet = { [fleetId]: true };
    const openedDialogsFleet = this.storage.get<Record<string, boolean>>(cashLimitsDialogKey);

    this.storage.set(cashLimitsDialogKey, { ...openedDialogsFleet, ...currentFleet });
  }

  private handleAmountValidation(): void {
    const control = this.cashLimitsForm.controls.amount;

    this.cashLimitsForm.controls.enabled.valueChanges
      .pipe(
        tap((enabled) => {
          enabled ? control.addValidators([Validators.required, Validators.min(1)]) : control.clearValidators();
          control.updateValueAndValidity();
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  private patchFormValues(): void {
    if (!this.data.settings) return;

    this.cashLimitsForm.patchValue({
      ...this.data.settings,
      amount: this.data.settings.limit.amount > 0 ? this.data.settings.limit.amount / 100 : null,
    });
  }

  private getDriversToBeBlocked(): Observable<PaginationCollectionDto<DriverByCashLimitDto>> {
    return this.driversService
      .getDriversByCashLimit(this.data.fleetId, {
        limit: this.data.totalCount,
        cash_limit_type: CashLimitType.FLEET,
        from: this.cashLimitsForm.value.amount * 100,
      })
      .pipe(
        tap(({ items }) => {
          this.driverToBeBlocked.set(items);
          this.reportDriversToBeBlocked(FleetAnalyticsEventType.FINANCE_CASH_LIMITS_EDITING_RESTRICTION_WARNING);
        }),
        catchError(() => of({ total_count: 0, items: [] })),
      );
  }

  private reportDriversToBeBlocked(type: FleetAnalyticsEventType): void {
    this.analytics.reportEvent(type, {
      type: 'FleetLimit',
      amount: this.cashLimitsForm.value.amount,
      drivers_amount: this.driverToBeBlocked().length,
    });
  }
}
