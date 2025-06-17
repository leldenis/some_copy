import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { AccountDomainModule } from '@uklon/gateways/services/identity/account/domain';
import { GatewayConfigurationDto } from '@uklon/gateways/shared/types';

import { AccountResetService } from './account-reset.service';

const FAKE_IDENTITY_SERVICE_URL = 'https://fake.com/';
const FAKE_CONFIGURATION: GatewayConfigurationDto = {
  serviceRegistry: {
    identityService: FAKE_IDENTITY_SERVICE_URL,
  },
};

describe('AccountResetService', () => {
  let service: AccountResetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [() => FAKE_CONFIGURATION],
        }),
        AccountDomainModule,
      ],
      providers: [AccountResetService],
    }).compile();

    service = module.get<AccountResetService>(AccountResetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
