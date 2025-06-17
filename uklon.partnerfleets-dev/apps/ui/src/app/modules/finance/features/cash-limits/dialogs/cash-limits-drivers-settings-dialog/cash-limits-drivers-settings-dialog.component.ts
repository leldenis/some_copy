import { LowerCasePipe } from '@angular/common';
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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatChip, MatChipListbox, MatChipRemove } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel, MatPrefix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import {
  CashLimitsSettingsDto,
  CashLimitsSettingsPeriod,
  CashLimitType,
  FleetAnalyticsEventType,
  FleetDriversItemDto,
} from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { CashLimitsListComponent } from '@ui/modules/finance/features/cash-limits/components';
import { FullNamePipe, GROW_VERTICAL, removeEmptyParams } from '@ui/shared';
import { InfoPanelComponent } from '@ui/shared/modules/info-panel/components/info-panel/info-panel.component';
import { CurrencySymbolPipe } from '@ui/shared/pipes/currency-symbol/currency-symbol.pipe';
import { NgxMaskDirective } from 'ngx-mask';
import { tap } from 'rxjs/operators';

import { Currency } from '@uklon/types';

interface DialogData {
  settings?: CashLimitsSettingsDto;
  drivers: FleetDriversItemDto[];
  currency: Currency;
  list: CashLimitsListComponent;
}

interface CashLimitsForm {
  amount: FormControl<number>;
  enabled: FormControl<boolean | null>;
}

const LIMIT_TYPE_TO_ENABLED = new Map<CashLimitType, boolean>([
  [CashLimitType.FLEET, null],
  [CashLimitType.INDIVIDUAL, true],
  [CashLimitType.NO_LIMITS, false],
]);
const ENABLED_TO_LIMIT_TYPE = new Map<boolean, CashLimitType>([
  [null, CashLimitType.FLEET],
  [true, CashLimitType.INDIVIDUAL],
  [false, CashLimitType.NO_LIMITS],
]);

@Component({
  selector: 'upf-cash-limits-drivers-settings-dialog',
  standalone: true,
  imports: [
    MatIcon,
    MatIconButton,
    FullNamePipe,
    ReactiveFormsModule,
    MatRadioButton,
    MatRadioGroup,
    MatFormField,
    MatInput,
    MatError,
    MatLabel,
    MatPrefix,
    NgxMaskDirective,
    TranslateModule,
    MatButton,
    MatChip,
    MatChipRemove,
    LowerCasePipe,
    MatChipListbox,
    InfoPanelComponent,
    CurrencySymbolPipe,
  ],
  templateUrl: './cash-limits-drivers-settings-dialog.component.html',
  styleUrl: './cash-limits-drivers-settings-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [GROW_VERTICAL()],
})
export class CashLimitsDriversSettingsDialogComponent implements OnInit {
  @HostBinding('attr.data-cy') private readonly attribute = 'cash-limits-drivers-settings-dialog';

  public readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  public readonly limitPeriod = CashLimitsSettingsPeriod;
  public readonly cashLimitsForm = new FormGroup<CashLimitsForm>({
    amount: new FormControl(null),
    enabled: new FormControl(null),
  });

  public readonly drivers = signal<FleetDriversItemDto[]>([]);
  public readonly driverToBeBlocked = signal<FleetDriversItemDto[]>([]);
  public readonly isSingleDriver = computed(() => this.drivers().length === 1);
  public readonly driversCouldBeBlocked = computed(() => this.driverToBeBlocked().length > 0);

  private readonly destroyRef = inject(DestroyRef);
  private readonly dialogRef = inject(MatDialogRef<CashLimitsDriversSettingsDialogComponent>);
  private readonly analytics = inject(AnalyticsService);

  private get analyticsProps(): Record<string, unknown> {
    return removeEmptyParams({
      type: ENABLED_TO_LIMIT_TYPE.get(this.cashLimitsForm.value.enabled),
      amount: this.cashLimitsForm.value.enabled ? this.cashLimitsForm.value.amount * 100 : null,
      driver_id: this.isSingleDriver() ? this.drivers()[0].id : null,
      drivers_amount: this.isSingleDriver() ? null : this.drivers().length,
    });
  }

