import { CursorCollectionOkResponse } from '@api/common/decorators/cursor-collection-ok-response.decorator';
import { ApiErrorResponseEntity } from '@api/common/entities';
import { buildApiOperationOptions } from '@api/common/utils/swagger/build-api-operation-options';
import { CollectionCursorDto, FleetDetailsDto, FleetHistoryChangeItemDto, FleetHistoryType } from '@data-access';
import { Controller, Get, HttpStatus, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Observable } from 'rxjs';

import { AuthGuard, Jwt, UserToken } from '@uklon/nest-core';

import { FleetDetailsEntity, FleetHistoryItemEntity } from './entities';
import { FleetService } from './fleet.service';

@ApiTags('Fleet profile')
@Controller('/fleets')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request', type: ApiErrorResponseEntity })
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized', type: ApiErrorResponseEntity })
@ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden', type: ApiErrorResponseEntity })
@ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found', type: ApiErrorResponseEntity })
export class FleetController {
  constructor(private readonly fleetService: FleetService) {}

  @Get('/:fleetId')
  @ApiOperation(buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v1/fleets/{0}' }]))
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: FleetDetailsEntity })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request', type: ApiErrorResponseEntity })
  public getFleetById(@UserToken() token: Jwt, @Param('fleetId') fleetId: string): Observable<FleetDetailsDto> {
    return this.fleetService.getFleetById(token, fleetId);
  }

  @Get('/:fleetId/history')
  @ApiOperation(buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v1/fleets/{0}/changes-history' }]))
  @CursorCollectionOkResponse(FleetHistoryItemEntity)
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request', type: ApiErrorResponseEntity })
  public getFleetHistory(
    @UserToken() token: Jwt,
    @Param('fleetId') fleetId: string,
    @Query('cursor') cursor: number,
    @Query('limit') limit: number,
    @Query('changeType') changeType: FleetHistoryType | '',
  ): Observable<CollectionCursorDto<FleetHistoryChangeItemDto>> {
    return this.fleetService.getFleetHistory(token, fleetId, { cursor, limit, changeType });
  }

  @Get('/:fleetId/history/:changeType/:changeId')
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'P', method: 'GET', url: 'api/v1/fleets/{0}/changes-history/{1}/{2}' },
      { service: 'P', method: 'GET', url: 'api/v1/vehicles/basic-info' },
      { service: 'P', method: 'GET', url: '/api/v1/drivers/basic-info' },
      { service: 'P', method: 'GET', url: 'api/v1/users/names' },
    ]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: FleetHistoryItemEntity })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request', type: ApiErrorResponseEntity })
  public getFleetHistoryAdditionalInfo(
    @UserToken() token: Jwt,
    @Param('fleetId') fleetId: string,
    @Param('changeId') changeId: string,
    @Param('changeType') changeType: FleetHistoryType,
  ): Observable<FleetHistoryChangeItemDto> {
    return this.fleetService.getFleetHistoryAdditionalInfo(token, fleetId, changeType, changeId);
  }
}
