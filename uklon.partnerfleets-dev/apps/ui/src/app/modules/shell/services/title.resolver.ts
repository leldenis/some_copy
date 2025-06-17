import { DestroyRef, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { RootState } from '@ui/core/store/root/root.reducer';
import { navigationRoutes } from '@ui/core/store/root/root.selectors';
import { ALL_NAVIGATION_ROUTES } from '@ui/modules/shell/consts';
import { NavigationRouteDto } from '@ui/modules/shell/models';
import { UIService } from '@ui/shared';
import { Observable, of } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class TitleResolver {
  private readonly routes$ = this.store.select(navigationRoutes);
  private currentTitleTranslationKey: string;

  constructor(
    private readonly uiService: UIService,
    private readonly destroyRef: DestroyRef,
    private readonly store: Store<RootState>,
    private readonly translateService: TranslateService,
  ) {
    this.translateService.onLangChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      if (this.currentTitleTranslationKey) {
        this.updateTitle(this.currentTitleTranslationKey);
      }
    });
  }

  public resolve(route: ActivatedRouteSnapshot): Observable<string> {
    return this.routes$.pipe(
      takeUntilDestroyed(this.destroyRef),
      filter(Boolean),
      map(() => {
        this.currentTitleTranslationKey = this.getTitleTranslationKey(route.routeConfig.path, ALL_NAVIGATION_ROUTES);
        return this.getTitleTranslationKey(route.routeConfig.path, ALL_NAVIGATION_ROUTES);
      }),
      switchMap((title) => this.setTitle(title)),
    );
  }

  private getTitleTranslationKey(routePath: string, routes: NavigationRouteDto[]): string {
    const route = routes.find(({ path }) => path === routePath);
    return route?.name || '';
  }

  private setTitle(title: string | null): Observable<string> {
    return title
      ? this.translateService.get(title).pipe(
          takeUntilDestroyed(this.destroyRef),
          tap((value) => this.uiService.setTitle(value)),
        )
      : of('');
  }

  private updateTitle(key: string): void {
    const title = this.translateService.instant(key);
    this.uiService.setTitle(title);
  }
}
