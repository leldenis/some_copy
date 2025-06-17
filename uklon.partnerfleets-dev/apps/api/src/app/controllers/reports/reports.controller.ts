import { CursorCollectionOkResponse } from '@api/common/decorators/cursor-collection-ok-response.decorator';
import { buildApiOperationOptions } from '@api/common/utils/swagger/build-api-operation-options';
import { DriversOrdersReportEntity, VehicleOrderReportEntity } from '@api/controllers/reports/entities';
import {
  DriversOrdersReportDto,
  InfinityScrollCollectionDto,
  ReportByOrdersDto,
  ReportByOrdersQueryDto,
  VehicleOrderReportCollectionDto,
  VehicleOrderReportQueryDto,
} from '@data-access';
import { Controller, Get, HttpStatus, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';

import { AuthGuard, Jwt, UserToken } from '@uklon/nest-core';

import { ReportsService } from './reports.service';

@ApiTags('Fleet reports')
@Controller('/fleets/reports/:fleetId')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly service: ReportsService) {}

  @Get('/drivers-orders')
  @ApiOperation(
    buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v1/fleets/{0}/drivers/report-by-orders' }]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: DriversOrdersReportEntity })
  public getReportByOrders(
    @Param('fleetId') fleetId: string,
    @Query('dateFrom') dateFrom: number,
    @Query('dateTo') dateTo: number,
    @Query('driverId') driverId: string,
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @UserToken() token: Jwt,
  ): Observable<InfinityScrollCollectionDto<DriversOrdersReportDto>> {
    const queryParams: ReportByOrdersQueryDto = {
      date_from: dateFrom,
      date_to: dateTo,
      driver_id: driverId,
      limit,
      offset,
    };

    return this.service.getFleetReportByOrders(token, fleetId, queryParams);
  }

  @Get('/couriers-orders')
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'P', method: 'GET', url: 'api/v1/finance-mediators/{0}/couriers/report-by-orders' },
    ]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  public getCouriersReports(
    @Param('fleetId') fleetId: string,
    @Query('from') from: number,
    @Query('to') to: number,
    @Query('courier_id') courier_id: string,
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @UserToken() token: Jwt,
  ): Observable<InfinityScrollCollectionDto<ReportByOrdersDto>> {
    return this.service.getCouriersReports(token, fleetId, { from, to, courier_id, limit, offset });
  }

  // eslint-disable-next-line @darraghor/nestjs-typed/api-method-should-specify-api-response
  @Get('/vehicles/report-by-orders')
  @ApiOperation(
    buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v1/fleets/{0}/vehicles/report-by-orders' }]),
  )
  @CursorCollectionOkResponse(VehicleOrderReportEntity)
  public getVehicleOrderReports(
    @Param('fleetId') fleetId: string,
    @Query() query: VehicleOrderReportQueryDto,
    @UserToken() token: Jwt,
  ): Observable<VehicleOrderReportCollectionDto> {
    return this.service.getVehicleOrderReports(fleetId, query, token);
  }
}
