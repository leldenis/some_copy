import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, Inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatOption, MatSelect } from '@angular/material/select';
import { FleetCashPointDto, GatewayFleetCashPointDto } from '@data-access';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { FleetRROService } from '@ui/modules/fleet-profile/features/fleet-rro/services';
import { cashiers, cashiersLoading, FleetRROState } from '@ui/modules/fleet-profile/features/fleet-rro/store';
import { ProgressSpinnerComponent } from '@ui/shared';
import { LoaderButtonComponent } from '@ui/shared/components/loader-button/loader-button.component';
import { BehaviorSubject } from 'rxjs';

import { uuidv4 } from '@uklon/angular-core';

interface CashiersPosData {
  cashierId: string;
}

@Component({
  selector: 'upf-link-cash-to-key-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatIconButton,
    MatIcon,
    TranslateModule,
    MatDivider,
    ReactiveFormsModule,
    MatFormField,
    MatSelect,
    MatButton,
    MatOption,
    MatLabel,
    LoaderButtonComponent,
    ProgressSpinnerComponent,
  ],
  templateUrl: './link-cash-to-key-modal.component.html',
  styleUrl: './link-cash-to-key-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkCashToKeyModalComponent {
  public readonly cashiers$ = this.store.select(cashiers);
  public readonly cashiersLoading$ = this.store.select(cashiersLoading);

  public readonly loading$ = new BehaviorSubject<boolean>(false);
  public cashierPosFormControl = new FormControl<GatewayFleetCashPointDto>(null);

  constructor(
    private readonly store: Store<FleetRROState>,
    private readonly fleetRROService: FleetRROService,
    private readonly destroyRef: DestroyRef,
    private readonly matDialogRef: MatDialogRef<LinkCashToKeyModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CashiersPosData,
  ) {}

  public closeDialog(): void {
    this.matDialogRef.close();
  }

  public handlerSave(): void {
    if (this.cashierPosFormControl.valid && this.cashierPosFormControl.value) {
      const { org_name, name, fiscal_number } = this.cashierPosFormControl.value;
      const body: FleetCashPointDto = {
        organization_name: org_name,
        name,
        fiscal_number,
        id: uuidv4(),
      };

      this.loading$.next(true);

      this.fleetRROService
        .linkCashierToKey(this.data.cashierId, body)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.loading$.next(false);
            this.matDialogRef.close({ data: this.cashierPosFormControl.value });
          },
          error: () => this.loading$.next(false),
        });
    }
  }
}
