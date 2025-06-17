import { CdkStep, CdkStepper } from '@angular/cdk/stepper';
import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import {
  AddPaymentCardDto,
  AnalyticsActionIteration,
  AnalyticsError,
  AnalyticsUserRole,
  FleetAnalyticsEventType,
} from '@data-access';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { StorageService, userRoleKey } from '@ui/core/services/storage.service';
import { accountActions } from '@ui/core/store/account/account.actions';
import { AccountEffects } from '@ui/core/store/account/account.effects';
import { AccountState } from '@ui/core/store/account/account.reducer';
import * as accountSelectors from '@ui/core/store/account/account.selectors';
import { financeActions } from '@ui/modules/finance/store/finance/finance.actions';
import { FinanceEffects } from '@ui/modules/finance/store/finance/finance.effects';
import { FinanceState } from '@ui/modules/finance/store/finance/finance.reducer';
import { CustomValidators } from '@ui/shared';
import { CodeInputComponent } from '@ui/shared/components/code-input/code-input.component';
import { StepperComponent } from '@ui/shared/components/stepper/stepper.component';
import { CounterDirective } from '@ui/shared/directives/counter/counter.directive';
import { InfoPanelComponent } from '@ui/shared/modules/info-panel/components/info-panel/info-panel.component';
import { NgxMaskDirective } from 'ngx-mask';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'upf-add-card',
  standalone: true,
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslateModule,
    MatIconButton,
    MatIcon,
    StepperComponent,
    AsyncPipe,
    CdkStep,
    MatFormField,
    ReactiveFormsModule,
    MatInput,
    NgxMaskDirective,
    MatButton,
    InfoPanelComponent,
    CodeInputComponent,
    CounterDirective,
    MatError,
    MatLabel,
  ],
})
export class AddCardComponent implements OnInit, OnDestroy {
  @ViewChild(CdkStepper)
  public stepper: CdkStepper;

  public getAccountInfo$ = this.accountStore.select(accountSelectors.account);

  public timer: { count: number; counter: number } = null;
  public smsSendingLimitsMinutes: number[] = [15, 60, 300];
  public currentLimit = 0;
  public resendBtnClickCount = 0;
  public continueBtnClickCount = 0;
  public analyticsEventType = FleetAnalyticsEventType;
  public formGroup = new FormGroup(
    {
      pan: new FormControl<string>(null, [Validators.required, CustomValidators.mastercardOrVisa()]),
      expiration_month: new FormControl<string>(null, [Validators.required, Validators.pattern(/0[1-9]|1[0-2]/)]),
      expiration_year: new FormControl<string>(null, Validators.required),
      verification_code: new FormControl<string>(null, [Validators.required, Validators.minLength(6)]),
    },
    CustomValidators.cardExpiration(),
  );
  private readonly destroyed$ = new Subject<void>();

  constructor(
    private readonly dialogRef: MatDialogRef<AddCardComponent>,
    private readonly accountStore: Store<AccountState>,
    private readonly accountsEffects: AccountEffects,
    private readonly financeStore: Store<FinanceState>,
    private readonly financeEffects: FinanceEffects,
    private readonly cdr: ChangeDetectorRef,
    private readonly analytics: AnalyticsService,
    private readonly storage: StorageService,
    @Inject(MAT_DIALOG_DATA) public fleetId: string,
  ) {
    this.reportUserRole(FleetAnalyticsEventType.FINANCE_FLEET_WALLET_ADD_CARD_POPUP);
  }

  public get userRole(): string {
    return this.storage.get(userRoleKey) || '';
  }

  public ngOnInit(): void {
    this.onFormStatusChange();

    this.accountsEffects.verificationCodeSent$
      .pipe(
        tap(() => this.updateTimer()),
        takeUntil(this.destroyed$),
      )
      .subscribe();

    this.financeEffects.putFleetPaymentCardFailed$
      .pipe(
        tap((error) => {
          this.reportError(FleetAnalyticsEventType.FINANCE_FLEET_WALLET_ADD_CARD_INPUT_CODE_ERROR_POPUP, error);
          this.formGroup.get('verification_code').reset(null);
          this.formGroup.get('verification_code').setErrors({ invalidCode: true });
        }),
        takeUntil(this.destroyed$),
      )
      .subscribe();

    this.financeEffects.putFleetPaymentCardSuccess$
      .pipe(
        tap(() => this.onAcceptClick()),
        takeUntil(this.destroyed$),
      )
      .subscribe();
  }

  public ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  public onAddCardClick(): void {
    this.stepper.next();
    this.sendCode();

    this.reportUserRole(FleetAnalyticsEventType.FINANCE_FLEET_WALLET_ADD_CARD_POPUP_ADD_TAP);
    this.reportUserRole(FleetAnalyticsEventType.FINANCE_FLEET_WALLET_ADD_CARD_INPUT_CODE_POPUP);
  }

  public sendCode(): void {
    this.accountStore.dispatch(accountActions.sendVerificationCode());
  }

  public onAcceptClick(): void {
    this.dialogRef.close(true);
    this.reportUserRole(FleetAnalyticsEventType.FINANCE_FLEET_WALLET_ADD_CARD_SUCCESSFUL);
  }

  public onCancelClick(): void {
    this.dialogRef.close();
  }

  public onConfirmPhoneClick(): void {
    const { pan, expiration_month, expiration_year, verification_code } = this.formGroup.value;
    const payload: AddPaymentCardDto = {
      pan,
      expiration_year: Number.parseInt(`20${expiration_year}`, 10),
      expiration_month: +expiration_month,
      verification_code,
    };

    this.financeStore.dispatch(financeActions.putFleetPaymentCard({ fleetId: this.fleetId, body: payload }));

    this.reportClickIteration(
      this.continueBtnClickCount,
      FleetAnalyticsEventType.FINANCE_FLEET_WALLET_ADD_CARD_CONTINUE_BUTTON,
    );
  }

  public reportClickIteration(iteration_number: number, eventType: FleetAnalyticsEventType): void {
    const nextIterationNumber = iteration_number + 1;

    this.analytics.reportEvent<AnalyticsActionIteration>(eventType, {
      iteration_number: nextIterationNumber,
      user_access: this.userRole,
    });
  }

  private updateTimer(): void {
    if (this.timer?.count) {
      return;
    }
    this.timer = {
      count: this.smsSendingLimitsMinutes[this.currentLimit],
      counter: this.smsSendingLimitsMinutes[this.currentLimit],
    };

    if (this.currentLimit === this.smsSendingLimitsMinutes.length - 1) {
      this.currentLimit = 0;
    } else {
      this.currentLimit += 1;
    }

    this.cdr.markForCheck();
  }

  private onFormStatusChange(): void {
    this.formGroup.statusChanges
      .pipe(
        debounceTime(250),
        distinctUntilChanged(),
        filter((status) => status === 'VALID'),
        takeUntil(this.destroyed$),
      )
      .subscribe(() => {
        this.reportUserRole(FleetAnalyticsEventType.FINANCE_FLEET_WALLET_ADD_CARD_POPUP_FILLED);
      });
  }

  private reportUserRole(eventType: FleetAnalyticsEventType): void {
    this.analytics.reportEvent<AnalyticsUserRole>(eventType, {
      user_access: this.userRole,
    });
  }

  private reportError(eventType: FleetAnalyticsEventType, error: { status: number; message?: string }): void {
    this.analytics.reportEvent<AnalyticsError>(eventType, {
      user_access: this.userRole,
      error_code: error?.status,
      error_text: error?.message,
    });
  }
}
