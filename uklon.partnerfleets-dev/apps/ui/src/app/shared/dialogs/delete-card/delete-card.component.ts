import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { ICONS } from '@ui/shared/tokens/icons.token';

export interface ConfirmationData {
  title: string;
  acceptBtn: string;
  declineBtn: string;
}

@Component({
  selector: 'upf-delete-card',
  standalone: true,
  imports: [MatIconButton, MatIcon, TranslateModule, MatButton],
  templateUrl: './delete-card.component.html',
  styleUrls: ['./delete-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteCardComponent {
  private readonly dialogRef = inject(MatDialogRef<DeleteCardComponent>);
  public readonly icons = inject(ICONS);
  public readonly pan = inject(MAT_DIALOG_DATA);

  public onAcceptClick(): void {
    this.dialogRef.close(true);
  }

  public onCancelClick(): void {
    this.dialogRef.close();
  }
}
