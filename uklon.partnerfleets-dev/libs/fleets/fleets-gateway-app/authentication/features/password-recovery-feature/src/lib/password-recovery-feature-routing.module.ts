import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';

import { PasswordRecoveryConfirmationModule, PasswordRecoveryModule } from './controllers';

@Module({
  imports: [
    PasswordRecoveryModule,
    PasswordRecoveryConfirmationModule,
    RouterModule.register([
      {
        path: 'password-recovery',
        module: PasswordRecoveryModule,
        children: [
          {
            path: 'confirm',
            module: PasswordRecoveryConfirmationModule,
          },
        ],
      },
    ]),
  ],
})
export class PasswordRecoveryFeatureRoutingModule {}
