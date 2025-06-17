import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { RemoveEntityDataDto } from '@ui/shared/dialogs/remove-entity/model/remove-entity-data.dto';

@Component({
  selector: 'upf-remove-courier-dialog',
  standalone: true,
  imports: [MatIcon, MatIconButton, MatDivider, TranslateModule, MatButton],
  templateUrl: './remove-courier-dialog.component.html',
  styleUrls: ['./remove-courier-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RemoveCourierDialogComponent {
  constructor(
    private readonly dialogRef: MatDialogRef<RemoveCourierDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RemoveEntityDataDto,
  ) {}

  public handleAcceptClick(): void {
    this.dialogRef.close(true);
  }

  public handleCancelClick(): void {
    this.dialogRef.close();
  }
}
