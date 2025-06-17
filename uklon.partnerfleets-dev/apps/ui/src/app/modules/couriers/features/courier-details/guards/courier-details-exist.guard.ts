import { DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AccountState } from '@ui/core/store/account/account.reducer';
import { selectedFleetId } from '@ui/core/store/account/account.selectors';
import { courierDetailsActions } from '@ui/modules/couriers/features/courier-details/store/courier-details.actions';
import { filter, tap } from 'rxjs';

export const courierDetailsExistGuard: CanActivateFn = (route) => {
  const destroyRef = inject(DestroyRef);
  const store = inject(Store<AccountState>);
  const router = inject(Router);
  const { courierId } = route.params;

  if (courierId) {
    store
      .select(selectedFleetId)
      .pipe(
        takeUntilDestroyed(destroyRef),
        filter((fleetId: string) => !!fleetId),
        tap((fleetId: string) => {
          if (fleetId) {
            store.dispatch(courierDetailsActions.getFleetCourierById({ fleetId, courierId }));
          }
        }),
      )
      .subscribe();

    return true;
  }

  router.navigate(['../']).then(() => courierDetailsActions.clearState());

  return false;
};
