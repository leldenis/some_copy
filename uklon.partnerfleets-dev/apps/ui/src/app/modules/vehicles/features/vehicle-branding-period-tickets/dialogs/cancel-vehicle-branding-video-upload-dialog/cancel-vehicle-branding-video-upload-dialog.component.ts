import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'upf-cancel-vehicle-branding-video-upload-dialog',
  standalone: true,
  imports: [CommonModule, MatIconButton, MatIcon, MatButton, MatDialogClose, TranslateModule],
  templateUrl: './cancel-vehicle-branding-video-upload-dialog.component.html',
  styleUrl: './cancel-vehicle-branding-video-upload-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CancelVehicleBrandingVideoUploadDialogComponent {
  public readonly dialogData: { message: string } = inject(MAT_DIALOG_DATA);
}
