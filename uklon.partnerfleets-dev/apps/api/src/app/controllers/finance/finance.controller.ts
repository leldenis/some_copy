import { ApiErrorResponseEntity } from '@api/common/entities/api-error-response.entity';
import { buildApiOperationOptions } from '@api/common/utils/swagger/build-api-operation-options';
import {
  AddPaymentCardEntity,
  CashLimitsSettingsEntity,
  DriverWalletsEntity,
  EmployeeWalletItemEntity,
  EmployeeWalletsEntity,
  FleetBalanceSplitModelEntity,
  IndividualEntrepreneurCollectionEntity,
  IndividualEntrepreneurEntity,
  MoneyEntity,
  PaymentCardEntity,
  PaymentChannelEntity,
  TransactionsCollectionEntity,
  TransactionStatusEntity,
  WalletEntity,
  WalletToCardTransferSettingsEntity,
  WalletTransferEntity,
  WithdrawalTypeEntity,
} from '@api/controllers/finance/entities';
import { FinanceService } from '@api/controllers/finance/finance.service';
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
  FleetBalanceSplitModelDto,
  EmployeeWalletsTotalBalance,
  CashLimitsSettingsDto,
  CashLimitsSettingsUpdateDto,
  CashLimitsDriversSettingsUpdateDto,
  PaymentChannelDto,
} from '@data-access';
import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';

import { AuthGuard, Jwt, UserToken } from '@uklon/nest-core';

