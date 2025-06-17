import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EmptyStateComponent } from '@ui/shared/components/empty-state/empty-state.component';
import { EmptyStates } from '@ui/shared/components/empty-state/empty-states';

@Component({
  selector: 'upf-unsupported-page',
  standalone: true,
  imports: [EmptyStateComponent],
  templateUrl: './unsupported-page.component.html',
  styleUrl: './unsupported-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnsupportedPageComponent {
  public readonly emptyStateUnsupportedData = EmptyStates.UNSUPPORTED_DATA;
}
