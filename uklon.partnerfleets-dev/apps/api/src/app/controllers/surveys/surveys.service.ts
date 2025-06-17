import { HttpControllerService } from '@api/common/http/http-controller.service';
import { PartnersService } from '@api/datasource';
import { ActiveSurveyDto, SurveyResponseDto } from '@data-access';
import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

import { Jwt } from '@uklon/nest-core';

@Injectable()
export class SurveysService extends HttpControllerService {
  constructor(private readonly partnersService: PartnersService) {
    super();
  }

  public getActiveSurvey(token: Jwt): Observable<ActiveSurveyDto> {
    return this.partnersService.get<ActiveSurveyDto>(`api/v1/me/fleets/surveys/active`, { token });
  }

  public sendResponse(surveyId: string, token: Jwt, survey: SurveyResponseDto): Observable<void> {
    return this.partnersService.post(`api/v1/me/fleets/surveys/${surveyId}`, survey, { token });
  }

  public markAsSkipped(surveyId: string, token: Jwt): Observable<void> {
    return this.partnersService.post(`api/v1/me/fleets/surveys/${surveyId}/:skip`, {}, { token });
  }
}
