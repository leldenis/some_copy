import { DefaultController, PaginationCollectionOkResponse } from '@api/common';
import { CursorCollectionOkResponse } from '@api/common/decorators/cursor-collection-ok-response.decorator';
import { PhotosEntity } from '@api/common/entities/photos.entitiy';
import { RemoveReasonEntity } from '@api/common/entities/remove-reason.entity';
import { ToSecondsPipe } from '@api/common/pipes';
import { buildApiOperationOptions } from '@api/common/utils/swagger/build-api-operation-options';
import { DriversService } from '@api/controllers/drivers/drivers.service';
import { DriverDetailsEntity } from '@api/controllers/drivers/entities/driver-details.entity';
import { DriverBasicInfoEntity } from '@api/controllers/drivers/entities/driver-name-by-id.entitiy';
import { DriverPhotoControlQueryParamsEntity } from '@api/controllers/drivers/entities/driver-photo-control-query-params.entity';
import { DriverProductConfigurationsCollectionEntity } from '@api/controllers/drivers/entities/driver-product-configurations-collection.entity';
import { FleetDriverRegistrationTicketEntity } from '@api/controllers/drivers/entities/driver-ticket.entity';
import { DriverEntity } from '@api/controllers/drivers/entities/driver.entity';
import { DriversQueryParamsEntity } from '@api/controllers/drivers/entities/drivers-query-params.entity';
import { DriversPhotoControlService } from '@api/controllers/drivers/services/drivers-photo-control.service';
import { BlockedListStatusValue, DriverStatus, PhotoSize, TicketStatus } from '@constant';
import {
  CollectionCursorDto,
  DriverAccessibilityRulesMetricsDto,
  DriverDenyListDto,
  DriverFinanceProfileDto,
  DriverHistoryChange,
  DriverHistoryChangeItemDto,
  DriverHistoryChangesDto,
  DriverProductConfigurationsCollectionDto,
  DriverRestrictionListDto,
  DriverRideConditionListDto,
  StatisticDetailsDto,
  DriverVehicleAccessSettingsDto,
  DriverVehicleAccessSettingUpdateItemDto,
  FleetDriverDto,
  FleetDriverFeedbackDto,
  FleetDriverBasicInfoDto,
  FleetDriverRegistrationTicketDto,
  FleetDriverRestrictionDeleteDto,
  FleetDriverRestrictionUpdateDto,
  InfinityScrollCollectionDto,
  PhotosDto,
  ProductConfigurationUpdateItemCollectionDto,
  RegionDto,
  RemoveReasonDto,
  SetDriverProductConfigurationDto,
  UpdateDriverFinanceProfileDto,
  DriverPhotoControlTicketsCollection,
  DriverPhotoControlTicketDto,
  PhotoControlHasActiveTicketsDto,
  FleetDriversCollection,
  CashLimitType,
  DriversByCashLimitQueryParamsDto,
  PaginationCollectionDto,
  DriverByCashLimitDto,
  RemoveCashLimitRestrictionWithResetDto,
  DriverOrderFiltersCollectionDto,
} from '@data-access';
import { Body, Delete, Get, HttpStatus, Param, ParseIntPipe, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Observable } from 'rxjs';

import { AuthGuard, Jwt, UserToken } from '@uklon/nest-core';
import { Region } from '@uklon/types';

import {
  DriverByCashLimitEntity,
  DriverDenyListEntity,
  DriverHistoryChangeItemEntity,
  DriverOrderFiltersCollectionEntity,
  DriverPhotoControlTicketEntity,
  DriverPhotoControlTicketItemEntity,
  DriverStatisticEntity,
  RegionEntity,
} from './entities';
import { FleetService } from './services';

@DefaultController('/fleets', 'Fleet drivers')
@UseGuards(AuthGuard)
export class DriversController {
  constructor(
    private readonly driversService: DriversService,
    private readonly fleetService: FleetService,
    private readonly driversPhotoControlService: DriversPhotoControlService,
  ) {}

