import { HttpControllerService } from '@api/common/http/http-controller.service';
import { PaymentProcessingService } from '@api/datasource';
import { PartnersService } from '@api/datasource/partners.service';
import {
  AddPaymentCardDto,
  EmployeeWalletItemDto,
  DriverWalletsDto,
  FleetWithdrawalTypeDto,
  IndividualEntrepreneurDto,
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
  TransactionsSettingsDto,
  FleetBalanceSplitAdjustmentModelCollection,
  FleetBalanceSplitModelDto,
  FleetWalletBalanceSplitModel,
  FleetBalancesSplitDistributionModel,
  FleetBalanceSplitDistributionModelDto,
  EmployeeWalletsTotalBalance,
  CashLimitsSettingsDto,
  CashLimitsSettingsUpdateDto,
  CashLimitsDriversSettingsUpdateDto,
  PaymentChannelDto,
} from '@data-access';
import { HttpStatus, Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, forkJoin, map, Observable, of, switchMap, throwError } from 'rxjs';

import { Jwt } from '@uklon/nest-core';

const DEFAULT_TRANSFER_SETTINGS: WalletToCardTransferSettingsDto = {
  min_amount: 200,
  max_amount: 5000,
  max_count_per_day: 2,
  max_amount_per_day: 10_000,
};

@Injectable()
export class FinanceService extends HttpControllerService {
  constructor(
    private readonly partnersService: PartnersService,
    private readonly paymentsService: PaymentProcessingService,
  ) {
    super();
  }

  public getFleetWallet(token: Jwt, fleetId: string): Observable<WalletDto> {
    return this.partnersService.get<WalletDto>(`api/v2/fleets/${fleetId}/wallet`, { token });
  }

  public getBalanceSplitModel(token: Jwt, fleetId: string): Observable<FleetBalanceSplitModelDto> {
    const splitAdjustmentModel$ = this.getBalanceSplitAdjustmentModel(token, fleetId);
    const splitDistributionModel$ = this.getBalanceSplitDistributionModel(token, fleetId);

    return forkJoin([splitAdjustmentModel$, splitDistributionModel$]).pipe(
      map(([split_adjustment_model, split_distribution_model]) => ({
        split_adjustment_model,
        split_distribution_model,
      })),
    );
  }

  public getBalanceSplitAdjustmentModel(token: Jwt, fleetId: string): Observable<FleetWalletBalanceSplitModel> {
    return this.paymentsService
      .get<FleetBalanceSplitAdjustmentModelCollection>(`api/v1/split-adjustment-models`, {
        token,
        params: { fleet_id: fleetId, offset: 0, limit: 1 },
      })
      .pipe(map((response) => response.items?.[0]?.split_adjustment_model));
  }

  public getBalanceSplitDistributionModel(
    token: Jwt,
    fleetId: string,
  ): Observable<FleetBalancesSplitDistributionModel> {
    return this.paymentsService
      .get<FleetBalanceSplitDistributionModelDto>(`api/v1/split-distribution-models/fleets/${fleetId}`, {
        token,
      })
      .pipe(map((response) => response?.split_distribution_model));
  }

  public getDriversWallets(token: Jwt, fleetId: string): Observable<DriverWalletsDto> {
    return this.partnersService.get<DriverWalletsDto>(`api/v2/fleets/${fleetId}/drivers/wallets`, { token });
  }

  public getEmployeesWallets(
    token: Jwt,
    fleetId: string,
    limit: number,
    cursor: number,
  ): Observable<EmployeeWalletsCollection> {
    return this.partnersService.get<EmployeeWalletsCollection>(
      `api/v2/finance-mediators/${fleetId}/employees/wallets`,
      {
        token,
        params: { limit, cursor },
      },
    );
  }

  public getEmployeeWalletsTotalBalance(token: Jwt, fleetId: string): Observable<EmployeeWalletsTotalBalance> {
    return this.partnersService.get<EmployeeWalletsTotalBalance>(
      `api/v1/finance-mediators/${fleetId}/employees/total-balance`,
      { token },
    );
  }

  public getEmployeeWithWallet(token: Jwt, fleetId: string, employeeId: string): Observable<EmployeeWalletItemDto> {
    return this.partnersService.get<EmployeeWalletItemDto>(`api/v1/fleets/${fleetId}/employees/${employeeId}/wallet`, {
      token,
    });
  }

  public withdrawToCardV2(token: Jwt, fleetId: string, transferId: string, body: MoneyDto): Observable<void> {
    return this.partnersService.put<void>(`api/v2/fleets/${fleetId}/wallet/transfers-to-card/${transferId}`, body, {
      token,
    });
  }

  public transferToFleet(token: Jwt, fleetId: string, body: WalletTransferDto): Observable<void> {
    return this.partnersService.post<void>(`api/v1/fleets/${fleetId}/wallet/:transfer-from-employees`, body, { token });
  }

  public transferToEmployees(token: Jwt, fleetId: string, body: WalletTransferDto): Observable<void> {
    return this.partnersService.post<void>(`api/v1/fleets/${fleetId}/wallet/:transfer-to-employees`, body, { token });
  }

  public getFleetPaymentCard(token: Jwt, fleetId: string): Observable<PaymentCardDto> {
    return this.partnersService.get<PaymentCardDto>(`api/v1/fleets/${fleetId}/payment-card`, { token });
  }

