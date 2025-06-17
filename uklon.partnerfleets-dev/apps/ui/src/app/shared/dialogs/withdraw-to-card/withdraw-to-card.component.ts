import { AsyncPipe, NgClass, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, Inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAnchor, MatButton, MatIconButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import {
  DictionaryDto,
  MoneyDto,
  TransactionErrorCode,
  TransactionStatus,
  TransactionStatusDto,
  WalletToCardTransferSettingsDto,
} from '@data-access';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastService } from '@ui/core/services/toast.service';
import { AppState } from '@ui/core/store/app.state';
import { financialAuthLink } from '@ui/core/store/root/root.selectors';
import { FinanceService } from '@ui/modules/finance/services';
import { financeActions, FinanceState } from '@ui/modules/finance/store';
import { UIService } from '@ui/shared';
import { CURRENCY_INTL } from '@ui/shared/consts';
import { RTL_CURRENCIES } from '@ui/shared/consts/rtl-currencies.const';
import { DetectHeightDirective } from '@ui/shared/directives/detect-height.directive';
import { LetDirective } from '@ui/shared/directives/let.directive';
import { InfoPanelComponent } from '@ui/shared/modules/info-panel/components/info-panel/info-panel.component';
import { InfoPanelSubtitleDirective, InfoPanelTitleDirective } from '@ui/shared/modules/info-panel/directives';
import { CurrencySymbolPipe } from '@ui/shared/pipes/currency-symbol/currency-symbol.pipe';
import { MoneyPipe } from '@ui/shared/pipes/money';
import { IconsConfig } from '@ui/shared/tokens/icons.config';
import { ICONS } from '@ui/shared/tokens/icons.token';
import { GROW_VERTICAL } from '@ui/shared/utils';
import { itnNumberValidator } from '@ui/shared/utils/validators/itn-number-validator';
import { NgxMaskDirective } from 'ngx-mask';
import { BehaviorSubject, filter, map, merge, Observable, switchMap, timer } from 'rxjs';

import { uuidv4 } from '@uklon/angular-core';

type TimerCount = 'first' | 'second';

interface WithdrawalRegionConfiguration {
  min: number;
  max: number;
  maxAttempts: number;
  maxAmountPerCard: number;
  currency: string;
}

interface DialogData {
  balance: MoneyDto;
  pan: string;
  region: DictionaryDto;
  tinRefused: boolean;
  fleetId?: string;
  transferSettings?: WalletToCardTransferSettingsDto;
}

const BALANCE_MULTIPLIER = 100;
const HEADER_FOOTER_HEIGHT = 220;

