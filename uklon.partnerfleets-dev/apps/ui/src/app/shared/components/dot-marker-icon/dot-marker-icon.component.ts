import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'upf-dot-marker-icon',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './dot-marker-icon.component.html',
  styleUrl: './dot-marker-icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DotMarkerIconComponent {
  @Input() public className = '';
}
