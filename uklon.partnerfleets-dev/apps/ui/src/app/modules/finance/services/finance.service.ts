import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AddPaymentCardDto,
  EmployeeWalletItemDto,
  DriverWalletsDto,
  IndividualEntrepreneurCollectionDto,
  InfinityScrollCollectionDto,
  MoneyDto,
  PaymentCardDto,
  TransactionDto,
  WalletDto,
  WalletTransferDto,
  EmployeeWalletsCollection,
  TransactionStatusDto,
  WalletToCardTransferSettingsDto,
  FleetBalanceSplitModelDto,
  EmployeeWalletsTotalBalance,
  CashLimitsSettingsDto,
  CashLimitsSettingsUpdateDto,
  CashLimitsDriversSettingsUpdateDto,
  PaymentChannelDto,
} from '@data-access';
import { HttpClientService } from '@ui/core/services/http-client.service';
import { Observable } from 'rxjs';

const FLEET_FINANCE_URL = 'api/fleets/{0}/finance';
const FLEET_WALLET_URL = `${FLEET_FINANCE_URL}/wallet`;
const FLEET_DRIVERS_WALLETS_URL = `${FLEET_FINANCE_URL}/drivers/wallets`;
const FLEET_EMPLOYEE_WALLET_URL = `${FLEET_FINANCE_URL}/employees/{1}/wallet`;
const FLEET_TRANSACTION_TO_FLEET_URL = `${FLEET_WALLET_URL}/transfers/transfer-to-fleet`;
const FLEET_TRANSACTION_TO_EMPLOYEES_URL = `${FLEET_WALLET_URL}/transfers/transfer-to-employees`;
const FLEET_EMPLOYEE_TRANSACTIONS_URL = `${FLEET_FINANCE_URL}/employees/{1}/wallet-transactions`;
const FLEET_PAYMENT_CARD_URL = `${FLEET_FINANCE_URL}/payment-card`;
const FLEET_WALLET_TRANSACTIONS_URL = `${FLEET_FINANCE_URL}/wallet-transactions`;
const FLEET_WALLET_ENTREPRENEURS_URL = `${FLEET_FINANCE_URL}/individual-entrepreneurs`;

@Injectable({ providedIn: 'root' })
export class FinanceService extends HttpClientService {
  constructor(private readonly http: HttpClient) {
    super();
  }

  public getFleetWallet(fleetId: string): Observable<WalletDto> {
    return this.http.get<WalletDto>(this.buildUrl(FLEET_WALLET_URL, fleetId));
  }

  public getFleetBalanceSplitModel(fleetId: string): Observable<FleetBalanceSplitModelDto> {
    return this.http.get<FleetBalanceSplitModelDto>(`api/fleets/${fleetId}/finance/balance-split-model`);
  }

  public getDriversWallets(fleetId: string): Observable<DriverWalletsDto> {
    return this.http.get<DriverWalletsDto>(this.buildUrl(FLEET_DRIVERS_WALLETS_URL, fleetId));
  }

  public getEmployeeWithWallet(fleetId: string, employeeId: string): Observable<EmployeeWalletItemDto> {
    return this.http.get<EmployeeWalletItemDto>(this.buildUrl(FLEET_EMPLOYEE_WALLET_URL, fleetId, employeeId));
  }

  public putFleetPaymentCard(fleetId: string, body: AddPaymentCardDto): Observable<void> {
    return this.http.put<void>(this.buildUrl(FLEET_PAYMENT_CARD_URL, fleetId), body);
  }

  public getFleetPaymentCard(fleetId: string): Observable<PaymentCardDto> {
    return this.http.get<PaymentCardDto>(this.buildUrl(FLEET_PAYMENT_CARD_URL, fleetId));
  }

  public deleteFleetPaymentCard(fleetId: string, cardId: string): Observable<void> {
    return this.http.delete<void>(`api/fleets/${fleetId}/finance/payment-card/${cardId}`);
  }

  public withdrawToCard(fleetId: string, transferId: string, body: MoneyDto): Observable<void> {
    return this.http.put<void>(`api/fleets/${fleetId}/finance/wallet/transfers-v2/${transferId}`, body);
  }

