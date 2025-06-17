import { ApiOperationOptions } from '@nestjs/swagger/dist/decorators/api-operation.decorator';

type Service = 'I' | 'P' | 'OR' | 'AS' | 'S' | 'RS' | 'GPSF' | 'OP' | 'PP' | 'DB' | 'D' | 'F' | 'PG' | 'DO';
type Method = 'GET' | 'PUT' | 'POST' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

export const buildApiOperationOptions = (
  endpoints?: { service: Service; method: Method; url: string }[],
): ApiOperationOptions => {
  return {
    summary: endpoints
      ? `${endpoints
          .map(({ service, method, url }) => {
            const serviceStr = `<span class="uklon-service">${service}</span>`;
            const methodStr = `<span class="uklon-method uklon-${method.toLowerCase()}">${method}</span>`;
            const urlStr = `<span class="uklon-url">${url}</span>`;

            return `<p>${serviceStr} ${methodStr} ${urlStr}`;
          })
          .join('')}`
      : '',
  };
};
