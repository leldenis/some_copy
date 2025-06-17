import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { PasswordValidatorError, CustomValidators } from '@ui/shared';
import { LetDirective } from '@ui/shared/directives/let.directive';
import { startWith, Subject, takeUntil } from 'rxjs';

import { PasswordValidityEventDto } from '../../models/password-validity-event.dto';

@Component({
  selector: 'upf-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    TranslateModule,
    LetDirective,
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  @Output() public controlValidityChange = new EventEmitter<PasswordValidityEventDto>();

  private readonly destroyed$ = new Subject<void>();

  public passwordForm = new FormGroup({
    newPassword: new FormControl<string>(
      '',
      Validators.compose([
        Validators.required,
        CustomValidators.minMaxLength(),
        CustomValidators.lowerCase(),
        CustomValidators.upperCase(),
        CustomValidators.digits(),
      ]),
    ),
    confirmPassword: new FormControl<string>('', CustomValidators.match('newPassword')),
  });
  public validationErrors: PasswordValidatorError[] = ['minMaxLength', 'lowerCase', 'upperCase', 'digits'];

  constructor(private readonly renderer: Renderer2) {}

  public get newPassword(): FormControl<string> {
    return this.passwordForm.get('newPassword') as FormControl;
  }

  public ngOnInit(): void {
    this.toggleConfirmPasswordDisabledState();
  }

  public ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  public toggleInputType(input: HTMLInputElement, event: MouseEvent): void {
    event.stopPropagation();
    const newType = input.type === 'password' ? 'text' : 'password';
    this.renderer.setAttribute(input, 'type', newType);
  }

  public checkInputValidity(control: 'newPassword' | 'confirmPassword'): void {
    const { valid } = this.passwordForm.get(control);
    this.controlValidityChange.emit({ control, valid });
  }

  private toggleConfirmPasswordDisabledState(): void {
    this.newPassword.statusChanges.pipe(startWith('INVALID'), takeUntil(this.destroyed$)).subscribe((status) => {
      const confirm = this.passwordForm.get('confirmPassword');
      status === 'INVALID' ? confirm.disable() : confirm.enable();
    });
  }
}
