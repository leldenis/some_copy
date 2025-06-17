import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { DriverOrderFilterDto, DriverOrderFilterTypeVersion, FeeType } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { DriverOrderFilterPipe } from '@ui/shared';
import { MoneyComponent } from '@ui/shared/components/money/money.component';

import { UklAngularCoreModule } from '@uklon/angular-core';

@Component({
  selector: 'upf-driver-filters-details-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogClose,
    MatIcon,
    MatIconButton,
    TranslateModule,
    DriverOrderFilterPipe,
    UklAngularCoreModule,
    MoneyComponent,
    MatDivider,
  ],
  templateUrl: './driver-filters-details-dialog.component.html',
  styleUrl: './driver-filters-details-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriverFiltersDetailsDialogComponent {
  @HostBinding('attr.data-cy') public attribute = 'driver-filters-details-dialog';

  public readonly filters = inject<DriverOrderFilterDto[]>(MAT_DIALOG_DATA);
  public readonly typeVersion = DriverOrderFilterTypeVersion;
  public readonly paymentTypeIcon = new Map<FeeType, string>([
    [FeeType.CASH, 'i-cash'],
    [FeeType.CASHLESS, 'i-card'],
    [FeeType.MIXED, 'i-fee-type-mixed'],
  ]);
}
