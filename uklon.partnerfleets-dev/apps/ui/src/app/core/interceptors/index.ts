import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Provider } from '@angular/core';
import { ErrorInterceptor } from '@ui/core/interceptors/error.interceptor';

import { AuthInterceptor } from './auth.interceptor';
import { SessionInterceptor } from './session.interceptor';
import { TracingInterceptor } from './tracing.interceptor';

export const httpInterceptors: Provider[] = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: SessionInterceptor,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: TracingInterceptor,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true,
  },
];
