import { CursorCollectionOkResponse } from '@api/common/decorators/cursor-collection-ok-response.decorator';
import { PhotosEntity } from '@api/common/entities/photos.entitiy';
import { ToSecondsPipe } from '@api/common/pipes';
import { buildApiOperationOptions } from '@api/common/utils/swagger/build-api-operation-options';
import { CouriersService } from '@api/controllers/couriers/couriers.service';
import { CouriersDetailsEntity } from '@api/controllers/couriers/entities/courier-details.entity';
import { CourierHistoryChangeItemEntity } from '@api/controllers/couriers/entities/courier-history-change-item.entity';
import { CourierItemEntity } from '@api/controllers/couriers/entities/courier-item.entity';
import { CourierProductCollectionEntity } from '@api/controllers/couriers/entities/courier-product-collection.entity';
import { CourierHistoryChange, PhotoSize } from '@constant';
import {
  CollectionCursorDto,
  CourierDetailsDto,
  CourierHistoryChangeItemDto,
  CourierHistoryChangesDto,
  CourierItemDto,
  CourierRestrictionRemoveDto,
  CourierRestrictionListDto,
  CourierRestrictionUpdateDto,
  StatisticDetailsDto,
  ProductConfigurationUpdateItemCollectionDto,
  CourierProductCollectionDto,
  PhotosDto,
  InfinityScrollCollectionDto,
  FleetCourierFeedbackDto,
} from '@data-access';
import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Observable, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthGuard, Jwt, UserToken } from '@uklon/nest-core';

