import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { EmptyStates } from '@ui/shared/components/empty-state/empty-states';

@Component({
  selector: 'upf-empty-state',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyStateComponent {
  @Input() public state: EmptyStates = EmptyStates.NO_DATA;

  public readonly emptyStatesRef = EmptyStates;
}
