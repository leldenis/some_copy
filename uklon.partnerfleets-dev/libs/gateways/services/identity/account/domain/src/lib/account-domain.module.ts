import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import {
  AxiosConfigurationService,
  IdentityDataAccessModule,
  IdentityHttpModuleOptionsFactoryService,
} from '@uklon/gateways/data-access/identity';

import { HttpConfigurationService } from './services';

@Module({
  providers: [AxiosConfigurationService, HttpConfigurationService],
  imports: [
    IdentityDataAccessModule,
    HttpModule.registerAsync({
      imports: [AccountDomainModule, IdentityDataAccessModule],
      useExisting: IdentityHttpModuleOptionsFactoryService,
    }),
  ],
  exports: [HttpModule],
})
export class AccountDomainModule {}
