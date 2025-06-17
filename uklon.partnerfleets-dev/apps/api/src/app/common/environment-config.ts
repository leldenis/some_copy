import { existsSync, readFileSync } from 'fs';
import path from 'node:path';

import { environment } from '@api-env/environment';
import { EnvironmentModel, KafkaConfig, KafkaSaslMechanism } from '@api-env/environment.model';
import { Logger } from '@nestjs/common';

import { AppVersion } from '@uklon/angular-core';

const SETTINGS_FILE_NAME = 'settings.json';
const VERSION_FILE_NAME = 'version.json';
const LOGGER_CONTEXT = 'EnvironmentConfig';

const buildSettingsPath = (): string => {
  const args = process.argv.slice(2);
  let settingsFileName = SETTINGS_FILE_NAME;

  const idx = args.findIndex((p) => p.toLowerCase() === '-c');
  if (idx >= 0 && args[idx + 1] !== undefined && args[idx + 1].length > 0) {
    settingsFileName = args[idx + 1];
  }

  return path.resolve(settingsFileName);
};

const readSettingsFile = (settingsFilePath: string): EnvironmentModel => {
  let settings: EnvironmentModel;

  try {
    Logger.log(`Read external configuration from file: ${settingsFilePath}`, LOGGER_CONTEXT);
    settings = JSON.parse(readFileSync(settingsFilePath, 'utf-8'));
  } catch (error: unknown) {
    Logger.error(error, LOGGER_CONTEXT);
    process.exit(1);
  }

  return settings;
};

const getEnvValue = (key: string, fallback: string): string => process?.env[key] ?? fallback;

const getKafkaConfig = (kafkaConfig: KafkaConfig): Partial<KafkaConfig> => {
  const KAFKA_ENV_PREFIX = 'kafka__';
  const getKafkaConfigProperty = <T>(property: string): T =>
    getEnvValue(`${KAFKA_ENV_PREFIX}${property}`, kafkaConfig?.[property] ?? environment?.kafka?.[property]) as T;

  return {
    ...environment.kafka,
    ...kafkaConfig,
    bootstrapServers: getKafkaConfigProperty<string>('bootstrapServers'),
    saslUsername: getKafkaConfigProperty<string>('saslUsername'),
    saslPassword: getKafkaConfigProperty<string>('saslPassword'),
    saslMechanism: getKafkaConfigProperty<KafkaSaslMechanism>('saslMechanism'),
  };
};

export const environmentConfigFactory = (): EnvironmentModel => {
  const settingsPath = buildSettingsPath();
  const settings = existsSync(settingsPath) ? readSettingsFile(settingsPath) : ({} as EnvironmentModel);

  // eslint-disable-next-line unicorn/prefer-module
  const versionPath = path.resolve(__dirname, VERSION_FILE_NAME);
  let versionInfo: AppVersion;
  if (existsSync(versionPath)) {
    versionInfo = JSON.parse(readFileSync(versionPath, 'utf-8'));
  }

  return Object.assign(environment, {
    ...settings,
    kafka: getKafkaConfig(settings?.kafka),
    version: versionInfo?.ver || '1.0.def',
  });
};
