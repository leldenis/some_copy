import { AsyncPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import {
  AnalyticsDateFilter,
  AnalyticsUserRole,
  AnalyticsWihdrawMoney,
  FleetAnalyticsEventType,
  FleetBalanceSplitModelDto,
  FleetDto,
  FleetType,
  IndividualEntrepreneurDto,
  IndividualEntrepreneurCollectionDto,
  MoneyDto,
  PaymentCardDto,
  TransactionErrorCode,
  WalletToCardTransferSettingsDto,
  WithdrawalType,
  getCurrentWeek,
} from '@data-access';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { StorageFiltersKey, StorageService, userRoleKey } from '@ui/core/services/storage.service';
import { ToastService } from '@ui/core/services/toast.service';
import { AccountState } from '@ui/core/store/account/account.reducer';
import { getSelectedFleet } from '@ui/core/store/account/account.selectors';
import { getConfig } from '@ui/core/store/root/root.selectors';
import { FleetWalletCardComponent } from '@ui/modules/finance/components/fleet-wallet/fleet-wallet-card/fleet-wallet-card.component';
import { FleetWalletInfoComponent } from '@ui/modules/finance/components/fleet-wallet/fleet-wallet-info/fleet-wallet-info.component';
import { FleetWalletTransactionsFilterComponent } from '@ui/modules/finance/components/fleet-wallet/fleet-wallet-transactions-filter/fleet-wallet-transactions-filter.component';
import { FleetWalletTransactionsListComponent } from '@ui/modules/finance/components/fleet-wallet/fleet-wallet-transactions-list/fleet-wallet-transactions-list.component';
import { FleetEntrepreneurComponent } from '@ui/modules/finance/components/fleet-wallet-entrepreneur/components/fleet-entrepreneur/fleet-entrepreneur.component';
import { TransactionsFilterDto } from '@ui/modules/finance/models/fleet-wallet-transactions-filter.dto';
import { FinanceService } from '@ui/modules/finance/services';
import {
  getFleetPaymentCard,
  getFleetWalletTransactions,
  getFleetWalletTransactionsHasMoreData,
  isWalletTransactionsCollectionError,
  getFleetWalletTransactionsLoadingState,
  getFleetWallet,
} from '@ui/modules/finance/store';
import { financeActions } from '@ui/modules/finance/store/finance/finance.actions';
import { FinanceState } from '@ui/modules/finance/store/finance/finance.reducer';
import { IncludedInPipe, ProgressSpinnerComponent } from '@ui/shared';
import { EmptyStateComponent } from '@ui/shared/components/empty-state/empty-state.component';
import { EmptyStates } from '@ui/shared/components/empty-state/empty-states';
import { COURIER_FLEET_TYPES } from '@ui/shared/consts/fleet-types.const';
import { AddCardComponent } from '@ui/shared/dialogs/add-card/add-card.component';
import { DeleteCardComponent } from '@ui/shared/dialogs/delete-card/delete-card.component';
import { WithdrawToCardComponent } from '@ui/shared/dialogs/withdraw-to-card/withdraw-to-card.component';
import { FleetRegion } from '@ui/shared/enums/fleet-regions.enum';
import { InfoPanelComponent } from '@ui/shared/modules/info-panel/components/info-panel/info-panel.component';
import { combineLatest, filter, Observable, take, tap } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { toServerDate } from '@uklon/angular-core';
import { ScrolledDirectiveModule } from '@uklon/fleets/angular/cdk';

const DEFAULT_RANGE = getCurrentWeek();

@Component({
  selector: 'upf-fleet-wallet',
  standalone: true,
  imports: [
    FleetWalletInfoComponent,
    AsyncPipe,
    MatDivider,
    FleetWalletCardComponent,
    FleetEntrepreneurComponent,
    InfoPanelComponent,
    TranslateModule,
    FleetWalletTransactionsFilterComponent,
    NgClass,
    FleetWalletTransactionsListComponent,
    ScrolledDirectiveModule,
    EmptyStateComponent,
    ProgressSpinnerComponent,
    IncludedInPipe,
  ],
  templateUrl: './fleet-wallet.component.html',
  styleUrls: ['./fleet-wallet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FleetWalletComponent {
  @Input() public filterKey = StorageFiltersKey.FLEET_WALLET;
  @Input() public showFinanceSettings: boolean;

  @Input() public set fleet({ id, fleet_type, region_id, tin_refused }: FleetDto) {
    this.regionId = region_id;
    this.tinRefused = tin_refused;
    this.transferToCardSettings$ = this.financeService.getRegionWithdrawToCardSettings(id, region_id);
    this.handleFleetChange(id, fleet_type);
  }

  public readonly emptyStatesRef = EmptyStates;
  public readonly analyticsEventType = FleetAnalyticsEventType;
  public readonly hideActionsRegions = [FleetRegion.AZ, FleetRegion.UZ];

  public card$ = this.store.select(getFleetPaymentCard);
  public transactions$ = this.store.select(getFleetWalletTransactions);
  public hasMoreData$ = this.store.select(getFleetWalletTransactionsHasMoreData);
  public hasError$ = this.store.select(isWalletTransactionsCollectionError);
  public status$ = this.store.select(getFleetWalletTransactionsLoadingState);
  public entrepreneurs$: Observable<IndividualEntrepreneurCollectionDto> = this.store.select(getSelectedFleet).pipe(
    filter(Boolean),
    switchMap(({ id }) => this.financeService.getFleetEntrepreneurs(id)),
    tap(({ items, withdrawal_type }) => {
      this.b2bActivated = items.length > 0 && withdrawal_type === WithdrawalType.INDIVIDUAL_ENTREPRENEUR;
      this.entrepreneursAdded = items.length > 0;
    }),
  );
  public wallet$ = this.store.select(getFleetWallet).pipe(
    tap((wallet) => {
      this.balance = wallet?.balance?.amount || 0;
    }),
  );
  public rentalFleetWithdrawalEnabled$ = combineLatest([
    this.store.select(getSelectedFleet),
    this.store.select(getConfig),
  ]).pipe(
    filter(([selectedFleet, config]) => !!selectedFleet && !!config),
    map(
      ([{ fleet_type }, config]) =>
        fleet_type !== FleetType.RENTAL || (fleet_type === FleetType.RENTAL && config.rentalFleetWithdrawalEnabled),
    ),
  );
  public transferToCardSettings$: Observable<WalletToCardTransferSettingsDto>;

  public filter: TransactionsFilterDto = { date: DEFAULT_RANGE };
  public b2bActivated = false;
  public balance = 0;
  public entrepreneursAdded = false;
  public regionId: number;
  public tinRefused = false;
  public balanceSplitModel: FleetBalanceSplitModelDto;

  private fleetId: string;
  private offset = 0;
  private readonly limit = 30;

  constructor(
    private readonly store: Store<AccountState | FinanceState>,
    private readonly matDialog: MatDialog,
    private readonly analytics: AnalyticsService,
    private readonly storage: StorageService,
    private readonly toastService: ToastService,
    private readonly translateService: TranslateService,
    private readonly financeService: FinanceService,
  ) {
    this.reportUserRole(FleetAnalyticsEventType.FINANCE_FLEET_WALLET_SCREEN);
  }

  public get userRole(): string {
    return this.storage.get(userRoleKey) || '';
  }

  public loadNext(status: 'progress' | 'done', hasMoreData: boolean): void {
    if (!hasMoreData || status === 'progress') return;

    this.offset += this.limit;
    this.getFleetWalletTransactions(true);
  }

  public handleFilterChange(value: TransactionsFilterDto): void {
    if (!value || Object.keys(value).length === 0) return;

    this.offset = 0;
    this.filter = value;
    this.getFleetWalletTransactions();
    this.reportFilterChange(this.filter);
  }

  public handleAddCard(): void {
    this.openAddCardDialog();
    this.reportUserRole(FleetAnalyticsEventType.FINANCE_FLEET_WALLET_ADD_CARD_TAP);
  }

  public handleDeleteCard({ pan, card_id }: PaymentCardDto): void {
    this.openDeleteCardDialog(pan, card_id);
  }

  public handleWithdrawal(
    withdrawInfo: { balance: MoneyDto; pan: string },
    region: FleetRegion,
    transferSettings: WalletToCardTransferSettingsDto,
  ): void {
    this.openWithdrawalDialog({ ...withdrawInfo, region, transferSettings })
      .pipe(filter(Boolean))
      .subscribe(({ amount, error_code }) => {
        if (!error_code) {
          this.getFleetWalletTransactions();
          this.store.dispatch(financeActions.getFleetWallet({ fleetId: this.fleetId }));

          this.analytics.reportEvent<AnalyticsUserRole>(
            FleetAnalyticsEventType.FINANCE_FLEET_WALLET_WITHDRAW_MONEY_SUCCESSFUL,
            {
              user_access: this.userRole,
            },
          );
        }

        this.analytics.reportEvent<AnalyticsWihdrawMoney>(
          FleetAnalyticsEventType.FINANCE_FLEET_WALLET_WITHDRAW_MONEY_POPUP_CONFIRM,
          {
            user_access: this.userRole,
            withdraw_sum: amount,
          },
        );
      });
  }

  public reportUserRole(eventType: FleetAnalyticsEventType): void {
    this.analytics.reportEvent<AnalyticsUserRole>(eventType, {
      user_access: this.userRole,
    });
  }

  public onSelectedEntrepreneurChange(entrepreneur: IndividualEntrepreneurDto): void {
    this.financeService
      .selectFleetEntrepreneurs(this.fleetId, entrepreneur.id)
      .pipe(
        catchError(() => {
          this.toastService.error(this.translateService.instant('Finance.FleetEntrepreneur.Notifiactions.Error'));
          return null;
        }),
      )
      .subscribe(() => {
        const message = this.b2bActivated
          ? 'Finance.FleetEntrepreneur.Notifiactions.Success'
          : 'Finance.FleetEntrepreneur.Notifiactions.SuccessB2BNotActive';

        this.toastService.success(this.translateService.instant(message));
      });
  }

  public loadFleetBalanceSplitModel(): void {
    if (this.showFinanceSettings && !this.balanceSplitModel) {
      this.financeService
        .getFleetBalanceSplitModel(this.fleetId)
        .pipe(take(1))
        .subscribe((data) => {
          this.balanceSplitModel = data;
        });
    }
  }

  private handleFleetChange(fleetId: string, fleetType: FleetType): void {
    this.balanceSplitModel = null;
    this.offset = 0;
    this.fleetId = fleetId;
    this.store.dispatch(financeActions.getFleetWallet({ fleetId }));

    if (COURIER_FLEET_TYPES.has(fleetType)) return;
    this.store.dispatch(financeActions.getFleetPaymentCard({ fleetId }));
  }

  private getFleetWalletTransactions(loadNext = false): void {
    const {
      date: { from, to },
    } = this.filter;
    const action = loadNext
      ? financeActions.getFleetWalletTransactionsWithNextPage
      : financeActions.getFleetWalletTransactions;

    this.store.dispatch(
      action({
        offset: this.offset,
        date_from: toServerDate(new Date(from)),
        date_to: toServerDate(new Date(to)),
        limit: this.limit,
      }),
    );
  }

  private openAddCardDialog(): void {
    const dialogRef = this.matDialog.open(AddCardComponent, {
      disableClose: true,
      panelClass: 'no-padding-dialog',
      autoFocus: false,
      data: this.fleetId,
    });

    dialogRef
      .afterClosed()
      .pipe(
        tap(() => this.reportUserRole(FleetAnalyticsEventType.FINANCE_FLEET_WALLET_ADD_CARD_POPUP_CLOSED)),
        filter(Boolean),
      )
      .subscribe(() => {
        this.store.dispatch(financeActions.getFleetPaymentCard({ fleetId: this.fleetId }));
      });
  }

  private openDeleteCardDialog(pan: string, cardId: string): void {
    const dialogRef = this.matDialog.open(DeleteCardComponent, {
      disableClose: true,
      panelClass: 'no-padding-dialog',
      autoFocus: false,
      data: pan,
    });

    dialogRef
      .afterClosed()
      .pipe(
        tap((confirmed) => {
          if (confirmed) return;
          this.reportUserRole(FleetAnalyticsEventType.FINANCE_FLEET_WALLET_REMOVE_CARD_POPUP_CANCEL);
        }),
        filter(Boolean),
      )
      .subscribe(() => {
        this.store.dispatch(financeActions.deleteFleetPaymentCard({ fleetId: this.fleetId, cardId }));
      });
  }

  private openWithdrawalDialog(withdrawInfo: {
    balance: MoneyDto;
    pan: string;
    region: FleetRegion;
    fleetId?: string;
    transferSettings?: WalletToCardTransferSettingsDto;
  }): Observable<MoneyDto & { error_code: TransactionErrorCode }> {
    this.reportUserRole(FleetAnalyticsEventType.FINANCE_FLEET_WALLET_WITHDRAW_MONEY_POPUP);

    const dialogRef = this.matDialog.open(WithdrawToCardComponent, {
      disableClose: true,
      panelClass: 'no-padding-dialog',
      autoFocus: false,
      data: { ...withdrawInfo, fleetId: this.fleetId, tinRefused: this.tinRefused },
    });

    return dialogRef.afterClosed().pipe(
      tap(() => this.reportUserRole(FleetAnalyticsEventType.FINANCE_FLEET_WALLET_WITHDRAW_MONEY_CLOSE_POPUP)),
      filter(Boolean),
    );
  }

  private reportFilterChange({ date: { from, to } }: TransactionsFilterDto): void {
    this.analytics.reportEvent<AnalyticsDateFilter>(FleetAnalyticsEventType.FINANCE_FLEET_WALLET_DATE_FILTER, {
      start_date: from,
      end_date: to,
      user_access: this.userRole,
    });
  }
}
