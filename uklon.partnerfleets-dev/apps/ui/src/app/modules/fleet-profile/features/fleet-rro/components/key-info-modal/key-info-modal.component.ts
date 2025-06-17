import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { FleetSignatureKeyDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { Seconds2DatePipe } from '@ui/shared/pipes/seconds-2-date/seconds-2-date.pipe';

@Component({
  selector: 'upf-key-info-modal',
  standalone: true,
  imports: [MatButton, MatIcon, MatIconButton, TranslateModule, Seconds2DatePipe],
  templateUrl: './key-info-modal.component.html',
  styleUrl: './key-info-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeyInfoModalComponent {
  constructor(
    private readonly dialogRef: MatDialogRef<KeyInfoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FleetSignatureKeyDto,
  ) {}

  public handlerCancel(): void {
    this.dialogRef.close();
  }
}
