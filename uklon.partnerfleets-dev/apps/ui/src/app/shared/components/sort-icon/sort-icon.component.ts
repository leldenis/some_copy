import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SortDirection } from '@angular/material/sort';

@Component({
  selector: 'upf-sort-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sort-icon.component.html',
  styleUrls: ['./sort-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SortIconComponent {
  @Input() public direction: SortDirection;
}
