import { NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'upf-progress-bar',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressBarComponent {
  @Input() public value = 0;
  @Input() public size: 'sm' | 'md' = 'sm';
  @Input() public inactive = false;
  @Input() public theme: 'green' | 'black' | 'custom' = 'green';
}
