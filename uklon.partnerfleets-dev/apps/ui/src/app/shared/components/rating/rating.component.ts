import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { IconsConfig } from '@ui/shared/tokens/icons.config';
import { ICONS } from '@ui/shared/tokens/icons.token';

@Component({
  selector: 'upf-rating',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RatingComponent {
  @Input() public value: number;
  @Input() public size: 'sm' | 'md' = 'md';
  @Input() public digitsInfo = '1.2-2';
  @Input() public inactive = false;
  @Input() public active = false;

  private readonly icons: IconsConfig = inject(ICONS);
}
