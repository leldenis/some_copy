import { AppModule } from '@api/app.module';
import { HttpExceptionFilter } from '@api/common/filters/http-exception.filter';
import { buildCustomCss, buildCustomDescription, buildCustomJs, ServiceDescription } from '@api/common/utils';
import { CorsModel } from '@api-env/environment.model';
import { JSON_STRINGIFY_SPACE } from '@constant';
import { INestApplication, Logger, NestInterceptor, Type } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger as PinoLogger } from 'nestjs-pino';

import { IdentityBadRequestInterceptor } from '@uklon/gateways/services/identity/core/domain';

const APP_DEFAULT_PORT = 8081;
const APP_DEFAULT_PREFIX = 'api';

const TITLE = 'Fleets API';
const PATH = '/swagger';
const SERVICES: ServiceDescription[] = [
  {
    abbr: 'I',
    name: 'Identity',
    dev: 'https://internalidentity.dev.uklon.net/swagger',
    stage: 'https://internalidentity.staging.uklon.net/swagger',
    prod: 'https://internalidentity.prod.uklon.net/swagger',
  },
  {
    abbr: 'P',
    name: 'Partners',
    dev: 'https://partners.dev.uklon.net/swagger',
    stage: 'https://partners.staging.uklon.net/swagger',
    prod: 'https://partners.prod.uklon.net/swagger',
  },
  {
    abbr: 'OR',
    name: 'OrderReporting',
    dev: 'https://orderreporting.dev.uklon.net/swagger',
    stage: 'https://orderreporting.staging.uklon.net/swagger',
    prod: 'https://orderreporting.prod.uklon.net/swagger',
  },
  {
    abbr: 'AS',
    name: 'AnalyticService',
    dev: 'https://as.dev.uklon.com.ua/swagger',
    stage: 'https://as.staging.uklon.com.ua/swagger',
    prod: 'https://as.uklon.com.ua/swagger',
  },
  {
    abbr: 'S',
    name: 'Search',
    dev: 'https://search.dev.uklon.net/swagger',
    stage: 'https://search.staging.uklon.net/swagger',
    prod: 'https://search.prod.uklon.net/swagger',
  },
  {
    abbr: 'RS',
    name: 'RiderService',
    dev: 'https://riderservice.dev.uklon.net/swagger',
    stage: 'https://riderservice.staging.uklon.net/swagger',
    prod: 'https://riderservice.prod.uklon.net/swagger',
  },
  {
    abbr: 'GPSF',
    name: 'GPSFetcher',
    dev: 'https://gpsfetcher.dev.uklon.net/swagger',
    stage: 'https://gpsfetcher.staging.uklon.net/swagger',
    prod: 'https://gpsfetcher.prod.uklon.net/swagger',
  },
  {
    abbr: 'OP',
    name: 'OrderProcessor',
    dev: 'https://orderprocessor.dev.uklon.net/swagger',
    stage: 'https://orderprocessor.staging.uklon.net/swagger',
    prod: 'https://orderprocessor.prod.uklon.net/swagger',
  },
  {
    abbr: 'PP',
    name: 'PaymentProcessor',
    dev: 'https://paymentprocessor.dev.uklon.net/swagger',
    stage: 'https://paymentprocessor.staging.uklon.net/swagger',
    prod: 'https://paymentprocessor.prod.uklon.net/swagger',
  },
  {
    abbr: 'DB',
    name: 'DriverBonus',
    dev: 'https://driverbonus.dev.uklon.net/swagger',
    stage: 'https://driverbonus.staging.uklon.net/swagger',
    prod: 'https://driverbonus.prod.uklon.net/swagger',
  },
  {
    abbr: 'D',
    name: 'Delivery',
    dev: 'https://delivery.dev.uklon.net/swagger',
    stage: 'https://delivery.staging.uklon.net/swagger',
    prod: 'https://delivery.prod.uklon.net/swagger',
  },
  {
    abbr: 'F',
    name: 'Fiscalization',
    dev: 'https://fiscalizationservice.dev.uklon.net/swagger',
    stage: 'https://fiscalizationservice.staging.uklon.net/swagger',
    prod: 'https://fiscalizationservice.prod.uklon.net/swagger',
  },
  {
    abbr: 'PG',
    name: 'Pregame',
    dev: 'https://pregameservice.dev.uklon.net/swagger',
    stage: 'https://pregameservice.staging.uklon.net/swagger',
    prod: 'https://pregameservice.prod.uklon.net/swagger',
  },
  {
    abbr: 'DO',
    name: 'DriverOrdering',
    dev: 'https://driverordering.dev.uklon.net/swagger',
    stage: 'https://driverordering.staging.uklon.net/swagger',
    prod: 'https://driverordering.prod.uklon.net/swagger',
  },
];

function setupSwagger(app: INestApplication, version: string): void {
  const config = new DocumentBuilder()
    .setTitle(TITLE)
    .setDescription(buildCustomDescription(SERVICES))
    .setVersion(version)
    .addBearerAuth({ in: 'header', type: 'http' })
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const options = {
    customSiteTitle: TITLE,
    customCss: buildCustomCss(),
    customJsStr: buildCustomJs(),
  };

  SwaggerModule.setup(PATH, app, document, options);
}

function setupGlobalInterceptors(app: INestApplication, ...tokens: Type<NestInterceptor>[]): void {
  const interceptors = tokens.map((token) => app.get(token));
  app.useGlobalInterceptors(...interceptors);
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(APP_DEFAULT_PREFIX);

  app.useGlobalFilters(app.get(HttpExceptionFilter));

  setupGlobalInterceptors(app, IdentityBadRequestInterceptor);

  app.useLogger(app.get(PinoLogger));

  const configService: ConfigService<Record<string, string>> = app.get(ConfigService);

  const corsConfig = configService.get<CorsModel>('cors');
  if (corsConfig?.isActive) {
    app.enableCors({
      origin: corsConfig?.origin,
      credentials: corsConfig?.credentials,
      allowedHeaders: corsConfig?.allowedHeaders,
      methods: corsConfig?.methods,
    });
  }

  const version = configService.get('version');
  setupSwagger(app, version);

  const port = configService.get<number>('port', APP_DEFAULT_PORT);
  await app.listen(port);

  Logger.log(`Version: ${version}`);
  Logger.log(`Application is running on: ${await app.getUrl()}`);
  Logger.log(
    `Config: ${JSON.stringify(
      {
        serviceRegistry: configService.get('serviceRegistry'),
        logging: configService.get('logging'),
        tokenKey: configService.get('tokenKey'),
        cors: configService.get('cors'),
        port: configService.get('port'),
      },
      null,
      JSON_STRINGIFY_SPACE,
    )}`,
  );
}

bootstrap().catch((error) => console.error(error));