@Component({
  selector: 'upf-withdraw-to-card',
  standalone: true,
  imports: [
    LetDirective,
    TranslateModule,
    AsyncPipe,
    MatIcon,
    MatIconButton,
    DetectHeightDirective,
    NgTemplateOutlet,
    MatFormField,
    MatInput,
    ReactiveFormsModule,
    NgxMaskDirective,
    MoneyPipe,
    NgClass,
    MatButton,
    MatProgressSpinner,
    InfoPanelComponent,
    InfoPanelTitleDirective,
    InfoPanelSubtitleDirective,
    MatAnchor,
    MatLabel,
    MatError,
    CurrencySymbolPipe,
  ],
  templateUrl: './withdraw-to-card.component.html',
  styleUrls: ['./withdraw-to-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [GROW_VERTICAL()],
})
export class WithdrawToCardComponent implements OnInit {
  public readonly rtlCurrencies = RTL_CURRENCIES;
  public readonly showPendingTransactionDialog$ = new BehaviorSubject<boolean>(false);
  public readonly showTransactionErrorDialog$ = new BehaviorSubject<boolean>(false);
  public readonly financialAuthLink$ = this.store.select(financialAuthLink);
  public readonly isMobileView$: Observable<boolean> = this.uiService.breakpointMatchWidthHeight();
  public readonly headerFooterHeight = HEADER_FOOTER_HEIGHT;

  public transactionInProgress: boolean;
  public config: WithdrawalRegionConfiguration;
  public amountControl: FormControl<number> = new FormControl<number>(null, [
    Validators.required,
    Validators.max(this.data.balance.amount / BALANCE_MULTIPLIER),
  ]);
  public TINControl: FormControl<string> = new FormControl<string>(null, [
    Validators.required,
    Validators.minLength(10),
    Validators.maxLength(10),
    itnNumberValidator(),
  ]);

  public passportControl: FormControl<string> = new FormControl<string>(null, [Validators.required]);

  constructor(
    private readonly dialogRef: MatDialogRef<WithdrawToCardComponent>,
    private readonly translateService: TranslateService,
    private readonly store: Store<AppState | FinanceState>,
    private readonly financeService: FinanceService,
    private readonly toastService: ToastService,
    private readonly destroyRef: DestroyRef,
    private readonly uiService: UIService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    @Inject(ICONS) public icons: IconsConfig,
  ) {}

  public get showPassportField(): boolean {
    return this.data.tinRefused;
  }

  public get actualFormControl(): FormControl<string> {
    return this.showPassportField ? this.passportControl : this.TINControl;
  }

  public ngOnInit(): void {
    this.initConfig();
  }

  public onAcceptClick(): void {
    if (this.transactionInProgress) return;

    const payload: MoneyDto = {
      amount: +(this.amountControl.value * BALANCE_MULTIPLIER).toFixed(0),
      currency: this.data.balance.currency,
      tax_id_number: this.data.tinRefused ? this.passportControl.value : this.TINControl.value,
    };

    this.handleTransaction(payload).subscribe((status) => this.handleTransactionStatusResponse(status, payload));
  }

  public onCancelClick(): void {
    this.dialogRef.close();
  }

  private handleTransaction(body: MoneyDto): Observable<TransactionStatusDto> {
    this.transactionInProgress = true;
    this.showPassportField ? this.passportControl.disable() : this.TINControl.disable();
    this.amountControl.disable();

    this.store.dispatch(
      financeActions.withdrawToCard({
        fleetId: this.data.fleetId,
        transferId: uuidv4(),
        body,
      }),
    );

    return merge(timer(5000), timer(30_000)).pipe(
      takeUntilDestroyed(this.destroyRef),
      switchMap((_, index) => this.getTransactionStatus(index)),
    );
  }

  private initConfig(): void {
    const currency: string = this.translateService.instant(CURRENCY_INTL.get(this.data?.balance?.currency || 'UAH'));
    const { min_amount, max_amount, max_count_per_day, max_amount_per_day } = this.data.transferSettings;

    this.config = {
      currency,
      min: min_amount,
      max: max_amount,
      maxAttempts: max_count_per_day,
      maxAmountPerCard: max_amount_per_day,
    };
  }

  private getTransactionStatus(index: number): Observable<TransactionStatusDto> {
    return this.financeService.getLastTransactionStatus(this.data.fleetId).pipe(
      map((transaction) => ({ transaction, count: (index ? 'second' : 'first') as TimerCount })),
      filter(
        ({ transaction: { status, error_code }, count }) =>
          !!error_code || count === 'second' || status === TransactionStatus.COMPLETED,
      ),
      map(({ transaction }) => transaction),
    );
  }

  // eslint-disable-next-line complexity
  private handleTransactionStatusResponse({ error_code, status }: TransactionStatusDto, payload: MoneyDto): void {
    this.transactionInProgress = false;

    if (status === TransactionStatus.COMPLETED) {
      this.toastService.success(this.translateService.instant('Notification.WithdrawToCard.Success'));
      this.dialogRef.close({ ...payload, error_code });
      return;
    }

    if (
      error_code &&
      error_code === TransactionErrorCode.PAYMENT_ERROR_WALLET_TO_CARD_CURRENT_BALANCE_LIMIT_EXCEED_FOR_ITN
    ) {
      this.toastService.error(this.translateService.instant('Notification.WithdrawToCard.MonthLimitError'));
      this.dialogRef.close({ ...payload, error_code });
      return;
    }

    if (
      error_code &&
      error_code !== TransactionErrorCode.PAYMENT_ERROR_WALLET_TO_CARD_P2P_RECEIVER_IDENTIFICATION_REQUIRED
    ) {
      this.toastService.error(this.translateService.instant('Notification.WithdrawToCard.Error'));
      this.dialogRef.close({ ...payload, error_code });
      return;
    }

    if (status === TransactionStatus.PROCESSING) {
      this.showPendingTransactionDialog$.next(true);
    }

    if (
      error_code &&
      error_code === TransactionErrorCode.PAYMENT_ERROR_WALLET_TO_CARD_P2P_RECEIVER_IDENTIFICATION_REQUIRED
    ) {
      this.showTransactionErrorDialog$.next(true);
    }
  }
}
