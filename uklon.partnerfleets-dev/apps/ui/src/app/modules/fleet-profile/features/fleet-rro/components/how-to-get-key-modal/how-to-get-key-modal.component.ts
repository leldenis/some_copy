import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { DotMarkerIconComponent } from '@ui/shared';

@Component({
  selector: 'upf-how-to-get-key-modal',
  standalone: true,
  imports: [MatButton, MatIcon, MatIconButton, TranslateModule, DotMarkerIconComponent],
  templateUrl: './how-to-get-key-modal.component.html',
  styleUrl: './how-to-get-key-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HowToGetKeyModalComponent {
  constructor(private readonly dialogRef: MatDialogRef<HowToGetKeyModalComponent>) {}

  public handlerCancel(): void {
    this.dialogRef.close();
  }
}
