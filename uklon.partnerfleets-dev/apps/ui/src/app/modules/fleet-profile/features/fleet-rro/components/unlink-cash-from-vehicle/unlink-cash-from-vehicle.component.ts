import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, Inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { FleetVehicleWithFiscalizationUnlinkDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { FleetRROService } from '@ui/modules/fleet-profile/features/fleet-rro/services';
import { LoaderButtonComponent } from '@ui/shared/components/loader-button/loader-button.component';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'upf-unlink-cash-from-vehicle',
  standalone: true,
  imports: [CommonModule, MatButton, MatIcon, MatIconButton, TranslateModule, LoaderButtonComponent, MatDivider],
  templateUrl: './unlink-cash-from-vehicle.component.html',
  styleUrl: './unlink-cash-from-vehicle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnlinkCashFromVehicleComponent {
  public readonly loading$ = new BehaviorSubject<boolean>(false);

  constructor(
    private readonly fleetRROService: FleetRROService,
    private readonly destroyRef: DestroyRef,
    private readonly matDialogRef: MatDialogRef<UnlinkCashFromVehicleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FleetVehicleWithFiscalizationUnlinkDto,
  ) {}

  public closeDialog(): void {
    this.matDialogRef.close();
  }

  public handlerSave(): void {
    this.loading$.next(true);

    this.fleetRROService
      .removeCashierFromVehicle(this.data.vehicle.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loading$.next(false);
          this.matDialogRef.close({ data: this.data });
        },
        error: () => this.loading$.next(false),
      });
  }
}
