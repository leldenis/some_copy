import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'upf-progress-spinner',
  standalone: true,
  imports: [MatProgressSpinnerModule, TranslateModule],
  templateUrl: './progress-spinner.component.html',
  styleUrls: ['./progress-spinner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressSpinnerComponent {}
