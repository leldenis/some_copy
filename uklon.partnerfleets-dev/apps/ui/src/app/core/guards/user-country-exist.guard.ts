import { inject, Injectable } from '@angular/core';
import { AccountService } from '@ui/core/services/account.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserCountryExistGuard {
  private readonly accountService = inject(AccountService);

  public canActivate(): Observable<boolean> {
    return this.accountService.userCountry()
      ? of(true)
      : this.accountService.getUserCountry().pipe(
          map(() => true),
          catchError(() => of(null)),
        );
  }
}
