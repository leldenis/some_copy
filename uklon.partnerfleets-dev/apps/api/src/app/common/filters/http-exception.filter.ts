import { ApiErrorResponseDto } from '@data-access';
import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { AxiosError, isAxiosError } from 'axios';

@Catch()
export class HttpExceptionFilter extends BaseExceptionFilter {
  public catch(exception: HttpException | AxiosError<ApiErrorResponseDto>, host: ArgumentsHost): void {
    if (isAxiosError(exception)) {
      const applicationRef = this.applicationRef || this.httpAdapterHost?.httpAdapter;

      const response = host.getArgByIndex(1);
      if (applicationRef.isHeadersSent(response)) {
        applicationRef.end(response);
      } else {
        applicationRef.reply(response, this.extractAxiosError(exception), exception.response?.status);
      }
    } else {
      super.catch(exception, host);
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  private extractAxiosError(error: AxiosError<ApiErrorResponseDto>) {
    const msg = error?.message ?? `Request failed with status code ${error.response?.status};`;
    let description = error.response?.data?.error_code ? `${error.response.data.error_code}` : '';

    if (error.response?.data?.message) {
      description = error.response.data.message;
    }

    const message = description || msg;

    return {
      path: error.config?.url || 'unknown url',
      message,
      ...(error.response?.data?.error
        ? { ...error.response.data.error }
        : { message, error: error.response?.statusText ?? 'Unknown error' }),
    };
  }
}
