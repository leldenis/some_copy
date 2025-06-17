import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

import { GatewayConfigurationDto } from '@uklon/gateways/shared/types';

export interface LoggingModel {
  /** @type {pino.LevelWithSilent} */
  level: string;

  /** @type {pino.LevelWithSilent} */
  customProps: boolean;

  /** @type {pino.redactOptions.paths} */
  redact?: string[];
}

export interface PublicKeyModel {
  exponent: string;
  modulus: string;
}

export interface CorsModel extends CorsOptions {
  isActive: boolean;
}

export interface EnvironmentModel extends GatewayConfigurationDto {
  production: boolean;
  port: number;
  clientId: string;
  clientSecret: string;
  logging: LoggingModel;
  tokenKey: PublicKeyModel;
  cors: CorsModel;
  kafka: KafkaConfig;
}

export type KafkaSaslMechanism = 'scram-sha-512';

export interface KafkaConfig {
  clientId: string;
  schemaRegistry: { host: string };
  bootstrapServers: string;
  topics: string[];
  saslMechanism: KafkaSaslMechanism;
  saslPassword: string;
  saslUsername: string;
  sslEnabled: boolean;
  heartbeatInterval: number;
  connectionTimeout: number;
  enabled?: boolean;
}
