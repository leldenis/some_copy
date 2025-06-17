import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { GatewayConfigurationDto } from '@uklon/gateways/shared/types';

import { ConfirmationResetPasswordFeatureModule } from './confirmation-reset-password-feature.module';

const FAKE_IDENTITY_SERVICE_URL = 'https://fake.com/';
const FAKE_CONFIGURATION: GatewayConfigurationDto = {
  httpMaxRedirects: 0,
  httpTimeout: 0,
  version: '',
  serviceRegistry: {
    identityService: FAKE_IDENTITY_SERVICE_URL,
  },
};

describe('ConfirmationResetPasswordFeatureModule', () => {
  let moduleRef: ConfirmationResetPasswordFeatureModule;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [() => FAKE_CONFIGURATION],
        }),
        ConfirmationResetPasswordFeatureModule,
      ],
    }).compile();

    moduleRef = module.get(ConfirmationResetPasswordFeatureModule);
  });

  it('should create', () => {
    expect(moduleRef).toBeDefined();
  });
});