  @Get('/:fleetId/drivers')
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'P', method: 'GET', url: 'api/v1/fleets/{0}/drivers' },
      { service: 'PG', method: 'GET', url: 'api/v1/fleet-drivers' },
    ]),
  )
  @ApiQuery({ name: 'lastname', required: false, type: String })
  @ApiQuery({ name: 'phone', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, enum: DriverStatus })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @PaginationCollectionOkResponse(DriverEntity)
  public getFleetDrivers(
    @Query()
    {
      name,
      phone,
      status,
      offset,
      limit,
      block_status,
      has_restriction_by_cash_limit,
      region_id,
      cash_limit_type,
    }: DriversQueryParamsEntity,
    @Param('fleetId') fleetId: string,
    @UserToken() token: Jwt,
  ): Observable<FleetDriversCollection> {
    return this.driversService.getFleetDrivers(
      token,
      fleetId,
      {
        name,
        phone: phone || '',
        status: status === DriverStatus.ALL ? null : status,
        offset,
        limit,
        block_status: block_status === BlockedListStatusValue.ALL ? null : block_status,
        has_restriction_by_cash_limit: has_restriction_by_cash_limit ?? null,
        cash_limit_type: cash_limit_type ?? null,
      },
      region_id,
    );
  }

  @Get('/:fleetId/drivers/get-names-by-ids')
  @ApiOperation(buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v1/drivers/basic-info' }]))
  @ApiQuery({ name: 'id', required: false, type: String, isArray: true })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: DriverBasicInfoEntity, isArray: true })
  public getDriverNamesById(@Query('id') id: string[], @UserToken() token: Jwt): Observable<FleetDriverBasicInfoDto[]> {
    return this.driversService.getDriverBasicInfo(token, id);
  }

  @Get('/:fleetId/drivers/get-names')
  @ApiOperation(
    buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v1/fleets/{0}/drivers/:get-names-by-ids' }]),
  )
  @ApiQuery({ name: 'id', required: false, type: String, isArray: true })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: DriverBasicInfoEntity, isArray: true })
  public getFleetDriversNamesByIds(
    @Param('fleetId') fleetId: string,
    @Query('id') id: string,
    @UserToken() token: Jwt,
  ): Observable<FleetDriverBasicInfoDto[]> {
    return this.driversService.getFleetDriversNamesByIds(token, fleetId, id);
  }

  @Get('/:fleetId/drivers/:driverId')
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'P', method: 'GET', url: 'api/v3/drivers/{0}' },
      { service: 'P', method: 'GET', url: 'api/v1/fleets/{0}/drivers/{1}' },
      { service: 'P', method: 'GET', url: 'api/v2/fleets/{0}/vehicles' },
    ]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: DriverDetailsEntity })
  public getFleetDriverById(
    @Param('fleetId') fleetId: string,
    @Param('driverId') driverId: string,
    @UserToken() token: Jwt,
  ): Observable<FleetDriverDto> {
    return this.driversService.getFleetDriverById(token, fleetId, driverId);
  }

  @Delete('/:fleetId/drivers/:driverId')
  @ApiOperation(buildApiOperationOptions([{ service: 'P', method: 'DELETE', url: 'api/v1/fleets/{0}/drivers/{1}' }]))
  @ApiBody({ type: RemoveReasonEntity })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  public deleteFleetVehicleById(
    @Param('fleetId') fleetId: string,
    @Param('driverId') driverId: string,
    @Body() body: RemoveReasonDto,
    @UserToken() token: Jwt,
  ): Observable<void> {
    return this.driversService.removeFleetDriverById(token, fleetId, driverId, body);
  }

  @Get('/drivers/:driverId/images')
  @ApiOperation(buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v1/drivers/{0}/images' }]))
  @ApiQuery({ name: 'image_size', enum: PhotoSize })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: PhotosEntity })
  public getDriverPhotos(
    @Param('driverId') driverId: string,
    @Query('image_size') image_size: PhotoSize,
    @UserToken() token: Jwt,
  ): Observable<PhotosDto> {
    return this.driversService.getDriverPhotos(token, driverId, image_size);
  }

  @Get('/:fleetId/drivers/:driverId/products/configurations')
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'P', method: 'GET', url: 'api/v1/fleets/{0}/drivers/{1}/products/configurations' },
    ]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: DriverProductConfigurationsCollectionEntity })
  public getFleetDriverProductsConfigurations(
    @Param('fleetId') fleetId: string,
    @Param('driverId') driverId: string,
    @UserToken() token: Jwt,
  ): Observable<DriverProductConfigurationsCollectionDto> {
    return this.driversService.getFleetDriverProductsConfigurations(token, fleetId, driverId);
  }

  @Put('/:fleetId/drivers/:driverId/products/configurations')
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'P', method: 'PUT', url: 'api/v1/fleets/{0}/drivers/{1}/products/configurations' },
    ]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  public updateFleetDriverProductConfigurations(
    @Param('fleetId') fleetId: string,
    @Param('driverId') driverId: string,
    @Body() body: ProductConfigurationUpdateItemCollectionDto,
    @UserToken() token: Jwt,
  ): Observable<void> {
    return this.driversService.updateFleetDriverProductConfigurations(token, fleetId, driverId, body);
  }

  @Put('/:fleetId/drivers/:driverId/products/:productId/configurations')
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'P', method: 'PUT', url: 'api/v1/fleets/{0}/drivers/{1}/products/{2}/configurations' },
    ]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  public updateFleetDriverProductConfigurationsById(
    @Param('fleetId') fleetId: string,
    @Param('driverId') driverId: string,
    @Param('productId') productId: string,
    @Body() body: SetDriverProductConfigurationDto,
    @UserToken() token: Jwt,
  ): Observable<void> {
    return this.driversService.updateFleetDriverProductConfigurationsById(token, fleetId, driverId, productId, body);
  }

  @Get('/:fleetId/drivers/:driverId/restrictions')
  @ApiOperation(
    buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v1/fleets/{0}/drivers/{1}/restrictions' }]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  public getFleetDriverRestrictions(
    @Param('fleetId') fleetId: string,
    @Param('driverId') driverId: string,
    @UserToken() token: Jwt,
  ): Observable<DriverRestrictionListDto> {
    return this.driversService.getFleetDriverRestrictions(token, fleetId, driverId);
  }

  @Get('/:fleetId/drivers/:driverId/restrictions/settings')
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'P', method: 'GET', url: 'api/v1/fleets/{0}/drivers/{1}/restrictions/settings' },
    ]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  public getFleetDriverRestrictionsSettings(
    @Param('fleetId') fleetId: string,
    @Param('driverId') driverId: string,
    @UserToken() token: Jwt,
  ): Observable<DriverRestrictionListDto> {
    return this.driversService.getFleetDriverRestrictionsSettings(token, fleetId, driverId);
  }

  @Put('/:fleetId/drivers/:driverId/restrictions')
  @ApiOperation(
    buildApiOperationOptions([{ service: 'P', method: 'PUT', url: 'api/v1/fleets/{0}/drivers/{1}/restrictions' }]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  public setFleetDriverRestrictions(
    @Param('fleetId') fleetId: string,
    @Param('driverId') driverId: string,
    @Body() body: FleetDriverRestrictionUpdateDto,
    @UserToken() token: Jwt,
  ): Observable<unknown> {
    return this.driversService.setFleetDriverRestriction(token, fleetId, driverId, body);
  }

  @Delete('/:fleetId/drivers/:driverId/restrictions')
  @ApiOperation(
    buildApiOperationOptions([{ service: 'P', method: 'DELETE', url: 'api/v1/fleets/{0}/drivers/{1}/restrictions' }]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  public delFleetDriverRestrictions(
    @Param('fleetId') fleetId: string,
    @Param('driverId') driverId: string,
    @Body() body: FleetDriverRestrictionDeleteDto,
    @UserToken() token: Jwt,
  ): Observable<unknown> {
    return this.driversService.delFleetDriverRestriction(token, fleetId, driverId, body);
  }

  @Get('/:fleetId/drivers/:driverId/finance-profile')
  @ApiOperation(
    buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v1/fleets/{0}/drivers/{1}/finance-profile' }]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  public getFinanceProfile(
    @Param('fleetId') fleetId: string,
    @Param('driverId') driverId: string,
    @UserToken() token: Jwt,
  ): Observable<DriverFinanceProfileDto> {
    return this.driversService.getFinanceProfile(token, fleetId, driverId);
  }

  @Put('/:fleetId/drivers/:driverId/finance-profile')
  @ApiOperation(
    buildApiOperationOptions([{ service: 'P', method: 'PUT', url: 'api/v1/fleets/{0}/drivers/{1}/finance-profile' }]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  public setFinanceProfile(
    @Param('fleetId') fleetId: string,
    @Param('driverId') driverId: string,
    @Body() body: UpdateDriverFinanceProfileDto,
    @UserToken() token: Jwt,
  ): Observable<unknown> {
    return this.driversService.setFinanceProfile(token, fleetId, driverId, body);
  }

  // eslint-disable-next-line @darraghor/nestjs-typed/api-method-should-specify-api-response
  @Get('/:fleetId/driver-tickets')
  @ApiOperation(
    buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v1/fleets/{0}/tickets/drivers/registrations' }]),
  )
  @CursorCollectionOkResponse(FleetDriverRegistrationTicketEntity)
  public getTickets(
    @Param('fleetId') fleetId: string,
    @Query('limit') limit: number,
    @Query('cursor') cursor: string,
    @Query('phone') phone: string,
    @Query('status') status: TicketStatus,
    @UserToken() token: Jwt,
  ): Observable<CollectionCursorDto<FleetDriverRegistrationTicketDto>> {
    return this.driversService.getTickets(token, fleetId, { limit, cursor }, { phone, status });
  }

  @Get('/:fleetId/driver-feedbacks')
  @ApiOperation(buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v1/fleets/{0}/drivers/feedbacks' }]))
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  public getFeedbacks(
    @Param('fleetId') fleetId: string,
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @Query('created_at_from') created_at_from: number,
    @Query('created_at_to') created_at_to: number,
    @Query('driver_id') driver_id: string,
    @UserToken() token: Jwt,
  ): Observable<InfinityScrollCollectionDto<FleetDriverFeedbackDto>> {
    return this.driversService.getFeedbacks(
      token,
      fleetId,
      { limit, offset },
      { created_at_from, created_at_to, driver_id },
    );
  }

  @Get('/:fleetId/drivers/:driverId/ride-conditions')
  @ApiOperation(buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v1/drivers/{0}/ride-conditions' }]))
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  public getDriverRideConditions(
    @Param('driverId') driverId: string,
    @UserToken() token: Jwt,
  ): Observable<DriverRideConditionListDto> {
    return this.driversService.getDriverRideConditions(token, driverId);
  }

  @Get('/:fleetId/drivers/:driverId/statistic')
  @ApiOperation(
    buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v2/fleets/{0}/drivers/{1}/statistic' }]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: DriverStatisticEntity })
  public getFleetDriverStatistic(
    @Param('fleetId') fleetId: string,
    @Param('driverId') driverId: string,
    @Query('date_from', ParseIntPipe, ToSecondsPipe) date_from: number,
    @Query('date_to', ParseIntPipe, ToSecondsPipe) date_to: number,
    @UserToken() token: Jwt,
  ): Observable<StatisticDetailsDto> {
    return this.driversService.getFleetDriverStatistic(token, fleetId, driverId, { date_from, date_to });
  }

  @Get('/:fleetId/drivers/:driverId/accessibility-rules-metrics')
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'P', method: 'GET', url: 'api/v1/fleets/{0}/drivers/{1}/accessibility-rules-metrics' },
    ]),
  )
  @PaginationCollectionOkResponse(DriverEntity)
  public getFleetDriverAccessibilityRulesMetrics(
    @Param('fleetId') fleetId: string,
    @Param('driverId') driverId: string,
    @UserToken() token: Jwt,
  ): Observable<DriverAccessibilityRulesMetricsDto> {
    return this.driversService.getFleetDriverAccessibilityRulesMetrics(token, fleetId, driverId);
  }

  @Get('/region/:regionId')
  @ApiOperation(buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v1/regions/{0}' }]))
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: RegionEntity })
  public getRegion(@Param('regionId') regionId: string, @UserToken() token: Jwt): Observable<RegionDto> {
    return this.fleetService.getRegion(regionId, token);
  }

  // eslint-disable-next-line @darraghor/nestjs-typed/api-method-should-specify-api-response
  @Get('/drivers/:driverId/changes-history')
  @ApiOperation(buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v1/drivers/{0}/changes-history' }]))
  @CursorCollectionOkResponse(DriverHistoryChangeItemEntity)
  public getFleetDriverHistory(
    @Param('driverId') driverId: string,
    @Query('limit') limit: number,
    @Query('cursor') cursor: string,
    @Query('vehicleId') vehicleId: string,
    @Query('fleetId') fleetId: string,
    @Query('changeType') changeType: string,
    @UserToken() token: Jwt,
  ): Observable<DriverHistoryChangesDto> {
    return this.driversService.getFleetDriverHistory(token, driverId, vehicleId, fleetId, changeType, {
      limit,
      cursor,
    });
  }

  @Get('/drivers/:driverId/changes-history/:changeType/:eventId')
  @ApiOperation(
    buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v1/drivers/{0}/changes-history/{1}/{2}' }]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: DriverHistoryChangeItemEntity })
  public getFleetDriverHistoryChangeInfo(
    @Param('driverId') driverId: string,
    @Param('changeType') changeType: DriverHistoryChange,
    @Param('eventId') eventId: string,
    @UserToken() token: Jwt,
  ): Observable<DriverHistoryChangeItemDto> {
    return this.driversService.getFleetDriverHistoryChangeInfo(token, driverId, changeType, eventId);
  }

  @Get('/drivers/:driverId/deny-list')
  @ApiOperation(buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v1/drivers/{0}/deny-list' }]))
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: DriverDenyListEntity })
  public getDenyList(@Param('driverId') driverId: string, @UserToken() token: Jwt): Observable<DriverDenyListDto> {
    return this.driversService.getDenyList(driverId, token);
  }

  @Delete('/drivers/:driverId/deny-list')
  @ApiOperation(buildApiOperationOptions([{ service: 'P', method: 'DELETE', url: 'api/v1/drivers/{0}/deny-list' }]))
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  public clearDenyList(@Param('driverId') driverId: string, @UserToken() token: Jwt): Observable<void> {
    return this.driversService.clearDenyList(driverId, token);
  }

  @Get('/:fleetId/drivers/:driverId/access-to-vehicles')
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'P', method: 'GET', url: 'api/v1/fleets/{0}/drivers/{1}/access-to-vehicles' },
    ]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  public getFleetDriverAccessSettings(
    @Param('fleetId') fleetId: string,
    @Param('driverId') driverId: string,
    @UserToken() token: Jwt,
  ): Observable<DriverVehicleAccessSettingsDto> {
    return this.driversService.getFleetDriverAccessSettings(token, fleetId, driverId);
  }

  @Put('/:fleetId/drivers/:driverId/access-to-all-vehicles')
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'P', method: 'PUT', url: 'api/v1/fleets/{0}/drivers/{1}/access-to-all-vehicles' },
    ]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  public grantFleetDriverAccessToAllVehicles(
    @Param('fleetId') fleetId: string,
    @Param('driverId') driverId: string,
    @UserToken() token: Jwt,
    @Body() body: object,
  ): Observable<void> {
    return this.driversService.grantFleetDriverAccessToAllVehicles(token, fleetId, driverId, body);
  }

  @Put('/:fleetId/drivers/:driverId/access-to-vehicles')
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'P', method: 'PUT', url: 'api/v1/fleets/{0}/drivers/{1}/access-to-vehicles' },
    ]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  public grantFleetDriverAccessToSpecificVehicles(
    @Param('fleetId') fleetId: string,
    @Param('driverId') driverId: string,
    @UserToken() token: Jwt,
    @Body() body: DriverVehicleAccessSettingUpdateItemDto,
  ): Observable<void> {
    return this.driversService.grantFleetDriverAccessToSpecificVehicles(token, fleetId, driverId, body);
  }

  @Delete('/:fleetId/drivers/:driverId/access-to-all-vehicles')
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'P', method: 'DELETE', url: 'api/v1/fleets/{0}/drivers/{1}/access-to-all-vehicles' },
    ]),
  )
  @ApiBody({ type: RemoveReasonEntity })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  public removeFleetDriverAccessFromAllVehicles(
    @Param('fleetId') fleetId: string,
    @Param('driverId') driverId: string,
    @UserToken() token: Jwt,
  ): Observable<void> {
    return this.driversService.removeFleetDriverAccessFromAllVehicles(token, fleetId, driverId);
  }

  @Get('/:fleetId/drivers-photo-control-tickets')
  @ApiOperation(
    buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v1/fleets/{0}/tickets/drivers/photo-control' }]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: DriverPhotoControlTicketItemEntity })
  public getFleetDriversPhotoControlTickets(
    @UserToken() token: Jwt,
    @Param('fleetId') fleetId: string,
    @Query() query: DriverPhotoControlQueryParamsEntity,
  ): Observable<DriverPhotoControlTicketsCollection> {
    return this.driversPhotoControlService.getDriversPhotoControlTickets(token, fleetId, query);
  }

  @Get('/:fleetId/drivers/driver-photo-control/has-active-tickets')
  @ApiOperation(
    buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v1/fleets/{0}/tickets/drivers/photo-control' }]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  public getDriversActivePhotoControlExist(
    @Param('fleetId') fleetId: string,
    @UserToken() token: Jwt,
  ): Observable<PhotoControlHasActiveTicketsDto> {
    return this.driversPhotoControlService.getDriversActivePhotoControlExist(token, fleetId);
  }

  @Get('/driver-photo-control/:ticketId')
  @ApiOperation(
    buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v1/tickets/driver-photo-control/{0}' }]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: DriverPhotoControlTicketEntity })
  public getVehiclePhotoControlTicket(
    @Param('ticketId') ticketId: string,
    @UserToken() token: Jwt,
  ): Observable<DriverPhotoControlTicketDto> {
    return this.driversPhotoControlService.getDriverPhotoControlTicket(token, ticketId);
  }

  @Get('/:fleetId/drivers-by-cash-limit')
  @ApiOperation(
    buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v1/fleets/{fleet-id}/drivers/by-cash-limit' }]),
  )
  @ApiQuery({ name: 'cash_limit_type', required: false, enum: CashLimitType })
  @ApiQuery({ name: 'from', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: true, type: Number })
  @PaginationCollectionOkResponse(DriverByCashLimitEntity)
  public getDriversByCashLimit(
    @Query() query: DriversByCashLimitQueryParamsDto,
    @Param('fleetId') fleetId: string,
    @UserToken() token: Jwt,
  ): Observable<PaginationCollectionDto<DriverByCashLimitDto>> {
    return this.driversService.getDriversByCashLimit(token, fleetId, query);
  }

  @Delete('/:fleetId/drivers/:driverId/restrictions/cash-limit')
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'P', method: 'DELETE', url: 'api/v1/fleets/{fleet-id}/drivers/{driver-id}/restrictions/cash-limit' },
    ]),
  )
  @ApiParam({ name: 'fleetId', required: true, type: String })
  @ApiParam({ name: 'driverId', required: true, type: String })
  @ApiBody({ type: RemoveReasonEntity })
  public deleteCashLimitRestrictionForDriver(
    @Param('fleetId') fleetId: string,
    @Param('driverId') driverId: string,
    @Body() body: RemoveCashLimitRestrictionWithResetDto,
    @UserToken() token: Jwt,
  ): Observable<void> {
    return this.driversService.deleteCashLimitRestrictionForDriver(token, fleetId, driverId, body);
  }

  @Get(':fleetId/drivers/:driverId/filters/active')
  @ApiOperation(
    buildApiOperationOptions([
      {
        service: 'P',
        method: 'GET',
        url: 'api/v1/fleets/{fleet-id}/drivers/{driver-id}/order-filters/active',
      },
    ]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: DriverOrderFiltersCollectionEntity })
  public getDriverActiveFilters(
    @Param('driverId') driverId: string,
    @Param('fleetId') fleetId: string,
    @Query('regionId') regionId: Region,
    @UserToken() token: Jwt,
  ): Observable<DriverOrderFiltersCollectionDto> {
    return this.driversService.getDriverActiveFilters(token, fleetId, driverId, regionId);
  }
}