  public withdrawToFleet(fleetId: string, body: WalletTransferDto): Observable<void> {
    return this.http.post<void>(this.buildUrl(FLEET_TRANSACTION_TO_FLEET_URL, fleetId), body);
  }

  public withdrawToEmployees(fleetId: string, body: WalletTransferDto): Observable<void> {
    return this.http.post<void>(this.buildUrl(FLEET_TRANSACTION_TO_EMPLOYEES_URL, fleetId), body);
  }

  public getFleetWalletTransactions(
    fleetId: string,
    date_from: number,
    date_to: number,
    offset: number,
    limit: number,
  ): Observable<InfinityScrollCollectionDto<TransactionDto>> {
    return this.http.get<InfinityScrollCollectionDto<TransactionDto>>(
      this.buildUrl(FLEET_WALLET_TRANSACTIONS_URL, fleetId),
      {
        params: {
          date_from,
          date_to,
          offset,
          limit,
        },
      },
    );
  }

  public getEmployeeTransactions(
    fleetId: string,
    employeeId: string,
    date_from: number,
    date_to: number,
    offset: number,
    limit: number,
  ): Observable<InfinityScrollCollectionDto<TransactionDto>> {
    return this.http.get<InfinityScrollCollectionDto<TransactionDto>>(
      this.buildUrl(FLEET_EMPLOYEE_TRANSACTIONS_URL, fleetId, employeeId),
      {
        params: {
          date_from,
          date_to,
          offset,
          limit,
        },
      },
    );
  }

  public getFleetEntrepreneurs(
    fleetId: string,
    includeWithdrawalType: boolean = true,
  ): Observable<IndividualEntrepreneurCollectionDto> {
    return this.http.get<IndividualEntrepreneurCollectionDto>(this.buildUrl(FLEET_WALLET_ENTREPRENEURS_URL, fleetId), {
      params: { includeWithdrawalType },
    });
  }

  public selectFleetEntrepreneurs(fleetId: string, entrepreneurId: string): Observable<void> {
    return this.http.post<void>(`api/fleets/${fleetId}/finance/individual-entrepreneurs/${entrepreneurId}/select`, {});
  }

  public getPaymentChannel(paymentChannelId: string): Observable<PaymentChannelDto> {
    return this.http.get<PaymentChannelDto>(`api/fleets/_/finance/payment-channels/${paymentChannelId}`);
  }

  public getEmployeesWallets(fleetId: string, limit: number, cursor: number): Observable<EmployeeWalletsCollection> {
    const params = new HttpParams({ fromObject: { limit, cursor } });
    return this.http.get<EmployeeWalletsCollection>(`api/fleets/${fleetId}/finance/employees/wallets`, { params });
  }

  public getEmployeeWalletsTotalBalance(fleetId: string): Observable<EmployeeWalletsTotalBalance> {
    return this.http.get<EmployeeWalletsTotalBalance>(`api/fleets/${fleetId}/finance/employees/total-balance`);
  }

  public getLastTransactionStatus(fleetId: string): Observable<TransactionStatusDto> {
    return this.http.get<TransactionStatusDto>(`api/fleets/${fleetId}/finance/last-transactions-status`);
  }

  public getRegionWithdrawToCardSettings(
    fleetId: string,
    regionId: number,
  ): Observable<WalletToCardTransferSettingsDto> {
    return this.http.get<WalletToCardTransferSettingsDto>(
      `api/fleets/${fleetId}/finance/withdraw-to-card-settings/${regionId}`,
    );
  }

  public getCashLimitsSettings(fleetId: string): Observable<CashLimitsSettingsDto> {
    return this.http.get<CashLimitsSettingsDto>(`api/fleets/${fleetId}/finance/cash-limits`);
  }

  public updateCashLimitsSettings(fleetId: string, settings: CashLimitsSettingsUpdateDto): Observable<void> {
    return this.http.put<void>(`api/fleets/${fleetId}/finance/cash-limits`, settings);
  }

  public updateDriversCashLimitsSettings(
    fleetId: string,
    settings: CashLimitsDriversSettingsUpdateDto,
  ): Observable<void> {
    return this.http.put<void>(`api/fleets/${fleetId}/finance/cash-limits/exceptions`, settings);
  }
}
