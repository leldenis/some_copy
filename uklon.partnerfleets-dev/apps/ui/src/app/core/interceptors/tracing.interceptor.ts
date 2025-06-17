import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpHeader } from '@constant';
import { Observable } from 'rxjs';

import { uuidv4 } from '@uklon/angular-core';

@Injectable()
export class TracingInterceptor implements HttpInterceptor {
  public intercept<T>(request: HttpRequest<T>, next: HttpHandler): Observable<HttpEvent<T>> {
    return next.handle(
      request.clone({
        setHeaders: {
          [HttpHeader.X_TRANSACTION_ID]: uuidv4(),
        },
      }),
    );
  }
}
