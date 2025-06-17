import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { IdentityHttpModuleOptionsFactoryService } from './services';

@Module({
  providers: [IdentityHttpModuleOptionsFactoryService],
  imports: [ConfigModule],
  exports: [IdentityHttpModuleOptionsFactoryService],
})
export class IdentityDataAccessModule {}
