import { ControllerModule } from '@api/controllers/controller.module';
import { GlobalModule } from '@api/global.module';
import { LoggingModel } from '@api-env/environment.model';
import { HttpHeader } from '@constant';
import { SessionTokenDto } from '@data-access';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { tracing } from '@opentelemetry/sdk-node';
import { LoggerModule } from 'nestjs-pino';

import { IdentityCoreDomainModule } from '@uklon/gateways/services/identity/core/domain';
import { LoggerMiddleware } from '@uklon/nest-core';
import { OpentelemetryModule } from '@uklon/nest-opentelemetry';

import { AppRoutingModule } from './app-routing.module';
import { HttpExceptionFilter } from './common';

@Module({
  imports: [
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const { level, customProps, redact: redactPaths } = config.get<LoggingModel>('logging');
        return {
          pinoHttp: {
            level,
            redact: {
              remove: true,
              paths: ['pid', 'hostname', ...(redactPaths ?? [])],
            },
            customAttributeKeys: {
              req: 'Request',
              res: 'Response',
              reqId: 'RequestId',
              responseTime: 'Elapsed',
            },
            customProps: (req) => {
              if (!customProps) {
                return {};
              }

              /**
               * We have the problem of duplicates, but this is a known bug and will be closed together with
               * https://github.com/pinojs/pino-http/issues/216
               */

              let sessionToken: SessionTokenDto;
              if (req.headers[HttpHeader.X_SESSION_TOKEN]?.length > 0) {
                sessionToken = JSON.parse(atob(req.headers[HttpHeader.X_SESSION_TOKEN] as string));
              }

              return {
                GitBranch: process?.env?.CI_COMMIT_REF_NAME,
                GitCommitHash: process?.env?.CI_COMMIT_SHA,
                LogName: process?.env?.ServiceName,
                Pipeline: process?.env?.CI_PIPELINE_ID,
                ProductName: process?.env?.ProductName,
                ProductVersion: process?.env?.ProductVersion,
                Node: process?.env?.HOSTNAME,
                SessionToken: {
                  DeviceId: sessionToken?.deviceId,
                },
              };
            },
            timestamp: () => `,"@t":"${new Date().toISOString()}"`,
            messageKey: '@m',
            formatters: {
              level: (label: string) => ({ '@l': label }),
            },
            autoLogging: {
              ignore: (req) => ['api/dictionaries', 'api/analytics'].some((path) => req['originalUrl'].includes(path)),
            },
          },
          exclude: [
            { method: RequestMethod.ALL, path: 'api/health' },
            { method: RequestMethod.ALL, path: 'api/v1/health' },
            { method: RequestMethod.ALL, path: 'api/dictionaries' },
            { method: RequestMethod.ALL, path: 'api/analytics' },
            { method: RequestMethod.ALL, path: 'api/analytics/register-event' },
          ],
        };
      },
    }),
    ...(process?.env?.['OtelCollectorHost']
      ? [
          OpentelemetryModule.forRoot({
            serviceName: 'PartnerFleetsGateway',
            spanProcessors: [
              new tracing.SimpleSpanProcessor(
                new OTLPTraceExporter({ url: `${process?.env?.['OtelCollectorHost']}/v1/traces` }),
              ),
            ],
          }),
        ]
      : []),
    GlobalModule,
    ControllerModule,

    // Domain specific modules
    IdentityCoreDomainModule,

    AppRoutingModule,
  ],
  providers: [HttpExceptionFilter],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
