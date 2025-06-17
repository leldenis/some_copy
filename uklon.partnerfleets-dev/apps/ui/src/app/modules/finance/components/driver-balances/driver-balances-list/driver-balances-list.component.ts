import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import { SelectionModel } from '@angular/cdk/collections';
import { BreakpointObserver } from '@angular/cdk/layout';
import { NgClass } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormArray, FormControl, FormControlState, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { RouterLink } from '@angular/router';
import { AnalyticsUserRole, AnalyticsWihdrawMoney, EmployeeWalletItemDto, FleetAnalyticsEventType } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { CorePaths } from '@ui/core/models/core-paths';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { StorageService, userRoleKey } from '@ui/core/services/storage.service';
import { DriverPaths } from '@ui/modules/drivers/models/driver-paths';
import { MAT_TABLE_IMPORTS } from '@ui/shared';
import { SortIconComponent } from '@ui/shared/components/sort-icon/sort-icon.component';
import { RTL_CURRENCIES } from '@ui/shared/consts/rtl-currencies.const';
import { CurrencySymbolPipe } from '@ui/shared/pipes/currency-symbol/currency-symbol.pipe';
import { MoneyPipe } from '@ui/shared/pipes/money';
import { ICONS } from '@ui/shared/tokens';
import { NgxMaskDirective } from 'ngx-mask';
import { NgxTippyModule } from 'ngx-tippy-wrapper';
import { delay, Subject, takeUntil } from 'rxjs';

import { BalanceChangeDto, DriverBalanceChangeDto, WithdrawalChangeDto } from '../../../models';

interface DriverBalanceWithdrawalForm {
  remaining: FormControl<number>;
  isWithdrawAll: FormControl<boolean>;
  withdrawals: FormArray<FormControl<number>>;
}

const MONEY_MULTIPLIER = 100;

