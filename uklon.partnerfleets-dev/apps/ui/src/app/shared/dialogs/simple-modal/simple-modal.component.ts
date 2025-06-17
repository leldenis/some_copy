import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { IconsConfig } from '@ui/shared/tokens/icons.config';
import { ICONS } from '@ui/shared/tokens/icons.token';

export enum SimpleModalType {
  POSITIVE = 'positive',
  NEGATIVE = 'negative',
}

export interface SimpleData {
  title: string;
  content?: string;
  cancelBtn?: string;
  acceptBtn?: string;
  modalType?: SimpleModalType;
}

@Component({
  selector: 'upf-simple-modal',
  standalone: true,
  imports: [MatButton, MatIcon, MatIconButton, TranslateModule, MatDivider],
  templateUrl: './simple-modal.component.html',
  styleUrl: './simple-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleModalComponent {
  public readonly type = SimpleModalType;

  constructor(
    private readonly dialogRef: MatDialogRef<SimpleModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SimpleData,
    @Inject(ICONS) public icons: IconsConfig,
  ) {}

  public get modalPositiveType(): boolean {
    return this.data.modalType === this.type.POSITIVE;
  }

  public handlerCancel(): void {
    this.dialogRef.close();
  }

  public handlerAccept(): void {
    this.dialogRef.close(true);
  }
}
