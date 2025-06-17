import { CursorCollectionOkResponse } from '@api/common/decorators/cursor-collection-ok-response.decorator';
import { ApiErrorResponseEntity } from '@api/common/entities';
import { buildApiOperationOptions } from '@api/common/utils/swagger/build-api-operation-options';
import {
  UklonGarageApplicationEntity,
  UklonGarageFleetApplicationEntity,
} from '@api/controllers/uklon-garage/entities/uklon-garage.entity';
import {
  CollectionCursorDto,
  UklonGarageApplicationDto,
  UklonGarageApplicationStatus,
  UklonGarageFleetApplicationDto,
} from '@data-access';
import { Body, Controller, Get, HttpStatus, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';

import { AuthGuard, Jwt, UserToken } from '@uklon/nest-core';

import { UklonGarageService } from './uklon-garage.service';

@ApiTags('Uklon Garage')
@Controller('/uklon-garage')
export class UklonGarageController {
  constructor(private readonly garageService: UklonGarageService) {}

  // eslint-disable-next-line @darraghor/nestjs-typed/api-method-should-specify-api-response
  @Get('/fleets/:fleetId/applications')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation(buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v1/fleets/{id}/applies' }]))
  @CursorCollectionOkResponse(UklonGarageFleetApplicationEntity)
  public getApplications(
    @UserToken() token: Jwt,
    @Param('fleetId') fleetId: string,
    @Query('limit') limit: number,
    @Query('cursor') cursor: string,
    @Query('status') status?: UklonGarageApplicationStatus,
    @Query('phone') phone?: string,
  ): Observable<CollectionCursorDto<UklonGarageFleetApplicationDto>> {
    return this.garageService.getApplications(token, fleetId, { limit, cursor }, { status, phone });
  }

  @Post('/fleets/:fleetId/application/:applicationId')
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'P', method: 'POST', url: 'api/v1/fleets/{fleetId}/applies/{applicationId}' },
    ]),
  )
  @ApiBody({ type: UklonGarageApplicationEntity })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request', type: ApiErrorResponseEntity })
  public applyForJob(
    @Param('fleetId') fleetId: string,
    @Param('applicationId') applicationId: string,
    @Body() body: UklonGarageApplicationDto,
  ): Observable<void> {
    return this.garageService.applyForJob(fleetId, applicationId, body);
  }

  @Post('application/:applicationId/approve')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation(
    buildApiOperationOptions([{ service: 'P', method: 'POST', url: 'api/v1/applies/{application-id}/:approve' }]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request', type: ApiErrorResponseEntity })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Application already approved by Uklon Manager',
    type: ApiErrorResponseEntity,
  })
  public approveApplication(@UserToken() token: Jwt, @Param('applicationId') applicationId: string): Observable<void> {
    return this.garageService.approveApplication(applicationId, token);
  }

  @Post('application/:applicationId/reject')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation(
    buildApiOperationOptions([{ service: 'P', method: 'POST', url: 'api/v1/applies/{application-id}/:reject' }]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request', type: ApiErrorResponseEntity })
  public rejectApplication(@UserToken() token: Jwt, @Param('applicationId') applicationId: string): Observable<void> {
    return this.garageService.rejectApplication(applicationId, token);
  }

  @Post('application/:applicationId/review')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation(
    buildApiOperationOptions([{ service: 'P', method: 'POST', url: 'api/v1/applies/{application-id}/:review' }]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request', type: ApiErrorResponseEntity })
  public reviewApplication(@UserToken() token: Jwt, @Param('applicationId') applicationId: string): Observable<void> {
    return this.garageService.reviewApplication(applicationId, token);
  }
}
