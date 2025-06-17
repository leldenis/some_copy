import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { GoogleTagManagerService } from '@ui/core/services/google-tag-manager.service';
import { rootActions } from '@ui/core/store/root/root.actions';
import { tap } from 'rxjs/operators';

@Injectable()
export class RootEffects {
  public setConfig$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(rootActions.setConfig),
        tap(({ production, analytic }) => {
          if (production && analytic?.isActive && analytic?.googleTagManagerId) {
            this.googleTagManagerService.install(analytic.googleTagManagerId);
          }
        }),
      ),
    { dispatch: false },
  );

  constructor(
    private readonly actions$: Actions,
    private readonly googleTagManagerService: GoogleTagManagerService,
  ) {}
}
