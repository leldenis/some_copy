import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';
import { EntityType } from '@constant';
import { EmployeeWalletItemDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { CorePaths } from '@ui/core/models/core-paths';
import { MoneyPipe } from '@ui/shared/pipes/money';

export interface CannotRemoveEntityData {
  readonly employee: EmployeeWalletItemDto;
}

const ENTITY_TRANSLATION_KEY = {
  [EntityType.DRIVER]: 'Driver',
  [EntityType.COURIER]: 'Courier',
};

@Component({
  standalone: true,
  selector: 'upf-cannot-remove-employee',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    TranslateModule,
    MatDialogModule,
    MatListModule,
    MoneyPipe,
  ],
  templateUrl: './cannot-remove-employee.component.html',
  styleUrls: ['./cannot-remove-employee.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CannotRemoveEmployeeComponent {
  public readonly employee: EmployeeWalletItemDto;
  public entityTranslationKey: string;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private readonly data: CannotRemoveEntityData,
    private readonly matDialogRef: MatDialogRef<CannotRemoveEmployeeComponent>,
    private readonly router: Router,
  ) {
    this.employee = this.data.employee;
    this.entityTranslationKey =
      ENTITY_TRANSLATION_KEY[this.data.employee.type as EntityType.DRIVER | EntityType.COURIER];
  }

  public navigateToWithdraw(): void {
    this.matDialogRef.close();
    const url =
      this.employee.type === EntityType.DRIVER
        ? `${CorePaths.WORKSPACE}/${CorePaths.FINANCE}#1`
        : `${CorePaths.WORKSPACE}/${CorePaths.COURIERS}/${CorePaths.FINANCE}#1`;

    this.router.navigateByUrl(url);
  }
}
