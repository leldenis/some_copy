import { FocusMonitor } from '@angular/cdk/a11y';
import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { RouterLink } from '@angular/router';
import { EmployeeWalletItemDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { CorePaths } from '@ui/core/models/core-paths';
import { CourierPaths } from '@ui/modules/couriers/models/courier-paths';
import { BalanceChangeDto, DriverBalanceChangeDto } from '@ui/modules/finance/models';
import { MAT_FORM_FIELD_IMPORTS } from '@ui/shared';
import { SortIconComponent } from '@ui/shared/components/sort-icon/sort-icon.component';
import { RTL_CURRENCIES } from '@ui/shared/consts/rtl-currencies.const';
import { LetDirective } from '@ui/shared/directives/let.directive';
import { CurrencySymbolPipe } from '@ui/shared/pipes/currency-symbol/currency-symbol.pipe';
import { MoneyPipe } from '@ui/shared/pipes/money';
import { NgxMaskDirective } from 'ngx-mask';
import { NgxTippyModule } from 'ngx-tippy-wrapper';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';

const BALANCE_DIVIDER = 100;
const DEBOUNCE_MS = 100;
const ROUND_DECIMALS = (value: number): number => Math.round(value * BALANCE_DIVIDER) / BALANCE_DIVIDER;

@Component({
  selector: 'upf-couriers-wallets-list',
  standalone: true,
  imports: [
    MAT_FORM_FIELD_IMPORTS,
    MatSort,
    MatSortHeader,
    TranslateModule,
    SortIconComponent,
    ReactiveFormsModule,
    MatCheckbox,
    MatIcon,
    NgxTippyModule,
    NgClass,
    MatInput,
    NgxMaskDirective,
    CurrencySymbolPipe,
    RouterLink,
    MoneyPipe,
    MatDivider,
    LetDirective,
  ],
  templateUrl: './couriers-wallets-list.component.html',
  styleUrls: ['./couriers-wallets-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CouriersWalletsListComponent implements OnInit {
  @ViewChild('withdrawInput', { read: ElementRef<HTMLInputElement> })
  public withdrawInput: ElementRef<HTMLInputElement>;

  @ViewChild(MatSort, { static: true })
  public sort: MatSort;

  @Input() public fleetCurrency: string;

  @Input() public set wallets(wallets: EmployeeWalletItemDto[]) {
    this.couriersWallets = wallets;
    this.initForm(wallets);
  }

  @Output() public sortChange = new EventEmitter<Partial<MatSort>>();
  @Output() public totalSumChange = new EventEmitter<number>();
  @Output() public balancesChange = new EventEmitter<BalanceChangeDto>();
  @Output() public withdrawEverythingEnabled = new EventEmitter<boolean>();

  public couriersWallets: EmployeeWalletItemDto[];

  public readonly corePath = CorePaths;
  public readonly courierPath = CourierPaths;
  public readonly rtlCurrencies = RTL_CURRENCIES;
  public readonly withdrawalForm = new FormGroup({
    withdrawEverythin: new FormControl<boolean>(false),
    withdrawAmount: new FormControl<string>({ value: null, disabled: true }),
    wallets: new FormArray([]),
  });
  public readonly walletsForm = new FormGroup({});

  private readonly destroyRef = inject(DestroyRef);

  constructor(private readonly focusMonitor: FocusMonitor) {}

  public get walletsArray(): FormArray {
    return this.withdrawalForm.get('wallets') as FormArray;
  }

  public get withdrawEverythingControl(): FormControl<boolean> {
    return this.withdrawalForm.get('withdrawEverythin') as FormControl;
  }

  public ngOnInit(): void {
    this.handleFocus();
    this.handleWithdrawal();
    this.handleBalanceWithdrawal();
  }

  private handleWithdrawal(): void {
    this.withdrawalForm
      .get('withdrawAmount')
      .valueChanges.pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((value) => value !== null),
        debounceTime(DEBOUNCE_MS),
        distinctUntilChanged(),
      )
      .subscribe((value) => {
        if (value === '') {
          this.walletsArray.controls.forEach((control) => control.setValue(null));
          return;
        }

        this.walletsArray.controls.forEach((control, index) => {
          const balance = this.couriersWallets[index].wallet.balance.amount / BALANCE_DIVIDER;
          const diff = balance - Number(value);
          control.setValue(diff > 0 ? ROUND_DECIMALS(diff) : 0);
        });
      });
  }

  private initForm(wallets: EmployeeWalletItemDto[]): void {
    while (this.walletsArray.length > 0) this.walletsArray.removeAt(0, { emitEvent: false });
    wallets.forEach((_, index) => this.walletsArray.setControl(index, new FormControl(null)));

    this.withdrawalForm.patchValue({
      withdrawEverythin: this.withdrawEverythingControl.value,
      withdrawAmount: null,
    });
  }

  private handleFocus(): void {
    const amountCountrol = this.withdrawalForm.get('withdrawAmount');

    this.withdrawEverythingControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((enabled) => {
      this.withdrawEverythingEnabled.emit(enabled);
      this.walletsArray.controls.forEach((control) => control.setValue(null));

      if (enabled) {
        amountCountrol.enable();
        this.walletsArray.disable();
        setTimeout(() => this.focusMonitor.focusVia(this.withdrawInput, 'program'));
      } else {
        amountCountrol.reset(null);
        amountCountrol.disable();
        this.walletsArray.enable();
      }
    });
  }

  private handleBalanceWithdrawal(): void {
    this.walletsArray.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef), debounceTime(1))
      .subscribe((balances: number[]) => {
        let total = 0;
        let changes: DriverBalanceChangeDto[] = [];

        balances.forEach((balance, index) => {
          total += balance || 0;
          changes = [...changes, { amount: balance * BALANCE_DIVIDER, driver: this.couriersWallets[index] }];
        });

        this.totalSumChange.emit(total);
        this.balancesChange.emit({ total: total * BALANCE_DIVIDER, changes });
      });
  }
}
