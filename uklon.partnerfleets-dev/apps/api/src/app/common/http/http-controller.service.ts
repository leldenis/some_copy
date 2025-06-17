import qs = require('qs');

export abstract class HttpControllerService {
  protected buildUrl = (currentUrl: string, ...rest: string[]): string => {
    let url = currentUrl;

    rest.forEach((value, index) => {
      url = url.replace(`{${index}}`, value);
    });

    return url;
  };

  protected paramsSerializer: (params: unknown) => string = (params) => qs.stringify(params);
}
