import { environmentConfigFactory } from '@api/common/environment-config';
import { HttpHeader } from '@constant';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AxiosRequestConfig } from 'axios';

import { PublicKeyConfig, UklNestCoreModule } from '@uklon/nest-core';

import {
  AnalyticsReportingService,
  SearchService,
  IdentityService,
  OrderReportingService,
  PartnersService,
  RidersService,
  GpsService,
  OrderProcessingService,
  PaymentProcessingService,
  DeliveryService,
  DriverBonusService,
  FiscalizationService,
  PregameService,
  DriverOrderingService,
} from './datasource';

@Global()
@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      ttl: 5,
      max: 10,
    }),

    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true,
      load: [environmentConfigFactory],
    }),

    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): AxiosRequestConfig => ({
        // `timeout` specifies the number of milliseconds before the request times out.
        // If the request takes longer than `timeout`, the request will be aborted.
        // increased to 30000 for RRO api POST /:fleetId/signature-keys
        timeout: configService.get('HTTP_TIMEOUT', 30_000),
        // `maxRedirects` defines the maximum number of redirects to follow in node.js.
        // If set to 0, no redirects will be followed.
        maxRedirects: configService.get('HTTP_MAX_REDIRECTS', 5),
        // `headers` are custom headers to be sent
        headers: {
          [HttpHeader.X_SERVICE_AGENT]: `PartnerFleets/${configService.get('version')}`,
        },
      }),
      inject: [ConfigService],
    }),

    UklNestCoreModule.registerAsync({
      useFactory: (configService: ConfigService<Record<string, string>, true>) => {
        const publicKey = configService.get<PublicKeyConfig>('tokenKey');

        return { publicKey };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    IdentityService,
    PartnersService,
    OrderReportingService,
    AnalyticsReportingService,
    SearchService,
    RidersService,
    GpsService,
    OrderProcessingService,
    PaymentProcessingService,
    DeliveryService,
    DriverBonusService,
    FiscalizationService,
    PregameService,
    DriverOrderingService,
  ],
  exports: [
    IdentityService,
    PartnersService,
    OrderReportingService,
    AnalyticsReportingService,
    SearchService,
    RidersService,
    GpsService,
    OrderProcessingService,
    PaymentProcessingService,
    DeliveryService,
    DriverBonusService,
    FiscalizationService,
    PregameService,
    DriverOrderingService,
  ],
})
export class GlobalModule {}
