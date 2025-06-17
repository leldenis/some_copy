import { HttpModuleOptions, HttpModuleOptionsFactory } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { GatewayConfigurationDto } from '@uklon/gateways/shared/types';

@Injectable()
export class IdentityHttpModuleOptionsFactoryService implements HttpModuleOptionsFactory {
  constructor(private readonly configService: ConfigService<GatewayConfigurationDto>) {}

  public createHttpOptions(): HttpModuleOptions {
    const identityServiceURL = this.configService.get('serviceRegistry').identityService;
    const headers = {
      'x-service-agent': `PartnerFleets/${this.configService.get('version')}`,
    };

    return {
      baseURL: identityServiceURL,
      headers,
      timeout: this.configService.get('httpTimeout', 10_000),
      maxRedirects: this.configService.get('httpMaxRedirects', 5),
    };
  }
}
