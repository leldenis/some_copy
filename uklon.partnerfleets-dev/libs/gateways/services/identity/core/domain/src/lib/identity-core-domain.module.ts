import { Module } from '@nestjs/common';

import { IdentityBadRequestInterceptor } from './interceptors';

@Module({
  controllers: [],
  providers: [IdentityBadRequestInterceptor],
  exports: [],
})
export class IdentityCoreDomainModule {}
