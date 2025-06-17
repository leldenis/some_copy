import { Module } from '@nestjs/common';

import { AccountDomainModule } from '@uklon/gateways/services/identity/account/domain';

import { AccountResetService } from './services';

@Module({
  imports: [AccountDomainModule],
  providers: [AccountResetService],
  exports: [AccountResetService],
})
export class AccountResetFeatureModule {}