@Component({
  selector: 'upf-driver-balances-list',
  standalone: true,
  imports: [
    MAT_TABLE_IMPORTS,
    MatSort,
    ReactiveFormsModule,
    MatCheckbox,
    TranslateModule,
    NgxTippyModule,
    MatFormFieldModule,
    NgxMaskDirective,
    RouterLink,
    NgClass,
    SortIconComponent,
    MoneyPipe,
    CurrencySymbolPipe,
    MatInput,
    MatIcon,
    MatLabel,
    MatSortHeader,
  ],
  templateUrl: './driver-balances-list.component.html',
  styleUrls: ['./driver-balances-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriverBalancesListComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @ViewChild(MatInput, { read: ElementRef<HTMLInputElement> })
  public remainingInputRef: ElementRef<HTMLInputElement>;

  @ViewChild(MatSort, { static: true })
  public sort: MatSort;

  @Input() public drivers: EmployeeWalletItemDto[] = [];
  @Input() public driversCurrency: string;
  @Input() public fleetCurrency: string;
  @Input() public maxWithdrawalAmountToFleet: number;
  @Input() public maxWithdrawalAmountToDrivers: number;
  @Input({ transform: coerceBooleanProperty }) public walletTransfersAllowed: boolean;

  @Output() public readonly withdrawalChange = new EventEmitter<WithdrawalChangeDto | undefined>();
  @Output() public sortChange = new EventEmitter<Partial<MatSort>>();

  public readonly selection = new SelectionModel<number>(true);
  public readonly rtlCurrencies = RTL_CURRENCIES;

  public withdrawAllColumns = ['IsWithdrawAll', 'Remaining'];
  public formGroup: FormGroup<DriverBalanceWithdrawalForm>;
  public isMobileView: boolean;
  public readonly corePaths = CorePaths;
  public readonly driverPaths = DriverPaths;

  public readonly icons = inject(ICONS);
  private readonly focusMonitor = inject(FocusMonitor);
  private readonly observer = inject(BreakpointObserver);
  private readonly analytics = inject(AnalyticsService);
  private readonly storage = inject(StorageService);

  private readonly destroyed$ = new Subject<void>();

  public get userRole(): string {
    return this.storage.get(userRoleKey) || '';
  }

  public get columns(): string[] {
    return this.walletTransfersAllowed
      ? ['Driver', 'Signal', 'Balance', 'Sum', 'Divider']
      : ['Driver', 'Signal', 'Balance', 'Divider'];
  }

  public ngOnInit(): void {
    this.setFormGroup();
    this.onSort();
  }

  public ngOnChanges({ drivers }: SimpleChanges): void {
    if (drivers?.currentValue) {
      this.setFormGroup();
      this.onSort();
    }
  }

  public ngAfterViewInit(): void {
    this.observer
      .observe(['(max-width: 639px)'])
      .pipe(delay(1), takeUntil(this.destroyed$))
      .subscribe(({ matches }) => {
        this.isMobileView = matches;
      });
  }

  public ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  public markAsPristine(): void {
    this.selection.clear();

    if (this.formGroup) {
      this.formGroup.reset();
    }
  }

  public isFirstRow(index: number): boolean {
    return index === 0;
  }

  public noTopBorder(index: number): boolean {
    if (!this.selection.isSelected(index) || this.isMobileView) return false;
    return this.selection.isSelected(index - 1);
  }

  public handleRemainingChange(): void {
    const remainingControl = this.formGroup.get(['remaining']) as FormControl<number>;

    if (remainingControl.disabled || remainingControl.pristine) {
      return;
    }

    const withdrawals = this.formGroup.get(['withdrawals']) as FormArray<FormControl<number>>;
    const withdraw =
      `${remainingControl.value}` === '' ? null : coerceNumberProperty(remainingControl.value * MONEY_MULTIPLIER, 0);

    withdrawals.controls.forEach((control, index: number) => {
      this.setWithdrawFromDriverBalance(control, withdraw, index);
    });

    this.emitBalancesChange();
  }

  public handleDriverWalletAmountChange(index: number): void {
    const amountControl = this.formGroup.get(['withdrawals', index]);

    if (amountControl.pristine) {
      return;
    }

    const amount = Math.round((amountControl.value || 0) * MONEY_MULTIPLIER);
    const balance = this.getDriverBalance(index);
    const remaining = balance - amount;

    if (remaining >= 0 && amount !== 0) {
      this.selection.select(index);
    } else {
      this.selection.deselect(index);
    }

    this.emitBalancesChange();
  }

  public handleIsWithdrawAllChange({ checked }: MatCheckboxChange): void {
    const remainingControl = this.formGroup.get(['remaining']);
    remainingControl.reset({ value: null, disabled: !checked });
    this.setAllDriversWalletAmountState({ value: null, disabled: checked });
    this.resetBalanceChanges();

    if (!checked) {
      return;
    }

    this.reportUserRole(FleetAnalyticsEventType.FINANCE_DRIVER_BALANCES_WITHDRAW_ALL_CHECKBOX);
    setTimeout(() => {
      this.focusMonitor.focusVia(this.remainingInputRef.nativeElement, 'program');
    });
  }

  public shouldShowPrefix(value: string): boolean {
    return (
      this.formGroup.value.isWithdrawAll &&
      `${this.formGroup.value.remaining}` !== '' &&
      value.length > 0 &&
      value !== '0' &&
      value !== '-0'
    );
  }

  public reportUserRole(eventType: FleetAnalyticsEventType): void {
    this.analytics.reportEvent<AnalyticsUserRole>(eventType, {
      user_access: this.userRole,
    });
  }

  public reportWithdrawalSum(): void {
    if (!this.formGroup.value.remaining) return;

    this.analytics.reportEvent<AnalyticsWihdrawMoney>(
      FleetAnalyticsEventType.FINANCE_DRIVER_BALANCES_WITHDRAW_ALL_INPUT_SUM,
      {
        user_access: this.userRole,
        withdraw_sum: this.formGroup.value.remaining,
      },
    );
  }

  private onSort(): void {
    this.sort.sortChange
      .pipe(takeUntil(this.destroyed$))
      .subscribe(({ active, direction }) => this.sortChange.emit({ active, direction }));
  }

  private resetBalanceChanges(): void {
    this.selection.clear();
    this.withdrawalChange.emit();
  }

  private emitBalancesChange(): void {
    const maxWithdrawalAmountForFleet = this.maxWithdrawalAmountToFleet;
    const maxWithdrawalAmountForDrivers = this.maxWithdrawalAmountToDrivers;
    let toFleetChanges: DriverBalanceChangeDto[] = [];
    let toDriversChanges: DriverBalanceChangeDto[] = [];
    let toFleetAmount = 0;
    let toDriversAmount = 0;
    let withdrawalAmount = 0;

    const withdrawals = this.formGroup.get(['withdrawals']) as FormArray<FormControl<number>>;

    withdrawals.controls.forEach((control, index) => {
      const amount = Math.round(coerceNumberProperty(control.value * MONEY_MULTIPLIER, 0));
      const driver = this.drivers[index];

      if (this.selection.isSelected(index)) {
        toFleetChanges.push({ amount, driver });
        toFleetAmount += amount;
      }

      if (amount !== 0) {
        toDriversChanges.push({ amount, driver });
        toDriversAmount += amount;
        withdrawalAmount += amount;
      }
    });

    if (toFleetAmount > maxWithdrawalAmountForFleet) {
      toFleetAmount = 0;
      toFleetChanges = [];
    }

    const { isWithdrawAll } = this.formGroup.value;

    if (isWithdrawAll || toDriversAmount > maxWithdrawalAmountForDrivers) {
      toDriversAmount = 0;
      toDriversChanges = [];
    }

    const toDrivers: BalanceChangeDto = {
      total: toDriversAmount,
      maxAmount: maxWithdrawalAmountForDrivers,
      changes: toDriversChanges,
    };

    const toFleet: BalanceChangeDto = {
      total: toFleetAmount,
      maxAmount: maxWithdrawalAmountForFleet,
      changes: toFleetChanges,
    };

    this.withdrawalChange.emit({
      total: withdrawalAmount,
      toDrivers,
      toFleet,
    });
  }

  private setAllDriversWalletAmountState(state: FormControlState<number>): void {
    const withdrawals = this.formGroup.get(['withdrawals']) as FormArray<
      FormControl<number | FormControlState<number>>
    >;

    const values = withdrawals.value.map(() => state);

    withdrawals.reset(values);
  }

  private setWithdrawFromDriverBalance(
    amountControl: FormControl<number>,
    withdraw: number | null,
    index: number,
  ): void {
    const options = {
      onlySelf: true,
      emitEvent: false,
      emitViewToModelChange: false,
    };

    if (withdraw === null) {
      amountControl.setValue(null, options);
      this.selection.deselect(index);
      return;
    }

    const balance = this.getDriverBalance(index);

    const remaining = balance - withdraw;

    if (remaining > 0) {
      const newAmount = coerceNumberProperty(remaining / MONEY_MULTIPLIER, 0);
      amountControl.setValue(newAmount, options);
      this.selection.select(index);
    } else {
      amountControl.setValue(0, options);
      this.selection.deselect(index);
    }
  }

  private getDriverBalance(index: number): number {
    return coerceNumberProperty(this.drivers[index]?.wallet?.balance?.amount, 0);
  }

  private setFormGroup(): void {
    this.selection.clear();
    const withdrawals = Array.from({ length: this.drivers.length }, () => new FormControl<number>(null));

    this.formGroup = new FormGroup<DriverBalanceWithdrawalForm>({
      remaining: new FormControl({ value: null, disabled: true }),
      isWithdrawAll: new FormControl(false),
      withdrawals: new FormArray(withdrawals),
    });
  }
}
