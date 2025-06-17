import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { GatewayConfigurationDto } from '@uklon/gateways/shared/types';

import { AccountResetFeatureModule } from './account-reset-feature.module';

const FAKE_IDENTITY_SERVICE_URL = 'https://fake.com/';
const FAKE_CONFIGURATION: GatewayConfigurationDto = {
  httpMaxRedirects: 0,
  httpTimeout: 0,
  version: '',
  serviceRegistry: {
    identityService: FAKE_IDENTITY_SERVICE_URL,
  },
};

describe('AccountResetFeatureModule', () => {
  let moduleRef: AccountResetFeatureModule;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [() => FAKE_CONFIGURATION],
        }),
        AccountResetFeatureModule,
      ],
    }).compile();

    moduleRef = module.get(AccountResetFeatureModule);
  });

  it('should create', () => {
    expect(moduleRef).toBeDefined();
  });
});
