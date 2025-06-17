import { HttpModuleOptions } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { GatewayConfigurationDto } from '@uklon/gateways/shared/types';

import { IdentityHttpModuleOptionsFactoryService } from './identity-http-module-options-factory.service';

const FAKE_IDENTITY_SERVICE_URL = 'https://identity-service.com';
const FAKE_CONFIGURATION: GatewayConfigurationDto = {
  httpMaxRedirects: 0,
  httpTimeout: 0,
  version: '1',
  serviceRegistry: {
    identityService: FAKE_IDENTITY_SERVICE_URL,
  },
};

describe('IdentityHttpConfigService', () => {
  let service: IdentityHttpModuleOptionsFactoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [() => FAKE_CONFIGURATION],
        }),
      ],
      providers: [IdentityHttpModuleOptionsFactoryService],
    }).compile();

    service = module.get<IdentityHttpModuleOptionsFactoryService>(IdentityHttpModuleOptionsFactoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should read url from the config', () => {
    const actual = service.createHttpOptions();
    const expected: Partial<HttpModuleOptions> = {
      baseURL: FAKE_IDENTITY_SERVICE_URL,
      headers: {
        'x-service-agent': 'PartnerFleets/1',
      },
      maxRedirects: 0,
      timeout: 0,
    };
    expect(actual).toEqual(expected);
  });
});
