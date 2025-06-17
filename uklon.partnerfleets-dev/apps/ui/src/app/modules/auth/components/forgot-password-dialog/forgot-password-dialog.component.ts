import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialogClose } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { AnalyticsBase, FleetAnalyticsEventType } from '@data-access';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { TranslationModule } from '@ui/core/translation.module';

@Component({
  selector: 'upf-forgot-password-dialog',
  standalone: true,
  imports: [TranslationModule, MatDialogClose, MatIcon, MatIconButton, MatButton],
  templateUrl: './forgot-password-dialog.component.html',
  styleUrl: './forgot-password-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordDialogComponent {
  public readonly analyticsEvent = FleetAnalyticsEventType;

  constructor(private readonly analytics: AnalyticsService) {}

  public reportEvent(event: FleetAnalyticsEventType): void {
    this.analytics.reportEvent<AnalyticsBase>(event);
  }
}
