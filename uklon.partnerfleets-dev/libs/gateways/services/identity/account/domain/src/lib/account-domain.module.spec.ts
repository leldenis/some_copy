import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { GatewayConfigurationDto } from '@uklon/gateways/shared/types';

import { AccountDomainModule } from './account-domain.module';

const FAKE_IDENTITY_SERVICE_URL = 'https://fake.com/';
const FAKE_CONFIGURATION: GatewayConfigurationDto = {
  serviceRegistry: {
    identityService: FAKE_IDENTITY_SERVICE_URL,
  },
};

describe('AccountDomainModule', () => {
  let moduleRef: AccountDomainModule;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [() => FAKE_CONFIGURATION],
        }),
        AccountDomainModule,
      ],
    }).compile();

    moduleRef = module.get(AccountDomainModule);
  });

  it('should create', () => {
    expect(moduleRef).toBeDefined();
  });
});
