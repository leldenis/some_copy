import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'upf-expandable-info',
  standalone: true,
  imports: [NgClass, MatExpansionModule, MatIconModule],
  templateUrl: './expandable-info.component.html',
  styleUrls: ['./expandable-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpandableInfoComponent {
  @Input() public headerTitle: string;
  @Input() public heightPx = '24px';
  @Input() public expanded = true;
  @Input() public canCollapse = true;
}
