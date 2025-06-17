import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { CorePaths } from '@ui/core/models/core-paths';
import { accountActions } from '@ui/core/store/account/account.actions';
import { selectedFleetId } from '@ui/core/store/account/account.selectors';
import { AppState } from '@ui/core/store/app.state';
import { FinanceService } from '@ui/modules/finance/services';
import { FleetProfileTabs } from '@ui/modules/fleet-profile/containers/fleet-profile-tabs/fleet-profile-tabs.component';
import { fleetProfileActions } from '@ui/modules/fleet-profile/store/fleet-profile.actions';
import { getB2BAvailable, getIsFleetProfilePage } from '@ui/modules/fleet-profile/store/fleet-profile.selectors';
import { exhaustMap, of } from 'rxjs';
import { catchError, filter, map, tap, withLatestFrom } from 'rxjs/operators';

@Injectable()
export class FleetProfileEffects {
  public readonly getFleetEntrepreneurs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fleetProfileActions.getFleetEntrepreneurs),
      withLatestFrom(this.store.select(selectedFleetId)),
      exhaustMap(([_, fleetId]) => {
        return this.financeService.getFleetEntrepreneurs(fleetId).pipe(
          map((data) => fleetProfileActions.getFleetEntrepreneursSuccess(data)),
          catchError(() => of(fleetProfileActions.getFleetEntrepreneursFailed())),
        );
      }),
    ),
  );

  public readonly getFleetEntrepreneursSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fleetProfileActions.getFleetEntrepreneursSuccess),
        withLatestFrom(this.store.select(getB2BAvailable)),
        tap(([_, b2bAvailable]) => {
          const currentFragment = this.route.snapshot.fragment;

          if (!b2bAvailable && currentFragment === FleetProfileTabs.RRO) {
            this.router.navigate([`/${CorePaths.WORKSPACE}/${CorePaths.FLEET_PROFILE}`], {
              fragment: FleetProfileTabs.CONTACTS,
            });
          }
        }),
      ),
    { dispatch: false },
  );

  public setSelectedFleet$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(accountActions.setSelectedFleet),
      withLatestFrom(this.store.select(getIsFleetProfilePage)),
      filter(([_, isFleetProfilePage]) => isFleetProfilePage),
      map(() => fleetProfileActions.getFleetEntrepreneurs()),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store<AppState>,
    private readonly financeService: FinanceService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}
}
