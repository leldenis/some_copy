import { Directive, inject, InjectionToken } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

export const NAMED_FRAGMENTS = new InjectionToken<string[]>('named fragments');

@Directive({
  selector: '[upfNamedFragments]',
  standalone: true,
})
export class NamedFragmentsDirective {
  private readonly fragments = inject(NAMED_FRAGMENTS);
  protected readonly route = inject(ActivatedRoute);
  protected readonly router = inject(Router);
  protected readonly navigatedToFragment$ = new Subject<number>();

  protected readonly selectedTabIndex$ = this.route.fragment.pipe(
    filter(Boolean),
    map((fragment) => this.fragments.indexOf(fragment)),
  );

  protected handleFragmentChange(index: number): void {
    this.router
      .navigate([], {
        fragment: this.fragments[index],
        replaceUrl: true,
      })
      .then(() => this.navigatedToFragment$.next(index));
  }
}
