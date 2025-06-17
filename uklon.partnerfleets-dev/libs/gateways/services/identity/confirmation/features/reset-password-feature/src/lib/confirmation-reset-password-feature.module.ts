import { Module } from '@nestjs/common';

import { IdentityConfirmationDomainModule } from '@uklon/gateways/services/identity/confirmation/domain';

import { ConfirmationResetPasswordService } from './services';

@Module({
  imports: [IdentityConfirmationDomainModule],
  providers: [ConfirmationResetPasswordService],
  exports: [ConfirmationResetPasswordService],
})
export class ConfirmationResetPasswordFeatureModule {}
