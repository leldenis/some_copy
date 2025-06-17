import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpHeader } from '@constant';
import { SessionTokenDto } from '@data-access';
import { StorageService } from '@ui/core/services/storage.service';
import { Observable } from 'rxjs';

@Injectable()
export class SessionInterceptor implements HttpInterceptor {
  constructor(private readonly storage: StorageService) {}

  public intercept<T>(req: HttpRequest<T>, next: HttpHandler): Observable<HttpEvent<T>> {
    let { headers } = req;

    const sessionToken: SessionTokenDto = {
      deviceId: this.storage.getOrCreateDeviceId(),
    };

    headers = headers.set(HttpHeader.X_SESSION_TOKEN, btoa(JSON.stringify(sessionToken)));

    return next.handle(req.clone({ headers }));
  }
}
