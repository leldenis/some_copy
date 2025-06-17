import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { GatewayConfigurationDto } from '@uklon/gateways/shared/types';

import { IdentityConfirmationDomainModule } from './identity-confirmation-domain.module';

const FAKE_IDENTITY_SERVICE_URL = 'https://fake.com/';
const FAKE_CONFIGURATION: GatewayConfigurationDto = {
  serviceRegistry: {
    identityService: FAKE_IDENTITY_SERVICE_URL,
  },
};

describe('IdentityConfirmationDomainModule', () => {
  let moduleRef: IdentityConfirmationDomainModule;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [() => FAKE_CONFIGURATION],
        }),
        IdentityConfirmationDomainModule,
      ],
    }).compile();

    moduleRef = module.get(IdentityConfirmationDomainModule);
  });

  it('should create', () => {
    expect(moduleRef).toBeDefined();
  });
});
