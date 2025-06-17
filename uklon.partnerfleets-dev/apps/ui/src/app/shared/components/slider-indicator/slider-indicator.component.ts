import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'upf-slider-indicator',
  standalone: true,
  imports: [],
  templateUrl: './slider-indicator.component.html',
  styleUrls: ['./slider-indicator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SliderIndicatorComponent<T> {
  @Input() public items: T[];
  @Input() public currentIndex = 0;

  @Output() public selectItem = new EventEmitter<number>();
}
