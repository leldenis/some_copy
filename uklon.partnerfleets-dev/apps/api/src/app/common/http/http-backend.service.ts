import { HttpHeader } from '@constant';
import { HttpService } from '@nestjs/axios';
import { Logger } from '@nestjs/common';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import FormData from 'form-data';
import { stringify } from 'qs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { combineUrls, Jwt } from '@uklon/nest-core';

export interface RequestConfig extends AxiosRequestConfig {
  token?: Jwt;
}

const excludedUrls = ['api/v1/dictionaries', 'api/v1/events', 'api/v1/vehicles/makes'];

export abstract class HttpBackendService {
  private readonly logger = new Logger('LoggerAxios');

  private readonly methodsToApply = ['POST', 'PUT', 'PATCH'];
  private readonly contentTypeName = 'Content-Type';
  private readonly contentTypeValue = 'application/json';
  private readonly contentTypeFormDataValue = 'multipart/form-data';

  protected constructor(
    private readonly httpService: HttpService,
    private readonly serviceUrl: string,
  ) {
    this.httpService.axiosRef.interceptors.request.use((config) => {
      const url = config.url.toLowerCase();
      const method = config.method.toUpperCase();

      if (this.methodsToApply.includes(method) && config.data && !(config.data instanceof FormData)) {
        const value = config.data instanceof FormData ? this.contentTypeFormDataValue : this.contentTypeValue;
        config.headers.set(this.contentTypeName, value);
      }

      const params = stringify(config?.params, { encode: false });

      if (!excludedUrls.some((excludedUrl) => url.includes(excludedUrl))) {
        this.logger.log(`${method} ${url}  with params: ${params}`);
      }

      return config;
    });

    this.httpService.axiosRef.interceptors.response.use(
      (response) => response,
      async (err) => Promise.reject(err), // This line makes your failed HTTP requests resolve with "undefined"
    );
  }

  public download<T = unknown>(path: string, config?: RequestConfig): Observable<AxiosResponse<T>> {
    const url = this.buildUrl(this.serviceUrl, path);
    const axiosConfig = this.buildConfig(config);

    return this.httpService.get(url, axiosConfig);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public get<T = any>(path: string, config?: RequestConfig): Observable<T> {
    const url = this.buildUrl(this.serviceUrl, path);
    const axiosConfig = this.buildConfig(config);

    return this.httpService.get<T>(url, axiosConfig).pipe(map(this.extractData));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public post<T = any, D = any>(path: string, data?: D, config?: RequestConfig): Observable<T> {
    const url = this.buildUrl(this.serviceUrl, path);
    const axiosConfig = this.buildConfig(config);

    return this.httpService.post<T>(url, data, axiosConfig).pipe(map(this.extractData));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public put<T = any, D = any>(path: string, data?: D, config?: RequestConfig): Observable<T> {
    const url = this.buildUrl(this.serviceUrl, path);
    const axiosConfig = this.buildConfig(config);

    return this.httpService.put<T>(url, data, axiosConfig).pipe(map(this.extractData));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public patch<T = any, D = any>(path: string, data?: D, config?: RequestConfig): Observable<T> {
    const url = this.buildUrl(this.serviceUrl, path);
    const axiosConfig = this.buildConfig(config);

    return this.httpService.patch<T>(url, data, axiosConfig).pipe(map(this.extractData));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public delete<T = any>(path: string, config?: RequestConfig): Observable<T> {
    const url = this.buildUrl(this.serviceUrl, path);
    const axiosConfig = this.buildConfig(config);

    return this.httpService.delete<T>(url, axiosConfig).pipe(map(this.extractData));
  }

  private readonly buildConfig = (config: RequestConfig): AxiosRequestConfig => {
    return config ? this.buildHeaders(config) : config;
  };

  private readonly buildHeaders = (config: RequestConfig): RequestConfig => {
    // the simple state machine for one case
    return config?.token ? this.jwtToHeaders(config) : config;
  };

  private readonly jwtToHeaders = (config: RequestConfig): RequestConfig => {
    const authHeader = {
      [HttpHeader.AUTHORIZATION]: `Bearer ${config.token.token}`,
    };
    const headers = config?.headers ? authHeader : { ...config.headers, ...authHeader };

    return {
      ...config,
      headers,
    };
  };

  private readonly buildUrl = (baseURL: string, relativeURL: string): string => {
    return combineUrls(baseURL, relativeURL);
  };

  private readonly extractData = <T>(resp: AxiosResponse<T>): T => resp?.data;
}
