import { Module } from '@nestjs/common';

import { PasswordRecoveryFeatureModule } from '@uklon/fleets/fleets-gateway-app/authentication/password-recovery-feature';

@Module({
  imports: [PasswordRecoveryFeatureModule],
})
export class AppRoutingModule {}
