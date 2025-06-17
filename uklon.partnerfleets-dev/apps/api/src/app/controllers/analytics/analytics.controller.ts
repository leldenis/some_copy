import { ApiErrorResponseEntity } from '@api/common/entities/api-error-response.entity';
import { buildApiOperationOptions } from '@api/common/utils/swagger/build-api-operation-options';
import { Body, Controller, HttpStatus, Post, Req } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Observable } from 'rxjs';

import { AnalyticsService } from './analytics.service';
import { AnalyticsEventEntity } from './entities/analytics-event.entity';

@ApiTags('Analytics')
@Controller('/analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('/register-event')
  @ApiOperation(buildApiOperationOptions([{ service: 'AS', method: 'POST', url: 'api/v1/events/_bulk' }]))
  @ApiBody({ type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request', type: ApiErrorResponseEntity })
  public registerEvent(@Body() body: AnalyticsEventEntity[], @Req() request: Request): Observable<void> {
    return this.analyticsService.registerEvents(body, request);
  }
}
