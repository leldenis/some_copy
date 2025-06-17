import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { AsyncPipe } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { filter, map, pairwise, takeUntil, withLatestFrom } from 'rxjs/operators';

@Component({
  selector: 'upf-infinity-scroll',
  standalone: true,
  imports: [ScrollingModule, MatProgressSpinnerModule, TranslateModule, AsyncPipe],
  templateUrl: './infinity-scroll.component.html',
  styleUrls: ['./infinity-scroll.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfinityScrollComponent implements AfterViewInit, OnDestroy {
  @ViewChild('scroller')
  private readonly scroller: CdkVirtualScrollViewport;

  @Input() public loadingState$: Observable<{ isLoaded: boolean; hasNext: boolean }>;
  @Input() public itemSize = 20;
  @Input() public classList = '';

  @Output() public loadNext = new EventEmitter<undefined>();

  private readonly destroyed$ = new Subject<void>();

  constructor(private readonly zone: NgZone) {}

  public ngAfterViewInit(): void {
    this.scroller
      .elementScrolled()
      .pipe(
        map(() => this.scroller.measureScrollOffset('bottom')),
        pairwise(),
        withLatestFrom(this.loadingState$),
        filter(([[y1, y2], loadingState]) => y2 < y1 && y2 < 100 && loadingState.hasNext && loadingState.isLoaded),
        takeUntil(this.destroyed$),
      )
      .subscribe(() => this.zone.run(() => this.loadNext.emit()));
  }

  public ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