  public ngOnInit(): void {
    this.drivers.set(this.data.drivers);
    this.handleAmountValidation();
    this.patchFormValues();
  }

  public onRemoveDriver(driverId: string): void {
    this.drivers.update((drivers) => drivers.filter(({ id }) => id !== driverId));
    this.data.list.toggleDriverSelection(driverId);
  }

  public onSubmit(ignoreBlockedDrivers = false): void {
    const { enabled, amount } = this.cashLimitsForm.getRawValue();

    if (ignoreBlockedDrivers) {
      const eventType = this.isSingleDriver()
        ? FleetAnalyticsEventType.FINANCE_CASH_LIMITS_EDIT_DRIVER_RESTRICTION_WARNING_APPROVE
        : FleetAnalyticsEventType.FINANCE_CASH_LIMITS_BATCH_DRIVERS_EDIT_RESTRICTION_WARNING_APPROVE;
      this.analytics.reportEvent(eventType, this.analyticsProps);
    } else {
      this.driverToBeBlocked.set(this.getDriverToBeBlocked(enabled, amount));

      if (this.driversCouldBeBlocked()) {
        const eventType = this.isSingleDriver()
          ? FleetAnalyticsEventType.FINANCE_CASH_LIMITS_EDIT_DRIVER_RESTRICTION_WARNING
          : FleetAnalyticsEventType.FINANCE_CASH_LIMITS_BATCH_DRIVERS_EDIT_RESTRICTION_WARNING;
        this.analytics.reportEvent(eventType, this.analyticsProps);

        return;
      }
    }

    const result = {
      enabled,
      driver_ids: this.drivers().map(({ id }) => id),
      amount: enabled ? amount * 100 : null,
      type: ENABLED_TO_LIMIT_TYPE.get(enabled),
    };

    this.dialogRef.close(result);
  }

  public onCloseDialog(): void {
    if (this.driversCouldBeBlocked()) {
      const eventType = this.isSingleDriver()
        ? FleetAnalyticsEventType.FINANCE_CASH_LIMITS_EDIT_DRIVER_RESTRICTION_WARNING_CLOSED
        : FleetAnalyticsEventType.FINANCE_CASH_LIMITS_BATCH_DRIVERS_EDIT_RESTRICTION_WARNING_CLOSED;
      this.analytics.reportEvent(eventType, this.analyticsProps);
      this.driverToBeBlocked.set([]);

      return;
    }

    this.dialogRef.close();
  }

  public reportTypeChange(): void {
    const eventType = this.isSingleDriver
      ? FleetAnalyticsEventType.FINANCE_CASH_LIMITS_EDIT_DRIVER_POPUP_TYPE
      : FleetAnalyticsEventType.FINANCE_CASH_LIMITS_BATCH_DRIVERS_EDIT_POPUP_TYPE;
    this.analytics.reportEvent(eventType, this.analyticsProps);
  }

  private patchFormValues(): void {
    const [driver] = this.data.drivers;
    const { type, limit } = driver.cash_limit;

    this.cashLimitsForm.patchValue({ enabled: LIMIT_TYPE_TO_ENABLED.get(type) });

    if (!this.isSingleDriver()) return;

    const amount = limit?.amount > 0 && type === CashLimitType.INDIVIDUAL ? limit.amount / 100 : null;
    this.cashLimitsForm.patchValue({ amount });
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

  private getDriverToBeBlocked(enabled: boolean, amount: number): FleetDriversItemDto[] {
    const limitType = ENABLED_TO_LIMIT_TYPE.get(enabled);

    if (limitType === CashLimitType.NO_LIMITS) return [];

    const targetAmount = limitType === CashLimitType.INDIVIDUAL ? amount * 100 : this.data.settings?.limit.amount;

    return this.drivers().filter(
      ({ cash_limit }) =>
        cash_limit?.type !== CashLimitType.NO_LIMITS && cash_limit?.used_amount.amount >= targetAmount,
    );
  }
}
