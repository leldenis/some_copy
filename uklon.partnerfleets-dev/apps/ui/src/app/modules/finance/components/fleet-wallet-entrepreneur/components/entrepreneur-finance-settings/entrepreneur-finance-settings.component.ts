import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FleetBalanceSplitModelDto } from '@data-access';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'upf-entrepreneur-finance-settings',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './entrepreneur-finance-settings.component.html',
  styleUrl: './entrepreneur-finance-settings.component.scss',
  providers: [TranslateService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntrepreneurFinanceSettingsComponent {
  @Input() public balanceSplitModel: FleetBalanceSplitModelDto;
}
