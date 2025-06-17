import { HttpParams } from '@angular/common/http';
import { environment } from '@ui-env/environment';

type QueryParamsFilterValue = string | number | boolean;
export type QueryParamsFilter = Record<string, QueryParamsFilterValue>;

/* eslint-disable @typescript-eslint/no-explicit-any */
export abstract class HttpClientService {
  private basePath: string;

  protected buildUrl = (currentUrl: string, ...rest: string[]): string => {
    let url = currentUrl;

    if (!this.basePath) {
      this.basePath = environment?.gateway;
    }

    rest.forEach((value, index) => {
      url = url.replace(`{${index}}`, value);
    });

    return `${this.basePath}${url}`;
  };

  protected createQueryParams(filter: QueryParamsFilter = {}): HttpParams {
    let params = new HttpParams();

    Object.entries<QueryParamsFilterValue>(filter).forEach(([param, value]) => {
      params = params.set(param, value);
    });

    return params;
  }

  private readonly addObjectToHttpParams = (params: HttpParams, value: any, param: string): HttpParams => {
    let result = params;

    if (value instanceof Date) {
      result = result.append(param, value.toDateString());

      return result;
    }

    if (Array.isArray(value)) {
      value.forEach((element: any, index: number) => {
        result = this.addObjectToHttpParams(result, element, `${param}[${index}]`);
      });

      return result;
    }

    const keys = Object.keys(value);

    if (keys.length === 0 || typeof value === 'string') {
      result = result.append(param, value.toString());

      return result;
    }

    keys.forEach((key) => {
      if (key && value[key] !== null && value[key] !== undefined) {
        const paramNew = param ? `${param}.${key}` : key;
        result = this.addObjectToHttpParams(result, value[key], paramNew);
      }
    });

    return result;
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */
