import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, TemplateRef, ViewChild } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialog, MatDialogClose } from '@angular/material/dialog';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { InfoPanelComponent } from '@ui/shared/modules/info-panel/components/info-panel/info-panel.component';
import { InfoPanelTitleDirective } from '@ui/shared/modules/info-panel/directives';

interface AccordionItemLayout {
  title: string;
  message: string;
  infoPanelMessage?: string;
}

const PANELS = [
  'TimeOnline',
  'ExecutionTime',
  'OrdersPerHour',
  'IncomePerHour',
  'Chain',
  'Ether',
  'Auto',
  'TimeWithPassenger',
  'TotalCost',
  'IncomePerDistance',
  'Total',
];
const WITH_INFO_PANELS = new Set<string>(['TimeOnline', 'ExecutionTime', 'OrdersPerHour', 'IncomePerHour']);

@Component({
  selector: 'upf-report-stats-explanation',
  standalone: true,
  imports: [
    CommonModule,
    MatIcon,
    TranslateModule,
    MatButton,
    MatDialogClose,
    MatIconButton,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    InfoPanelComponent,
    InfoPanelTitleDirective,
  ],
  templateUrl: './report-stats-explanation.component.html',
  styleUrl: './report-stats-explanation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportStatsExplanationComponent {
  @ViewChild('dialog')
  public dialogTemplate: TemplateRef<HTMLElement>;

  public readonly layout: AccordionItemLayout[] = PANELS.map((panel) => ({
    title: `Dialogs.ReportStatsExplanation.Accordion.${panel}.Title`,
    message: `Dialogs.ReportStatsExplanation.Accordion.${panel}.Message`,
    infoPanelMessage: WITH_INFO_PANELS.has(panel)
      ? `Dialogs.ReportStatsExplanation.Accordion.${panel}.InfoPanelMessage`
      : null,
  }));

  constructor(private readonly dialog: MatDialog) {}

  public showStatsDialog(): void {
    this.dialog.open(this.dialogTemplate, {
      panelClass: 'merchant-info-dialog',
    });
  }
}
