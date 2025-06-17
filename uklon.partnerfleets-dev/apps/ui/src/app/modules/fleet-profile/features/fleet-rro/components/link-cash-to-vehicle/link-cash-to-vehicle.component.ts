import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, Inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatOption } from '@angular/material/autocomplete';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatSelect } from '@angular/material/select';
import { FleetCashPointDto, FleetVehiclePointOfSaleDto } from '@data-access';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { selectedFleetId } from '@ui/core/store/account/account.selectors';
import { LinkCashierToVehiclePayload } from '@ui/modules/fleet-profile/features/fleet-rro/components/fleet-vehicle-list/fleet-vehicle-list.component';
import { FleetRROService } from '@ui/modules/fleet-profile/features/fleet-rro/services';
import { FleetRROState } from '@ui/modules/fleet-profile/features/fleet-rro/store';
import { LoaderButtonComponent } from '@ui/shared/components/loader-button/loader-button.component';
import { BehaviorSubject, switchMap } from 'rxjs';

@Component({
  selector: 'upf-link-cash-to-vehicle',
  standalone: true,
  imports: [
    CommonModule,
    LoaderButtonComponent,
    MatButton,
    MatDivider,
    MatFormField,
    MatIcon,
    MatIconButton,
    MatLabel,
    MatOption,
    MatSelect,
    TranslateModule,
    ReactiveFormsModule,
  ],
  templateUrl: './link-cash-to-vehicle.component.html',
  styleUrl: './link-cash-to-vehicle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkCashToVehicleComponent {
  public readonly points$ = this.store.select(selectedFleetId).pipe(
    takeUntilDestroyed(this.destroyRef),
    switchMap((fleetId) => this.fleetRROService.getFleetPointsOfSale(fleetId)),
  );

  public readonly loading$ = new BehaviorSubject<boolean>(false);
  public readonly pointOfSaleFormControl = new FormControl<FleetCashPointDto>(null);

  constructor(
    private readonly store: Store<FleetRROState>,
    private readonly fleetRROService: FleetRROService,
    private readonly destroyRef: DestroyRef,
    private readonly matDialogRef: MatDialogRef<LinkCashToVehicleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LinkCashierToVehiclePayload,
  ) {}

  public closeDialog(): void {
    this.matDialogRef.close();
  }

  public handlerSave(): void {
    if (this.pointOfSaleFormControl.valid && this.pointOfSaleFormControl.value) {
      const { id } = this.pointOfSaleFormControl.value;
      const body: FleetVehiclePointOfSaleDto = {
        point_of_sale_id: id,
      };

      this.loading$.next(true);

      this.fleetRROService
        .linkCashierToVehicle(this.data.vehicle.id, body)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.loading$.next(false);
            this.matDialogRef.close({ data: this.pointOfSaleFormControl.value });
          },
          error: () => this.loading$.next(false),
        });
    }
  }
}
