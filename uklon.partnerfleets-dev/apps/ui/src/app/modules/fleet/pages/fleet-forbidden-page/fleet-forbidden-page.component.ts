import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'upf-fleet-forbidden-page',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './fleet-forbidden-page.component.html',
  styleUrls: ['./fleet-forbidden-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FleetForbiddenPageComponent {}
