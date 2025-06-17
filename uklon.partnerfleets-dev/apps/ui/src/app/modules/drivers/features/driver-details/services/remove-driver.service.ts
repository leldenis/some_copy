import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EntityType } from '@constant';
import { EmployeeWalletItemDto, FleetDriverDto, RemoveReasonDto } from '@data-access';
import { Store } from '@ngrx/store';
import { FinanceService } from '@ui/modules/finance/services';
import { DEFAULT_CANNOT_REMOVE_ENTITY_DIALOG_CONFIG, DEFAULT_CONFIRMATION_MAT_DIALOG_CONFIG } from '@ui/shared/consts';
import { CannotRemoveEmployeeComponent, CannotRemoveEntityData } from '@ui/shared/dialogs/cannot-remove-employee';
import { RemoveEntityComponent } from '@ui/shared/dialogs/remove-entity';
import { Observable, of, switchMap, tap } from 'rxjs';
import { take } from 'rxjs/operators';

import { driversActions, DriversState } from '../../../store';

@Injectable({ providedIn: 'root' })
export class RemoveDriverService {
  constructor(
    private readonly driversStore: Store<DriversState>,
    private readonly financeService: FinanceService,
    private readonly matDialog: MatDialog,
  ) {}

  public remove(fleetDriver: FleetDriverDto, fleetId: string): Observable<void | RemoveReasonDto> {
    return this.financeService
      .getEmployeeWithWallet(fleetId, fleetDriver.id)
      .pipe(
        switchMap((driver) =>
          driver.wallet?.balance.amount === 0
            ? this.openRemoveDriverDialog(fleetDriver, fleetId)
            : this.openCannotRemoveEmployee(driver),
        ),
      );
  }

  private openRemoveDriverDialog(driver: FleetDriverDto, fleetId: string): Observable<void | RemoveReasonDto> {
    const dialogRef = this.matDialog.open(RemoveEntityComponent, {
      ...DEFAULT_CONFIRMATION_MAT_DIALOG_CONFIG,
      data: {
        placeholder: `${driver.last_name} ${driver.first_name}`,
        type: EntityType.DRIVER,
      },
    });

    return dialogRef.afterClosed().pipe(
      take(1),
      tap((res) => (res ? this.removeDriver(driver, res, fleetId) : of(null))),
    );
  }

  private removeDriver(driver: FleetDriverDto, reason: RemoveReasonDto, fleetId: string): void {
    const payload = {
      driverId: driver.id,
      body: reason,
      fleetId,
    };
    this.driversStore.dispatch(driversActions.removeFleetDriverById(payload));
  }

  private openCannotRemoveEmployee(employee: EmployeeWalletItemDto): Observable<void> {
    const dialogRef = this.matDialog.open<CannotRemoveEmployeeComponent, CannotRemoveEntityData>(
      CannotRemoveEmployeeComponent,
      {
        ...DEFAULT_CANNOT_REMOVE_ENTITY_DIALOG_CONFIG,
        data: {
          employee: { ...employee, type: EntityType.DRIVER },
        },
      },
    );

    return dialogRef.afterClosed();
  }
}