@ApiTags('Couriers')
@Controller('/couriers')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class CouriersController {
  constructor(private readonly couriersService: CouriersService) {}

  // eslint-disable-next-line @darraghor/nestjs-typed/api-method-should-specify-api-response
  @Get('/:fleetId')
  @ApiOperation(
    buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v1/finance-mediators/{0}/couriers' }]),
  )
  @CursorCollectionOkResponse(CourierItemEntity)
  public getFleetCouriers(
    @Param('fleetId') fleetId: string,
    @Query('name') name: string,
    @Query('phone') phone: string,
    @Query('cursor') cursor: string,
    @Query('limit') limit: number,
    @UserToken() token: Jwt,
  ): Observable<CollectionCursorDto<CourierItemDto>> {
    return this.couriersService.getFleetCouriers(token, fleetId, name, phone, {
      cursor,
      limit,
    });
  }

  @Get('/:fleetId/couriers/:courierId')
  @ApiOperation(
    buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v1/finance-mediators/{0}/couriers/{1}' }]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: CouriersDetailsEntity })
  public getFleetCourierById(
    @Param('fleetId') fleetId: string,
    @Param('courierId') courierId: string,
    @UserToken() token: Jwt,
  ): Observable<CourierDetailsDto> {
    return this.couriersService.getFleetCourierById(token, fleetId, courierId).pipe(
      switchMap((courier) => {
        return this.couriersService
          .getCourierActivitySettings(token, courier.registration_region_id)
          .pipe(map((activitySettings) => ({ ...courier, activitySettings })));
      }),
    );
  }

  @Delete('/:fleetId/couriers/:courierId')
  @ApiOperation(
    buildApiOperationOptions([{ service: 'P', method: 'DELETE', url: 'api/v1/finance-mediators/{0}/couriers/{1}' }]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  public deleteFleetCourierById(
    @Param('fleetId') fleetId: string,
    @Param('courierId') courierId: string,
    @UserToken() token: Jwt,
  ): Observable<void> {
    return this.couriersService.removeFleetCourierById(token, fleetId, courierId);
  }

  @Get('/:fleetId/employees/:courierId/statistic')
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'P', method: 'GET', url: 'api/v1/finance-mediators/{0}/employees/{1}/statistic' },
    ]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  public getFleetCourierStatistic(
    @Param('fleetId') fleetId: string,
    @Param('courierId') courierId: string,
    @Query('date_from', ParseIntPipe, ToSecondsPipe) date_from: number,
    @Query('date_to', ParseIntPipe, ToSecondsPipe) date_to: number,
    @UserToken() token: Jwt,
  ): Observable<StatisticDetailsDto> {
    return this.couriersService.getFleetCourierStatistic(token, fleetId, courierId, { date_from, date_to });
  }

  // eslint-disable-next-line @darraghor/nestjs-typed/api-method-should-specify-api-response
  @Get('/:courierId/changes-history')
  @ApiOperation(buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v1/couriers/{0}/changes-history' }]))
  @CursorCollectionOkResponse(CourierHistoryChangeItemEntity)
  public getFleetCourierHistory(
    @Param('courierId') courierId: string,
    @Query('limit') limit: number,
    @Query('cursor') cursor: string,
    @Query('fleetId') fleetId: string,
    @Query('changeType') changeType: string,
    @UserToken() token: Jwt,
  ): Observable<CourierHistoryChangesDto> {
    return this.couriersService.getFleetCourierHistory(token, courierId, fleetId, changeType, {
      limit,
      cursor,
    });
  }

  @Get('/:courierId/changes-history/:changeType/:eventId')
  @ApiOperation(
    buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v1/couriers/{0}/changes-history/{1}/{2}' }]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: CourierHistoryChangeItemEntity })
  public getFleetCourierHistoryChangeInfo(
    @Param('courierId') courierId: string,
    @Param('changeType') changeType: CourierHistoryChange,
    @Param('eventId') eventId: string,
    @UserToken() token: Jwt,
  ): Observable<CourierHistoryChangeItemDto> {
    return this.couriersService.getFleetCourierHistoryChangeInfo(token, courierId, changeType, eventId);
  }

  @Get('/:fleetId/couriers/:courierId/restrictions/settings')
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'P', method: 'GET', url: 'api/v1/finance-mediators/{0}/couriers/{1}/restrictions/settings' },
    ]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  public getFleetCourierRestrictionsSettings(
    @Param('fleetId') fleetId: string,
    @Param('courierId') courierId: string,
    @UserToken() token: Jwt,
  ): Observable<CourierRestrictionListDto> {
    return this.couriersService.getFleetCourierRestrictionsSettings(token, fleetId, courierId);
  }

  @Put('/:fleetId/couriers/:courierId/restrictions')
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'P', method: 'PUT', url: 'api/v1/finance-mediators/{0}/couriers/{1}/restrictions' },
    ]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  public updateFleetCourierRestrictions(
    @Param('fleetId') fleetId: string,
    @Param('courierId') courierId: string,
    @Body() body: CourierRestrictionUpdateDto,
    @UserToken() token: Jwt,
  ): Observable<void> {
    return this.couriersService.updateFleetCourierRestriction(token, fleetId, courierId, body);
  }

  @Delete('/:fleetId/couriers/:courierId/restrictions')
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'P', method: 'DELETE', url: 'api/v1/finance-mediators/{0}/couriers/{1}/restrictions' },
    ]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  public removeFleetCourierRestrictions(
    @Param('fleetId') fleetId: string,
    @Param('courierId') courierId: string,
    @Body() body: CourierRestrictionRemoveDto,
    @UserToken() token: Jwt,
  ): Observable<void> {
    return this.couriersService.removeFleetCourierRestriction(token, fleetId, courierId, body);
  }

  @Get('/:fleetId/couriers/:courierId/restrictions')
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'P', method: 'GET', url: 'api/v1/finance-mediators/{0}/couriers/{1}/restrictions' },
    ]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  public getFleetCourierRestrictions(
    @Param('fleetId') fleetId: string,
    @Param('courierId') courierId: string,
    @UserToken() token: Jwt,
  ): Observable<CourierRestrictionListDto> {
    return this.couriersService.getFleetCourierRestrictions(token, fleetId, courierId);
  }

  @Get('/:fleetId/couriers/:courierId/products')
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'P', method: 'GET', url: 'api/v1/finance-mediators/{0}/couriers/{1}/products' },
    ]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: CourierProductCollectionEntity })
  public getFleetCourierProducts(
    @Param('fleetId') fleetId: string,
    @Param('courierId') courierId: string,
    @UserToken() token: Jwt,
  ): Observable<CourierProductCollectionDto> {
    return this.couriersService.getFleetCourierProducts(token, fleetId, courierId);
  }

  @Put('/:fleetId/couriers/:courierId/products')
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'P', method: 'PUT', url: 'api/v1/finance-mediators/{0}/couriers/{1}/products' },
    ]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  public updateFleetCourierProducts(
    @Param('fleetId') fleetId: string,
    @Param('courierId') courierId: string,
    @Body() body: ProductConfigurationUpdateItemCollectionDto,
    @UserToken() token: Jwt,
  ): Observable<void> {
    return this.couriersService.updateFleetCourierProducts(token, fleetId, courierId, body);
  }

  @Get('/:courierId/images')
  @ApiOperation(buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v1/couriers/{courier-id}/images' }]))
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: PhotosEntity })
  public getCourierPhotos(
    @Param('courierId') courierId: string,
    @Query('image_size') image_size: PhotoSize,
    @UserToken() token: Jwt,
  ): Observable<PhotosDto> {
    return this.couriersService.getCourierPhotos(token, courierId, image_size);
  }

  @Get('/:fleetId/feedbacks')
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'P', method: 'GET', url: 'api/v1/finance-mediator/{fleet-id}/couriers/feedbacks' },
    ]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  public getFeedbacks(
    @Param('fleetId') fleetId: string,
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @Query('created_at_from') created_at_from: number,
    @Query('created_at_to') created_at_to: number,
    @Query('courier_id') courier_id: string,
    @UserToken() token: Jwt,
  ): Observable<InfinityScrollCollectionDto<FleetCourierFeedbackDto>> {
    return this.couriersService.getFeedbacks(token, fleetId, limit, offset, created_at_from, created_at_to, courier_id);
  }
}
