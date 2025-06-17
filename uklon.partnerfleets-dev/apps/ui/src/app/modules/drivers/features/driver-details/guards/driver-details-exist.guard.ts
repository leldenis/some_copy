import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CorePaths } from '@ui/core/models/core-paths';
import { AccountState } from '@ui/core/store/account/account.reducer';
import { selectedFleetId } from '@ui/core/store/account/account.selectors';
import { driversActions, DriversState } from '@ui/modules/drivers/store';
import { map } from 'rxjs/operators';

export const driverDetailsExistGuard: CanActivateFn = (route) => {
  const store: Store<DriversState> = inject(Store<AccountState | DriversState>);
  const router = inject(Router);

  const driverId = route.paramMap.get('driverId');

  if (driverId) {
    return store.select(selectedFleetId).pipe(
      map((fleetId: string) => {
        store.dispatch(
          driversActions.getFleetDriverById({
            fleetId,
            driverId,
          }),
        );

        return true;
      }),
    );
  }

  router.navigateByUrl(`/${CorePaths.WORKSPACE}/${CorePaths.DRIVERS}`);
  return false;
};
