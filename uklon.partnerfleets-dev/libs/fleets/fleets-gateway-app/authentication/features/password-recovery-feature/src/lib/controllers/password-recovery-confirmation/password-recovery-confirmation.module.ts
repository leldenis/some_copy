import { Module } from '@nestjs/common';

import { ConfirmationResetPasswordFeatureModule } from '@uklon/gateways/services/identity/confirmation/reset-password-feature';

import { PasswordRecoveryConfirmationController } from './password-recovery-confirmation.controller';

@Module({
  imports: [ConfirmationResetPasswordFeatureModule],
  controllers: [PasswordRecoveryConfirmationController],
})
export class PasswordRecoveryConfirmationModule {}
