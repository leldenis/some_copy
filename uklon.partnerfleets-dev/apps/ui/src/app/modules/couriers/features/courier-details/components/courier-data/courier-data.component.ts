import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ExpandableInfoComponent } from '@ui/shared/components/expandable-info/expandable-info.component';

@Component({
  selector: 'upf-courier-data',
  standalone: true,
  imports: [CommonModule, ExpandableInfoComponent, TranslateModule],
  templateUrl: './courier-data.component.html',
  styleUrls: ['./courier-data.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourierDataComponent {
  @Input() public phone: string;
  @Input() public createdAt: number;
}
