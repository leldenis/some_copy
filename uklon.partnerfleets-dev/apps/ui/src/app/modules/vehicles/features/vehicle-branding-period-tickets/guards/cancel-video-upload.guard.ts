import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CanDeactivateFn, GuardResult, MaybeAsync } from '@angular/router';
import { CancelVehicleBrandingVideoUploadDialogComponent } from '@ui/modules/vehicles/features/vehicle-branding-period-tickets/dialogs';
import { CanDeactivateComponent } from '@ui/shared/models';
import { first } from 'rxjs/operators';

export function cancelVideoUploadGuard(
  message: string = 'VehicleBrandingPeriod.CancelVideoUploadDialog.Message',
): CanDeactivateFn<CanDeactivateComponent> {
  return (component: CanDeactivateComponent): MaybeAsync<GuardResult> => {
    const dialog = inject(MatDialog);

    if (component?.canDeactivate()) return true;

    return dialog
      .open(CancelVehicleBrandingVideoUploadDialogComponent, {
        disableClose: true,
        panelClass: 'confirmation-modal',
        autoFocus: false,
        data: { message },
      })
      .afterClosed()
      .pipe(first());
  };
}
