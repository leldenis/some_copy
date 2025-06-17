import { ServiceRegistryDto } from './service-registry.dto';

export interface GatewayConfigurationDto {
  serviceRegistry: ServiceRegistryDto;
  version?: string;
  httpTimeout?: number;
  httpMaxRedirects?: number;
}
