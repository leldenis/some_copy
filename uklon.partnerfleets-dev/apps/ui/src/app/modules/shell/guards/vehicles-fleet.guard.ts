import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CorePaths } from '@ui/core/models/core-paths';
import { AccountState } from '@ui/core/store/account/account.reducer';
import { getSelectedFleet } from '@ui/core/store/account/account.selectors';
import { VEHICLE_FLEET_TYPES } from '@ui/shared/consts';
import { Observable, filter, map, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VehiclesFleetGuard {
  constructor(
    private readonly store: Store<AccountState>,
    private readonly router: Router,
  ) {}

  public canActivate(): Observable<boolean> {
    return this.store.select(getSelectedFleet).pipe(
      filter(Boolean),
      map(({ fleet_type }) => VEHICLE_FLEET_TYPES.has(fleet_type)),
      tap((canActivate) => {
        if (!canActivate) this.router.navigate(['/', CorePaths.WORKSPACE, CorePaths.COURIERS]);
      }),
    );
  }
}
