import { NumberInput } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, Component, Input, numberAttribute } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'upf-loading-indicator',
  templateUrl: './loading-indicator.component.html',
  styleUrls: ['./loading-indicator.component.scss'],
  imports: [MatProgressSpinnerModule, TranslateModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingIndicatorComponent {
  @Input({ required: true, transform: numberAttribute }) public size: NumberInput;
  @Input() public title?: string;
}
