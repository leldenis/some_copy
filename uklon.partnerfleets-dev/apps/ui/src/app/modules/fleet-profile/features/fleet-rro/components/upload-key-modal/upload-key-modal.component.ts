import { CommonModule } from '@angular/common';
import { HttpStatusCode } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  Inject,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatOption } from '@angular/material/autocomplete';
import { MatButton, MatIconButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatError, MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { FleetUploadSignatureKeysDto } from '@data-access';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { AppState } from '@ui/core/store/app.state';
import { FleetRROService } from '@ui/modules/fleet-profile/features/fleet-rro/services';
import { fleetRROActions, uploadSignatureKey } from '@ui/modules/fleet-profile/features/fleet-rro/store';
import { LoaderButtonComponent } from '@ui/shared/components/loader-button/loader-button.component';
import { InfoPanelComponent } from '@ui/shared/modules/info-panel/components/info-panel/info-panel.component';

import { FormType } from '@uklon/fleets/angular/cdk';

interface UploadFormType extends FleetUploadSignatureKeysDto {
  file: File;
}

type UploadSignatureKeyForm = FormType<UploadFormType>;

export interface UploadFormData {
  fleetId: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export enum UploadSignatureKeyError {
  INCORRECT_PASSWORD_OR_INVALID_KEY = 4000,
}

@Component({
  selector: 'upf-upload-key-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogClose,
    MatDivider,
    MatIcon,
    MatIconButton,
    TranslateModule,
    MatDialogContent,
    MatButton,
    MatDialogActions,
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect,
    ReactiveFormsModule,
    MatInput,
    MatError,
    MatSuffix,
    LoaderButtonComponent,
    InfoPanelComponent,
  ],
  templateUrl: './upload-key-modal.component.html',
  styleUrl: './upload-key-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadKeyModalComponent implements OnInit {
  @ViewChild('fileInput')
  public fileInput!: ElementRef;

  public uploadSignatureKey$ = this.store.select(uploadSignatureKey);

  public formGroup: FormGroup<UploadSignatureKeyForm>;
  public selectedFileName: string | null = null;
  public errorMessages: string[] = [];

  constructor(
    private readonly fleetRROService: FleetRROService,
    private readonly store: Store<AppState>,
    private readonly matDialogRef: MatDialogRef<UploadKeyModalComponent>,
    private readonly destroyRef: DestroyRef,
    private readonly cdr: ChangeDetectorRef,
    private readonly renderer: Renderer2,
    @Inject(MAT_DIALOG_DATA) public data: UploadFormData,
  ) {}

  public get hasSomeValue(): boolean {
    return (
      !!this.formGroup.get('password')?.value || !!this.formGroup.get('display_name')?.value || !!this.selectedFileName
    );
  }

  public ngOnInit(): void {
    this.listenBackdropClick();
    this.createForm();
  }

  public closeDialog(): void {
    if (this.hasSomeValue) {
      this.store.dispatch(fleetRROActions.openConfirmationModal());
    } else {
      this.matDialogRef.close();
    }
  }

  public isSaveBtnDisabled(): boolean {
    return this.formGroup.invalid || this.errorMessages.length > 0;
  }

  public triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  public handlerFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.errorMessages = [];

    if (input.files && input.files.length > 0) {
      const file = input.files.item(0);
      const allowedExtensions = ['dat', 'zs2', 'sk', 'jks', 'pk8', 'pfx'];
      const fileExtension = file.name?.split('.').pop().toLowerCase();

      if (!allowedExtensions.includes(fileExtension)) {
        this.errorMessages = [
          ...this.errorMessages,
          'FleetProfile.RRO.Modals.UploadKey.Btn.Upload.Error.FileExtension',
        ];
      }

      if (file.size > MAX_FILE_SIZE) {
        this.errorMessages = [...this.errorMessages, 'FleetProfile.RRO.Modals.UploadKey.Btn.Upload.Error.FileMaxSize'];
      }

      if (file.size === 0) {
        this.errorMessages = [...this.errorMessages, 'FleetProfile.RRO.Modals.UploadKey.Btn.Upload.Error.FileUpload'];
      }

      if (this.errorMessages.length === 0) {
        this.selectedFileName = file.name;
        this.formGroup.patchValue({ file: input.files.item(0) });
        this.formGroup.updateValueAndValidity();
      }
    }
  }

  public handlerSave(): void {
    if (this.formGroup.valid && this.data?.fleetId) {
      const { file, password, display_name } = this.formGroup.value;
      this.store.dispatch(fleetRROActions.startUploadSignatureKey());
      this.fleetRROService
        .uploadSignatureKeys(this.data.fleetId, file, { password, display_name })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => this.matDialogRef.close({ data: this.formGroup.value }),
          error: (err) => {
            this.store.dispatch(fleetRROActions.uploadSignatureKeyFailed());
            if (err.status === HttpStatusCode.BadRequest) {
              this.errorMessages = [
                ...this.errorMessages,
                'FleetProfile.RRO.Modals.UploadKey.Btn.Upload.Error.FileUpload',
              ];

              if (err?.error?.sub_code === UploadSignatureKeyError.INCORRECT_PASSWORD_OR_INVALID_KEY) {
                this.errorMessages = [
                  ...this.errorMessages,
                  'FleetProfile.RRO.Modals.UploadKey.Btn.Upload.Error.IncorrectPasswordOrInvalidKey',
                ];
              }
              this.cdr.markForCheck();
            }
          },
        });
    }
  }

  public togglePasswordField(event: MouseEvent, input: HTMLInputElement): void {
    event.stopPropagation();
    const newType = input.type === 'password' ? 'text' : 'password';
    this.renderer.setAttribute(input, 'type', newType);
  }

  public handlerOpenHowToGetKeyModal(): void {
    this.store.dispatch(fleetRROActions.openHowToGetKeyModal());
  }

  public clearErrors(): void {
    this.errorMessages = [];
  }

  private createForm(): void {
    this.formGroup = new FormGroup<UploadSignatureKeyForm>({
      file: new FormControl(null, [Validators.required]),
      password: new FormControl('', [Validators.required]),
      display_name: new FormControl('', [Validators.required]),
    });
  }

  private listenBackdropClick(): void {
    this.matDialogRef
      .backdropClick()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.closeDialog();
      });
  }
}
