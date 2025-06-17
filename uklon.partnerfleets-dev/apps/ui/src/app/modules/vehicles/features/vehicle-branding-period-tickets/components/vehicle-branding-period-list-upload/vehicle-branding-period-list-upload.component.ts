import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { VehicleBrandingPeriodTicketItemDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { UploadState } from '@ui/modules/vehicles/features/vehicle-branding-period-tickets/components';
import { ICONS } from '@ui/shared/tokens/icons.token';
import { NgxTippyModule } from 'ngx-tippy-wrapper';

@Component({
  selector: 'upf-vehicle-branding-period-list-upload',
  standalone: true,
  imports: [MatButton, MatIcon, TranslateModule, MatProgressBar, MatIconButton, NgxTippyModule, MatProgressSpinner],
  templateUrl: './vehicle-branding-period-list-upload.component.html',
  styleUrl: './vehicle-branding-period-list-upload.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleBrandingPeriodListUploadComponent {
  public readonly icons = inject(ICONS);

  public fileChange = output<{ ticketId: string; file: File }>();
  public cancelUpload = output<string>();

  public readonly ticket = input.required<VehicleBrandingPeriodTicketItemDto>();
  public readonly uploadState = input.required<UploadState | undefined>();
  public readonly allowedExtensions = input.required<string[]>();
  public readonly maxSizeMb = input.required<number>();

  public onFileSelect(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target?.files?.item(0);
    this.fileChange.emit({ ticketId: this.ticket().id, file });
    target.value = '';
  }

  public onCancelUpload(): void {
    this.cancelUpload.emit(this.ticket().id);
  }
}
