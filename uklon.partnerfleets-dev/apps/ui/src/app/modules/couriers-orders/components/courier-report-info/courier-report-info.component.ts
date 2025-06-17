import { NgClass, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { ReportByOrdersDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { MoneyComponent } from '@ui/shared/components/money/money.component';
import { NgxTippyModule } from 'ngx-tippy-wrapper';

@Component({
  selector: 'upf-courier-report-info',
  standalone: true,
  imports: [TranslateModule, NgTemplateOutlet, MatDivider, MatIcon, NgxTippyModule, MoneyComponent, NgClass],
  templateUrl: './courier-report-info.component.html',
  styleUrls: ['./courier-report-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourierReportInfoComponent {
  @Input() public report: ReportByOrdersDto;

  @Input() public isMobileView: boolean;
}
