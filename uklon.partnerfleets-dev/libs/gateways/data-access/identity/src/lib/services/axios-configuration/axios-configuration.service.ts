import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

@Injectable()
export class AxiosConfigurationService implements OnModuleInit {
  private static readonly logger = new Logger('Identity Service Logger');
  private static _requestInterceptorRef = -1;
  private static _responseInterceptorRef = -1;

  private readonly methodsToApply = ['POST', 'PUT', 'PATCH'];
  private readonly contentTypeName = 'Content-Type';
  private readonly contentTypeValue = 'application/json';

  constructor(private readonly httpService: HttpService) {}

  public onModuleInit(): void {
    this.addRequestInterceptor();
    this.addResponseInterceptor();
  }

  private addResponseInterceptor(): void {
    // eslint-disable-next-line no-underscore-dangle
    if (AxiosConfigurationService._responseInterceptorRef === -1) {
      AxiosConfigurationService.logger.log('Response interceptor registered');
      // eslint-disable-next-line no-underscore-dangle
      AxiosConfigurationService._responseInterceptorRef = this.httpService.axiosRef.interceptors.response.use(
        (response) => response,
        async (err) => Promise.reject(err), // This line makes your failed HTTP requests resolve with "undefined"
      );
    }
  }

  private addRequestInterceptor(): void {
    // eslint-disable-next-line no-underscore-dangle
    if (AxiosConfigurationService._requestInterceptorRef === -1) {
      AxiosConfigurationService.logger.log('Request interceptor registered');
      // eslint-disable-next-line no-underscore-dangle
      AxiosConfigurationService._requestInterceptorRef = this.httpService.axiosRef.interceptors.request.use(
        (config) => {
          const url = config.url.toLowerCase();
          const baseURL = config.baseURL.toLowerCase();
          const method = config.method.toUpperCase();

          if (this.methodsToApply.includes(method)) {
            config.headers.set(this.contentTypeName, this.contentTypeValue);
          }

          AxiosConfigurationService.logger.log(`[${method}] ${baseURL}${url}`);

          return config;
        },
      );
    }
  }
}
