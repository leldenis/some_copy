import { Test, TestingModule } from '@nestjs/testing';

import { AccountResetService } from '@uklon/gateways/services/identity/account/reset-feature';

import { PasswordRecoveryController } from './password-recovery.controller';

describe('PasswordRecoveryController', () => {
  let controller: PasswordRecoveryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PasswordRecoveryController],
      providers: [{ provide: AccountResetService, useValue: { reset: jest.fn() } as Partial<AccountResetService> }],
    }).compile();

    controller = module.get<PasswordRecoveryController>(PasswordRecoveryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('when sending confirmation message', () => {
    it.todo('should send reset request to identity service for verification code generation');
    it.todo('should validate all the inputs');
    it.todo('should respond as identity service responded');
  });
});
