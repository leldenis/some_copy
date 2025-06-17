import { ChangeDetectionStrategy, Component, DestroyRef, Inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatOption } from '@angular/material/autocomplete';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { FiscalizationFarePaymentType, FiscalizationVatType, FleetFiscalizationSettingsDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';

import { FormType } from '@uklon/fleets/angular/cdk';

type FleetFiscalizationForm = FormType<FleetFiscalizationSettingsDto>;

export type FiscalizationSettingsDialogData = FleetFiscalizationSettingsDto;

@Component({
  selector: 'upf-fiscalization-settings-modal',
  standalone: true,
  imports: [
    MatDivider,
    MatIcon,
    MatIconButton,
    TranslateModule,
    MatButton,
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect,
    ReactiveFormsModule,
    MatInput,
    MatHint,
  ],
  templateUrl: './fiscalization-settings-modal.component.html',
  styleUrl: './fiscalization-settings-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiscalizationSettingsModalComponent implements OnInit {
  public formGroup: FormGroup<FleetFiscalizationForm>;
  public readonly farePaymentTypesOptions = [FiscalizationFarePaymentType.CASH, FiscalizationFarePaymentType.CASHLESS];
  public readonly vatTypeOptions = [
    FiscalizationVatType.RATE_0,
    FiscalizationVatType.RATE_20,
    FiscalizationVatType.WITHOUT_VAT,
    FiscalizationVatType.TAX_FREE,
  ];

  private initialValues: FleetFiscalizationSettingsDto;

  constructor(
    private readonly matDialogRef: MatDialogRef<FiscalizationSettingsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FiscalizationSettingsDialogData,
    private readonly destroyRef: DestroyRef,
  ) {}

  public ngOnInit(): void {
    this.setInitialValues();
    this.createForm();
  }

  public closeDialog(): void {
    this.matDialogRef.close();
  }

  public handlerSave(): void {
    const { service_product_name, ...rest } = this.formGroup.value;
    const settings = { ...rest, service_product_name: service_product_name || null };
    this.matDialogRef.close({ settings });
  }

  public isSaveBtnDisabled(): boolean {
    return this.formGroup.invalid || !this.checkIfFormChanged();
  }

  private setInitialValues(): void {
    this.initialValues = {
      fare_payment_types: this.data?.fare_payment_types?.length > 0 ? [...this.data.fare_payment_types] : [],
      vat_type: this.data?.vat_type ?? null,
      service_product_name: this.data?.service_product_name ?? '',
    };
  }

  private createForm(): void {
    this.formGroup = new FormGroup<FleetFiscalizationForm>({
      fare_payment_types: new FormControl<FiscalizationFarePaymentType[]>(this.data.fare_payment_types || [], [
        Validators.required,
      ]),
      vat_type: new FormControl<FiscalizationVatType>(this.data.vat_type || null, [Validators.required]),
      service_product_name: new FormControl(this.data?.service_product_name || '', [Validators.maxLength(100)]),
    });

    this.formGroup.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.checkIfFormChanged();
    });
  }

  private checkIfFormChanged(): boolean {
    const currentValue = this.formGroup.value;
    return JSON.stringify(currentValue) !== JSON.stringify(this.initialValues);
  }
}
