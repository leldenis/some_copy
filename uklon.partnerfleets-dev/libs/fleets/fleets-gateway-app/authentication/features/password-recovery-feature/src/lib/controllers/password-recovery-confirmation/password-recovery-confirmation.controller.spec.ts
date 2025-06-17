import { Test, TestingModule } from '@nestjs/testing';

import { ConfirmationResetPasswordService } from '@uklon/gateways/services/identity/confirmation/reset-password-feature';

import { PasswordRecoveryConfirmationController } from './password-recovery-confirmation.controller';

describe('PasswordRecoveryConfirmationController', () => {
  let controller: PasswordRecoveryConfirmationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PasswordRecoveryConfirmationController],
      providers: [
        {
          provide: ConfirmationResetPasswordService,
          useValue: { resetPassword: jest.fn() } as Partial<ConfirmationResetPasswordService>,
        },
      ],
    }).compile();

    controller = module.get<PasswordRecoveryConfirmationController>(PasswordRecoveryConfirmationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
