// eslint-disable-next-line unicorn/import-style
import * as path from 'path';

import { HttpService } from '@nestjs/axios';
import { Injectable, OnModuleInit } from '@nestjs/common';
// eslint-disable-next-line unicorn/import-style

@Injectable()
export class HttpConfigurationService implements OnModuleInit {
  private readonly resourceURL = '/api/v1/accounts/';

  constructor(private readonly httpService: HttpService) {}

  public onModuleInit(): void {
    this.httpService.axiosRef.interceptors.request.use((request) => {
      const { pathname, origin } = new URL(path.join(request.baseURL, this.resourceURL, request.url));
      return {
        ...request,
        baseURL: origin,
        url: pathname,
      };
    });
  }
}
