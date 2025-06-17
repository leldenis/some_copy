import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DriverRemovalReason, EntityType, VehicleRemovalReason } from '@constant';
import { RemoveReasonDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { RemoveEntityDataDto } from '@ui/shared/dialogs/remove-entity/model/remove-entity-data.dto';
import { IconsConfig } from '@ui/shared/tokens/icons.config';
import { ICONS } from '@ui/shared/tokens/icons.token';

import { FormType, predicateValidator, propagateErrorValidator } from '@uklon/fleets/angular/cdk';

import { DRIVER_REMOVAL_REASON_INTL, VEHICLE_REMOVAL_REASON_INTL } from '../../consts';

type RemovalReasonForm = FormType<RemoveReasonDto>;

@Component({
  standalone: true,
  selector: 'upf-remove-entity',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    TranslateModule,
  ],
  templateUrl: './remove-entity.component.html',
  styleUrls: ['./remove-entity.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RemoveEntityComponent implements OnInit {
  public entityType = EntityType;
  public reasons: (VehicleRemovalReason | DriverRemovalReason)[] = [];
  public reasonsIntl: Map<VehicleRemovalReason | DriverRemovalReason, string>;
  public formGroup: FormGroup<RemovalReasonForm>;

  constructor(
    private readonly dialogRef: MatDialogRef<RemoveEntityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RemoveEntityDataDto,
    @Inject(ICONS) public icons: IconsConfig,
  ) {
    this.createFormGroup();
  }

  public ngOnInit(): void {
    if (this.data.type === EntityType.DRIVER) {
      this.reasons = Object.values(DriverRemovalReason);
      this.reasonsIntl = DRIVER_REMOVAL_REASON_INTL;
    } else {
      this.reasons = Object.values(VehicleRemovalReason);
      this.reasonsIntl = VEHICLE_REMOVAL_REASON_INTL;
    }
  }

  public handleAcceptClick(): void {
    this.dialogRef.close(this.formGroup.value);
  }

  public handleCancelClick(): void {
    this.dialogRef.close();
  }

  private createFormGroup(): void {
    const other = this.data.type === EntityType.DRIVER ? DriverRemovalReason.OTHER : VehicleRemovalReason.OTHER;
    const reasonEqualOther = predicateValidator(
      (control) => control.parent.value.reason === other,
      Validators.required,
    );

    const commentValidator = propagateErrorValidator<RemovalReasonForm>('comment', reasonEqualOther);

    this.formGroup = new FormGroup<RemovalReasonForm>(
      {
        reason: new FormControl<VehicleRemovalReason | DriverRemovalReason>(other, [Validators.required]),
        comment: new FormControl<string>(''),
      },
      [commentValidator],
    );
  }
}