  public getFleetWalletTransactions(
    token: Jwt,
    fleetId: string,
    date_from: number,
    date_to: number,
    offset: number,
    limit: number,
  ): Observable<InfinityScrollCollectionDto<TransactionDto>> {
    return this.partnersService.get<InfinityScrollCollectionDto<TransactionDto>>(
      `api/v1/fleets/${fleetId}/wallet/transactions`,
      {
        token,
        params: {
          date_from,
          date_to,
          offset,
          limit,
        },
      },
    );
  }

  public getLastFleetTransactionStatus(token: Jwt, fleetId: string): Observable<TransactionStatusDto> {
    return this.partnersService.get(`api/v1/fleets/${fleetId}/wallet/transfers-to-card`, { token });
  }

  public getEmployeeTransactions(
    token: Jwt,
    fleetId: string,
    driverId: string,
    date_from: number,
    date_to: number,
    offset: number,
    limit: number,
  ): Observable<InfinityScrollCollectionDto<TransactionDto>> {
    return this.partnersService.get<InfinityScrollCollectionDto<TransactionDto>>(
      `api/v1/fleets/${fleetId}/employees/${driverId}/wallet/transactions`,
      {
        token,
        params: {
          date_from,
          date_to,
          offset,
          limit,
        },
      },
    );
  }

  public putFleetPaymentCard(token: Jwt, fleetId: string, body: AddPaymentCardDto): Observable<void> {
    return this.partnersService.put<void>(`api/v1/fleets/${fleetId}/payment-card`, body, { token });
  }

  public deleteFleetPaymentCard(token: Jwt, fleetId: string, cardId: string): Observable<void> {
    return this.partnersService.delete<void>(`api/v2/fleets/${fleetId}/payment-card/${cardId}`, { token });
  }

  public getFleetEntrepreneurs(
    token: Jwt,
    fleetId: string,
    includeWithdrawalType: boolean,
  ): Observable<IndividualEntrepreneurCollectionDto> {
    const req = includeWithdrawalType ? this.getFleetWithdrawalType(token, fleetId) : of({ withdrawal_type: null });

    return this.partnersService
      .get<IndividualEntrepreneurCollectionDto>(`api/v2/fleets/${fleetId}/individual-entrepreneurs`, {
        token,
        params: { limit: 50, offset: 0 },
      })
      .pipe(
        map(({ items, has_more_items }) => ({
          items: items.sort((a, b) => Number(b.is_selected) - Number(a.is_selected)),
          has_more_items,
        })),
        switchMap(({ items, has_more_items }) =>
          req.pipe(
            map(({ withdrawal_type }) =>
              withdrawal_type ? { withdrawal_type, items, has_more_items } : { items, has_more_items },
            ),
          ),
        ),
      );
  }

  public getFleetEntrepreneurById(
    token: Jwt,
    fleetId: string,
    entrepreneurId: string,
  ): Observable<IndividualEntrepreneurDto> {
    return this.partnersService.get<IndividualEntrepreneurDto>(
      `api/v2/fleets/${fleetId}/individual-entrepreneurs/${entrepreneurId}`,
      { token },
    );
  }

  public deleteFleetEntrepreneur(token: Jwt, fleetId: string, entrepreneurId: string): Observable<void> {
    return this.partnersService.delete<void>(`api/v2/fleets/${fleetId}/individual-entrepreneurs/${entrepreneurId}`, {
      token,
    });
  }

  public setSelectedEntrepreneur(token: Jwt, fleetId: string, entrepreneurId: string): Observable<void> {
    const url = `api/v1/fleets/${fleetId}/individual-entrepreneurs/${entrepreneurId}/:select`;
    return this.partnersService.post<void>(url, null, { token });
  }

  public getPaymentChannel(paymentChannelId: string, token: Jwt): Observable<PaymentChannelDto> {
    return this.paymentsService.get<PaymentChannelDto>(`api/v1/admin/b2b-payments-channels/${paymentChannelId}`, {
      token,
    });
  }

  public getFleetWithdrawalType(token: Jwt, fleetId: string): Observable<FleetWithdrawalTypeDto> {
    return this.partnersService.get<FleetWithdrawalTypeDto>(`api/v1/fleets/${fleetId}/withdrawal-type`, { token });
  }

  public getRegionWithdrawToCardSettings(token: Jwt, regionId: string): Observable<WalletToCardTransferSettingsDto> {
    return this.paymentsService.get<TransactionsSettingsDto>(`api/v1/regions/${regionId}/settings`, { token }).pipe(
      map(({ wallet_to_card_transfer_settings }) => wallet_to_card_transfer_settings),
      catchError(() => of(DEFAULT_TRANSFER_SETTINGS)),
    );
  }

  public getFleetCashLimits(token: Jwt, fleetId: string): Observable<CashLimitsSettingsDto> {
    return this.partnersService.get<CashLimitsSettingsDto>(`api/v1/fleets/${fleetId}/cash-limits`, { token }).pipe(
      catchError((error: AxiosError) => {
        if (error.status === HttpStatus.NOT_FOUND) {
          return of(null);
        }

        return throwError(() => error);
      }),
    );
  }

  public updateFleetCashLimits(token: Jwt, fleetId: string, body: CashLimitsSettingsUpdateDto): Observable<void> {
    return this.partnersService.put<void>(`api/v1/fleets/${fleetId}/cash-limits`, body, { token });
  }

  public updateDriversCashLimits(
    token: Jwt,
    fleetId: string,
    body: CashLimitsDriversSettingsUpdateDto,
  ): Observable<void> {
    return this.partnersService.put<void>(`api/v1/fleets/${fleetId}/cash-limits/exceptions`, body, { token });
  }
}
