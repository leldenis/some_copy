import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { IdentityConfirmationDomainModule } from '@uklon/gateways/services/identity/confirmation/domain';
import { GatewayConfigurationDto } from '@uklon/gateways/shared/types';

import { ConfirmationResetPasswordService } from './confirmation-reset-password.service';

const FAKE_IDENTITY_SERVICE_URL = 'https://fake.com/';
const FAKE_CONFIGURATION: GatewayConfigurationDto = {
  serviceRegistry: {
    identityService: FAKE_IDENTITY_SERVICE_URL,
  },
};

describe('ConfirmationResetPasswordService', () => {
  let service: ConfirmationResetPasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [() => FAKE_CONFIGURATION],
        }),
        IdentityConfirmationDomainModule,
      ],
      providers: [ConfirmationResetPasswordService],
    }).compile();

    service = module.get<ConfirmationResetPasswordService>(ConfirmationResetPasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
