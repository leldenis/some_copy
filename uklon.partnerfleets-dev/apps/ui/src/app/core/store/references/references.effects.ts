import { Injectable } from '@angular/core';
import { DictionariesListDto, DictionaryCollectionDto, ModelsDictionaryDto } from '@data-access';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ReferencesService } from '@ui/core/services/references.service';
import { referencesActions } from '@ui/core/store/references/references.actions';
import { ReferencesState } from '@ui/core/store/references/references.reducer';
import { of } from 'rxjs';
import { switchMap, tap, catchError } from 'rxjs/operators';

@Injectable()
export class ReferencesEffects {
  public getAllDictionaries$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(referencesActions.getAllDictionaries),
        switchMap(() =>
          this.referencesService.getAllDictionaries().pipe(
            tap((dictionaries: DictionariesListDto) => {
              this.referencesStore.dispatch(referencesActions.getAllDictionariesSuccess(dictionaries));
            }),
            catchError(() => of(null)),
          ),
        ),
      ),
    { dispatch: false },
  );

  public getVehicleModels$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(referencesActions.getVehicleModels),
        switchMap((payload: { makeId: string }) =>
          this.referencesService.getVehicleModels(payload.makeId).pipe(
            tap((dictionary: DictionaryCollectionDto<ModelsDictionaryDto>) => {
              this.referencesStore.dispatch(
                referencesActions.getVehicleModelsSuccess({ dictionary: dictionary.items }),
              );
            }),
            catchError(() => of(null)),
          ),
        ),
      ),
    { dispatch: false },
  );

  constructor(
    private readonly actions$: Actions,
    private readonly referencesService: ReferencesService,
    private readonly referencesStore: Store<ReferencesState>,
  ) {}
}
