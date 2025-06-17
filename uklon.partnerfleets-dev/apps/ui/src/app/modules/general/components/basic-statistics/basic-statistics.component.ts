import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  OnDestroy,
  viewChildren,
} from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { DashboardStatisticsDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { MetersToDistancePipe } from '@ui/modules/drivers/pipes';
import { MoneyPipe } from '@ui/shared/pipes/money';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'upf-basic-statistics',
  templateUrl: './basic-statistics.component.html',
  styleUrls: ['./basic-statistics.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDividerModule, CommonModule, MetersToDistancePipe, TranslateModule, MatIconModule, MoneyPipe],
})
export class BasicStatisticsComponent implements AfterViewInit, OnDestroy {
  public readonly scrollItems = viewChildren<ElementRef<HTMLElement>>('scrollItem');
  public readonly stats = input<Partial<DashboardStatisticsDto>>();

  public scrollIndex$ = new BehaviorSubject<number>(1);
  public navigationDots: number[] = [];

  private readonly observer: IntersectionObserver = new IntersectionObserver(this.onIntersect.bind(this), {
    threshold: 0.7,
  });

  public ngAfterViewInit(): void {
    this.navigationDots = Array.from({ length: this.scrollItems().length });
    this.scrollItems().forEach(({ nativeElement }) => this.observer.observe(nativeElement));
  }

  public ngOnDestroy(): void {
    this.observer.disconnect();
  }

  private onIntersect(entries: IntersectionObserverEntry[]): void {
    const [element] = entries;
    const index = +(element.target as HTMLElement).dataset['index'];
    this.scrollIndex$.next(index);
  }
}
