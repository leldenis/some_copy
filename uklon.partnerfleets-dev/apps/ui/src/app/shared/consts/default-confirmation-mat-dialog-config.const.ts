import { MatDialogConfig } from '@angular/material/dialog';

export const DEFAULT_CONFIRMATION_MAT_DIALOG_CONFIG: MatDialogConfig<unknown> = {
  disableClose: true,
  panelClass: 'confirmation-modal',
  autoFocus: false,
};

export const DEFAULT_CANNOT_REMOVE_ENTITY_DIALOG_CONFIG = {
  ...DEFAULT_CONFIRMATION_MAT_DIALOG_CONFIG,
  panelClass: 'mat-dialog-no-padding',
  disableClose: false,
};
