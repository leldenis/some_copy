import { ApiErrorResponseEntity } from '@api/common/entities';
import { buildApiOperationOptions } from '@api/common/utils/swagger/build-api-operation-options';
import { ActiveSurveyEntity } from '@api/controllers/surveys/entities';
import { ActiveSurveyDto, SurveyResponseDto } from '@data-access';
import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';

import { Jwt, UserToken } from '@uklon/nest-core';

import { SurveysService } from './surveys.service';

@ApiTags('Surveys')
@Controller('/surveys')
export class SurveysController {
  constructor(private readonly surveysService: SurveysService) {}

  @Get('/active')
  @ApiOperation(buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v1/me/fleets/surveys/active' }]))
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: ActiveSurveyEntity })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request', type: ApiErrorResponseEntity })
  public getActiveSurvey(@UserToken() token: Jwt): Observable<ActiveSurveyDto> {
    return this.surveysService.getActiveSurvey(token);
  }

  @Post('/:surveyId/send')
  @ApiOperation(buildApiOperationOptions([{ service: 'P', method: 'PUT', url: 'api/v1/me/fleets/surveys/{id}' }]))
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request', type: ApiErrorResponseEntity })
  public sendResponse(
    @UserToken() token: Jwt,
    @Body() survey: SurveyResponseDto,
    @Param('surveyId') surveyId: string,
  ): Observable<void> {
    return this.surveysService.sendResponse(surveyId, token, survey);
  }

  @Post('/:surveyId/skip')
  @ApiOperation(
    buildApiOperationOptions([{ service: 'P', method: 'POST', url: 'api/v1/me/fleets/surveys/{id}/:skip' }]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request', type: ApiErrorResponseEntity })
  public markAsSkipped(@UserToken() token: Jwt, @Param('surveyId') surveyId: string): Observable<void> {
    return this.surveysService.markAsSkipped(surveyId, token);
  }
}
