import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { GatewayConfigurationDto } from '@uklon/gateways/shared/types';

import { IdentityDataAccessModule } from './identity-data-access.module';

const FAKE_IDENTITY_SERVICE_URL = 'https://identity-service.com';
const FAKE_CONFIGURATION: GatewayConfigurationDto = {
  httpMaxRedirects: 0,
  httpTimeout: 0,
  version: '',
  serviceRegistry: {
    identityService: FAKE_IDENTITY_SERVICE_URL,
  },
};

describe('IdentityDataAccessModule', () => {
  let module: TestingModule;
  let moduleRef: IdentityDataAccessModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [() => FAKE_CONFIGURATION],
        }),
        IdentityDataAccessModule,
      ],
    }).compile();

    moduleRef = module.get(IdentityDataAccessModule);
  });

  it('should create', () => {
    expect(moduleRef).toBeDefined();
  });
});
