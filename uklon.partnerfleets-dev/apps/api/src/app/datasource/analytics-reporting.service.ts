import { HttpBackendService } from '@api/common/http/http-backend.service';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ServiceRegistryDto } from '@uklon/gateways/shared/types';

@Injectable()
export class AnalyticsReportingService extends HttpBackendService {
  constructor(httpService: HttpService, configService: ConfigService) {
    super(httpService, configService.get<ServiceRegistryDto>('serviceRegistry').analyticsService);
  }
}
