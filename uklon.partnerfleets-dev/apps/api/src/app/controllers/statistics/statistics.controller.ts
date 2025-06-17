import { ApiErrorResponseEntity } from '@api/common/entities';
import { buildApiOperationOptions } from '@api/common/utils/swagger/build-api-operation-options';
import { DashboardStatisticsDto } from '@data-access';
import { Controller, Get, HttpStatus, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Observable } from 'rxjs';

import { AuthGuard, Jwt, UserToken } from '@uklon/nest-core';

import { DashboardStatisticsEntity } from './entities/dashboard-statistics.entity';
import { StatisticsService } from './statistics.service';

@ApiTags('Statistics')
@Controller('/statistics')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request', type: ApiErrorResponseEntity })
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized', type: ApiErrorResponseEntity })
@ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden', type: ApiErrorResponseEntity })
@ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found', type: ApiErrorResponseEntity })
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('/:fleetId/dashboard')
  @ApiOperation(buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v1/fleets/{0}/dashboard' }]))
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: DashboardStatisticsEntity })
  public getDriverNamesById(
    @Param('fleetId') fleetId: string,
    @Query('dateFrom') date_from: string,
    @Query('dateTo') date_to: string,
    @UserToken() token: Jwt,
  ): Observable<DashboardStatisticsDto> {
    return this.statisticsService.getDashboardStatistics(token, fleetId, date_from, date_to);
  }
}
