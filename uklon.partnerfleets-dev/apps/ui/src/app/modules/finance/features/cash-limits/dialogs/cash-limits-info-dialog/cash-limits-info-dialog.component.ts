import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostBinding,
  inject,
  QueryList,
  signal,
  ViewChildren,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialogClose } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { INFO_DIALOG_LAYOUT } from '@ui/modules/finance/features/cash-limits/consts';
import { UIService } from '@ui/shared';
import { InfoPanelComponent } from '@ui/shared/modules/info-panel/components/info-panel/info-panel.component';

@Component({
  selector: 'upf-cash-limits-info-dialog',
  standalone: true,
  imports: [
    MatIcon,
    MatIconButton,
    MatButton,
    MatDialogClose,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatDivider,
    TranslateModule,
    InfoPanelComponent,
  ],
  templateUrl: './cash-limits-info-dialog.component.html',
  styleUrl: './cash-limits-info-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashLimitsInfoDialogComponent {
  @ViewChildren(MatAccordion) public accordions: QueryList<MatAccordion>;
  @HostBinding('attr.data-cy') private readonly attribute = 'cash-limits-info-dialog';

  public readonly layout = INFO_DIALOG_LAYOUT;
  public readonly isMobileView = toSignal(inject(UIService).breakpointMatch());
  public readonly expandedIndex = signal(0);
  public readonly panelHeightPx = computed(() => {
    return this.isMobileView() ? '44px' : '48px';
  });

  private readonly analytics = inject(AnalyticsService);

  public onExpandedChange(index: number): void {
    if (index !== this.expandedIndex()) {
      this.accordions.get(this.expandedIndex()).closeAll();
    }

    this.expandedIndex.set(index);
  }
}
