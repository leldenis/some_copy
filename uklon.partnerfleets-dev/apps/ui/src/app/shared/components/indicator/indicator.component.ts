import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'upf-indicator',
  standalone: true,
  imports: [],
  templateUrl: './indicator.component.html',
  styleUrl: './indicator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndicatorComponent {}
