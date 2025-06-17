import { Directive, EventEmitter, Input, OnChanges, OnDestroy, Output } from '@angular/core';
import { Subject, timer } from 'rxjs';
import { switchMap, take, tap, takeUntil } from 'rxjs/operators';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[counter]',
  standalone: true,
})
export class CounterDirective implements OnChanges, OnDestroy {
  @Input() public counter: number;
  @Input() public interval: number;

  @Output() public value = new EventEmitter<number>();

  private readonly counter$ = new Subject<number>();
  private readonly destroyed$ = new Subject<void>();

  constructor() {
    this.counter$
      .pipe(
        switchMap((count: number) => {
          return timer(0, this.interval).pipe(
            take(count),
            tap(() => {
              const newCount = count - 1;
              this.value.emit(newCount);
            }),
          );
        }),
        takeUntil(this.destroyed$),
      )
      .subscribe();
  }

  public ngOnChanges(): void {
    this.counter$.next(this.counter);
  }

  public ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
