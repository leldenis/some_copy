import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { ICONS } from '@ui/shared/tokens/icons.token';

export interface ConfirmationData {
  title: string;
  content?: string;
  acceptBtn: string;
  declineBtn: string;
}

@Component({
  selector: 'upf-confirmation',
  standalone: true,
  imports: [NgClass, TranslateModule, MatIconButton, MatIcon, MatDivider, MatButton],
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationComponent {
  private readonly dialogRef = inject(MatDialogRef<ConfirmationComponent>);
  public readonly confirmationData = inject<ConfirmationData>(MAT_DIALOG_DATA);
  public readonly icons = inject(ICONS);

  public onAcceptClick(): void {
    this.dialogRef.close(true);
  }

  public onCancelClick(): void {
    this.dialogRef.close();
  }
}
