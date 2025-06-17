import { Module } from '@nestjs/common';

import { PasswordRecoveryFeatureRoutingModule } from './password-recovery-feature-routing.module';

@Module({
  imports: [PasswordRecoveryFeatureRoutingModule],
})
export class PasswordRecoveryFeatureModule {}