@ApiTags('Fleet finance')
@Controller('/fleets/:fleetId/finance')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request', type: ApiErrorResponseEntity })
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized', type: ApiErrorResponseEntity })
@ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden', type: ApiErrorResponseEntity })
@ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found', type: ApiErrorResponseEntity })
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Get('/wallet')
  @ApiOperation(buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v1/fleets/{0}/wallet' }]))
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: WalletEntity })
  public getFleetWallet(@Param('fleetId') fleetId: string, @UserToken() token: Jwt): Observable<WalletDto> {
    return this.financeService.getFleetWallet(token, fleetId);
  }

  @Get('/balance-split-model')
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'PP', method: 'GET', url: 'api/v1/split-adjustment-models' },
      { service: 'PP', method: 'GET', url: 'api/v1/split-distribution-models/fleets/{0}' },
    ]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: FleetBalanceSplitModelEntity })
  public getFleetBalanceSplitModel(
    @UserToken() token: Jwt,
    @Param('fleetId') fleetId: string,
  ): Observable<FleetBalanceSplitModelDto> {
    return this.financeService.getBalanceSplitModel(token, fleetId);
  }

  @Get('/drivers/wallets')
  @ApiOperation(buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v2/fleets/{0}/drivers/wallets' }]))
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: DriverWalletsEntity })
  public getDriversWallets(@Param('fleetId') fleetId: string, @UserToken() token: Jwt): Observable<DriverWalletsDto> {
    return this.financeService.getDriversWallets(token, fleetId);
  }

  @Get('/employees/wallets')
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'P', method: 'GET', url: 'api/v2/finance-mediators/{fleet-id}/employees/wallets' },
    ]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: EmployeeWalletsEntity })
  public getEmployeesWallets(
    @Param('fleetId') fleetId: string,
    @Query('limit') limit: number,
    @Query('cursor') cursor: number,
    @UserToken() token: Jwt,
  ): Observable<EmployeeWalletsCollection> {
    return this.financeService.getEmployeesWallets(token, fleetId, limit, cursor);
  }

  @Get('/employees/total-balance')
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'P', method: 'GET', url: 'api/v1/finance-mediators/{fleet-id}/employees/total-balance' },
    ]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: MoneyEntity })
  public getEmployeeWalletsTotalBalance(
    @UserToken() token: Jwt,
    @Param('fleetId') fleetId: string,
  ): Observable<EmployeeWalletsTotalBalance> {
    return this.financeService.getEmployeeWalletsTotalBalance(token, fleetId);
  }

  @Get('/employees/:employeeId/wallet')
  @ApiOperation(
    buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v1/fleets/{0}/employees/{1}/wallet' }]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: EmployeeWalletItemEntity })
  public getEmployeeWithWallet(
    @Param('fleetId') fleetId: string,
    @Param('employeeId') employeeId: string,
    @UserToken() token: Jwt,
  ): Observable<EmployeeWalletItemDto> {
    return this.financeService.getEmployeeWithWallet(token, fleetId, employeeId);
  }

  @Put('/wallet/transfers-v2/:transferId')
  @ApiOperation(
    buildApiOperationOptions([{ service: 'P', method: 'PUT', url: 'api/v2/fleets/{0}/wallet/transfers-to-card/{1}' }]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: WalletEntity })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Conflict', type: ApiErrorResponseEntity })
  @ApiResponse({ status: HttpStatus.TOO_MANY_REQUESTS, description: 'Client Error', type: ApiErrorResponseEntity })
  public withdrawToCardV2(
    @Param('fleetId') fleetId: string,
    @Param('transferId') transferId: string,
    @Body() body: MoneyDto,
    @UserToken() token: Jwt,
  ): Observable<void> {
    return this.financeService.withdrawToCardV2(token, fleetId, transferId, body);
  }

  @Post('/wallet/transfers/transfer-to-fleet')
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'P', method: 'POST', url: 'api/v1/fleets/{0}/wallet/:transfer-from-employees' },
    ]),
  )
  @ApiBody({ type: WalletTransferEntity })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  public transferToFleet(
    @Param('fleetId') fleetId: string,
    @Body() body: WalletTransferDto,
    @UserToken() token: Jwt,
  ): Observable<void> {
    return this.financeService.transferToFleet(token, fleetId, body);
  }

  @Post('/wallet/transfers/transfer-to-employees')
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'P', method: 'POST', url: 'api/v1/fleets/{0}/wallet/:transfer-to-employees' },
    ]),
  )
  @ApiBody({ type: WalletTransferEntity })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  public transferToEmployees(
    @Param('fleetId') fleetId: string,
    @Body() body: WalletTransferDto,
    @UserToken() token: Jwt,
  ): Observable<void> {
    return this.financeService.transferToEmployees(token, fleetId, body);
  }

  @Get('/wallet-transactions')
  @ApiOperation(
    buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v1/fleets/{0}/wallet/transactions' }]),
  )
  @ApiQuery({ name: 'date_from', required: false, type: Number })
  @ApiQuery({ name: 'date_to', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: TransactionsCollectionEntity })
  public getFleetWalletTransactions(
    @Param('fleetId') fleetId: string,
    @UserToken() token: Jwt,
    @Query('date_from') date_from: number,
    @Query('date_to') date_to: number,
    @Query('offset') offset: number,
    @Query('limit') limit: number,
  ): Observable<InfinityScrollCollectionDto<TransactionDto>> {
    return this.financeService.getFleetWalletTransactions(token, fleetId, date_from, date_to, offset, limit);
  }

  @Get('/employees/:employeeId/wallet-transactions')
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'P', method: 'GET', url: 'api/v1/fleets/{0}/employees/{1}/wallet/transactions' },
    ]),
  )
  @ApiQuery({ name: 'date_from', required: false, type: Number })
  @ApiQuery({ name: 'date_to', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: TransactionsCollectionEntity })
  public getEmployeeTransactions(
    @Param('fleetId') fleetId: string,
    @Param('employeeId') employeeId: string,
    @UserToken() token: Jwt,
    @Query('date_from') date_from: number,
    @Query('date_to') date_to: number,
    @Query('offset') offset: number,
    @Query('limit') limit: number,
  ): Observable<InfinityScrollCollectionDto<TransactionDto>> {
    return this.financeService.getEmployeeTransactions(token, fleetId, employeeId, date_from, date_to, offset, limit);
  }

  @Get('/payment-card')
  @ApiOperation(
    buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v1/fleets/{fleet-id}/payment-card' }]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: PaymentCardEntity })
  public getFleetPaymentCard(@Param('fleetId') fleetId: string, @UserToken() token: Jwt): Observable<PaymentCardDto> {
    return this.financeService.getFleetPaymentCard(token, fleetId);
  }

  @Get('/last-transactions-status')
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'P', method: 'GET', url: '/api/v1/fleets/{fleet-id}/wallet/transfers-to-card' },
    ]),
  )
  @ApiParam({ name: 'fleetId', required: true, type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: TransactionStatusEntity })
  public getLastFleetTransactionStatus(
    @Param('fleetId') fleetId: string,
    @UserToken() token: Jwt,
  ): Observable<TransactionStatusDto> {
    return this.financeService.getLastFleetTransactionStatus(token, fleetId);
  }

  @Put('/payment-card')
  @ApiOperation(
    buildApiOperationOptions([{ service: 'P', method: 'PUT', url: 'api/v1/fleets/{fleet-id}/payment-card' }]),
  )
  @ApiBody({ type: AddPaymentCardEntity })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  public putFleetPaymentCard(
    @Param('fleetId') fleetId: string,
    @Body() body: AddPaymentCardDto,
    @UserToken() token: Jwt,
  ): Observable<void> {
    return this.financeService.putFleetPaymentCard(token, fleetId, body);
  }

  @Delete('/payment-card/:cardId')
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'P', method: 'DELETE', url: 'api/v2/fleets/{fleet-id}/payment-card/{card-id}' },
    ]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  public deleteFleetPaymentCard(
    @Param('fleetId') fleetId: string,
    @Param('cardId') cardId: string,
    @UserToken() token: Jwt,
  ): Observable<void> {
    return this.financeService.deleteFleetPaymentCard(token, fleetId, cardId);
  }

  @Get('/individual-entrepreneurs')
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'P', method: 'GET', url: 'api/v1/fleets/{0}/individual-entrepreneurs' },
      { service: 'P', method: 'GET', url: 'api/v1/fleets/{0}/withdrawal-type' },
    ]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: IndividualEntrepreneurCollectionEntity })
  public getFleetEntrepreneurs(
    @UserToken() token: Jwt,
    @Param('fleetId') fleetId: string,
    @Query('includeWithdrawalType') includeWithdrawalType = false,
  ): Observable<IndividualEntrepreneurCollectionDto> {
    return this.financeService.getFleetEntrepreneurs(token, fleetId, includeWithdrawalType);
  }

  @Get('/individual-entrepreneurs/:entrepreneurId')
  @ApiOperation(
    buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v1/fleets/{0}/individual-entrepreneurs/{1}' }]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: IndividualEntrepreneurEntity })
  public getFleetEntrepreneurById(
    @Param('fleetId') fleetId: string,
    @Param('entrepreneurId') entrepreneurId: string,
    @UserToken() token: Jwt,
  ): Observable<IndividualEntrepreneurDto> {
    return this.financeService.getFleetEntrepreneurById(token, fleetId, entrepreneurId);
  }

  @Delete('/individual-entrepreneurs/:entrepreneurId')
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'P', method: 'DELETE', url: 'api/v1/fleets/{0}/individual-entrepreneurs/{1}' },
    ]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  public deleteFleetEntrepreneur(
    @Param('fleetId') fleetId: string,
    @Param('entrepreneurId') entrepreneurId: string,
    @UserToken() token: Jwt,
  ): Observable<void> {
    return this.financeService.deleteFleetEntrepreneur(token, fleetId, entrepreneurId);
  }

  @Post('/individual-entrepreneurs/:entrepreneurId/select')
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'P', method: 'POST', url: 'api/v1/fleets/{0}/individual-entrepreneurs/{1}/:select' },
    ]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  public setSelectedEntrepreneur(
    @Param('fleetId') fleetId: string,
    @Param('entrepreneurId') entrepreneurId: string,
    @UserToken() token: Jwt,
  ): Observable<void> {
    return this.financeService.setSelectedEntrepreneur(token, fleetId, entrepreneurId);
  }

  @Get('/payment-channels/:paymentChannelId')
  @ApiOperation(
    buildApiOperationOptions([{ service: 'PP', method: 'GET', url: 'api/v1/admin/b2b-payments-channels/{0}' }]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: PaymentChannelEntity })
  public getPaymentChannel(
    @Param('paymentChannelId') paymentChannelId: string,
    @UserToken() token: Jwt,
  ): Observable<PaymentChannelDto> {
    return this.financeService.getPaymentChannel(paymentChannelId, token);
  }

  @Get('/withdrawal-type')
  @ApiOperation(buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v1/fleets/{0}/withdrawal-type' }]))
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: WithdrawalTypeEntity })
  public getFleetWithdrawalType(
    @Param('fleetId') fleetId: string,
    @UserToken() token: Jwt,
  ): Observable<FleetWithdrawalTypeDto> {
    return this.financeService.getFleetWithdrawalType(token, fleetId);
  }

  @Get('/withdraw-to-card-settings/:regionId')
  @ApiOperation(buildApiOperationOptions([{ service: 'PP', method: 'GET', url: 'api/v1/regions/{regionId}/settings' }]))
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: WalletToCardTransferSettingsEntity })
  public getRegionWithdrawToCardSettings(
    @Param('regionId') regionId: string,
    @UserToken() token: Jwt,
  ): Observable<WalletToCardTransferSettingsDto> {
    return this.financeService.getRegionWithdrawToCardSettings(token, regionId);
  }

  @Get('/cash-limits')
  @ApiOperation(
    buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v1/fleets/{fleet-id}/cash-limits' }]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: CashLimitsSettingsEntity })
  public getFleetCashLimits(
    @Param('fleetId') fleetId: string,
    @UserToken() token: Jwt,
  ): Observable<CashLimitsSettingsDto> {
    return this.financeService.getFleetCashLimits(token, fleetId);
  }

  @Put('/cash-limits')
  @ApiOperation(
    buildApiOperationOptions([{ service: 'P', method: 'PUT', url: 'api/v1/fleets/{fleet-id}/cash-limits' }]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  public updateFleetCashLimits(
    @Param('fleetId') fleetId: string,
    @Body() body: CashLimitsSettingsUpdateDto,
    @UserToken() token: Jwt,
  ): Observable<void> {
    return this.financeService.updateFleetCashLimits(token, fleetId, body);
  }

  @Put('/cash-limits/exceptions')
  @ApiOperation(
    buildApiOperationOptions([{ service: 'P', method: 'PUT', url: 'api/v1/fleets/{fleet-id}/cash-limits/exceptions' }]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  public updateCashLimitsForDrivers(
    @Param('fleetId') fleetId: string,
    @Body() body: CashLimitsDriversSettingsUpdateDto,
    @UserToken() token: Jwt,
  ): Observable<void> {
    return this.financeService.updateDriversCashLimits(token, fleetId, body);
  }
}
