import { Module } from '@nestjs/common';

import { AccountResetFeatureModule } from '@uklon/gateways/services/identity/account/reset-feature';

import { PasswordRecoveryController } from './password-recovery.controller';

@Module({
  imports: [AccountResetFeatureModule],
  controllers: [PasswordRecoveryController],
})
export class PasswordRecoveryModule {}
