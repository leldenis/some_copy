import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormArray,
  FormControl,
  NgControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

const DEFAULT_CODE_LENGTH = 6;

@Component({
  selector: 'upf-code-input',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule, NgxMaskDirective],
  templateUrl: './code-input.component.html',
  styleUrls: ['./code-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeInputComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @ViewChildren('codeInput')
  public codeInputs: QueryList<ElementRef<HTMLInputElement>>;

  @Input() public codeLength = DEFAULT_CODE_LENGTH;
  @Input() public validationError = 'invalid';

  public readonly codeFormArray = new FormArray<FormControl<string>>([]);

  private readonly destroyed$ = new Subject<void>();

  constructor(public control: NgControl) {
    // eslint-disable-next-line no-param-reassign
    control.valueAccessor = this;
  }

  public ngOnInit(): void {
    this.initForm();
    this.handleFormChange();
  }

  public ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  public onChange = (_: string): void => {};

  public onTouched = (): void => {};

  public writeValue(value: string): void {
    if (!value) {
      this.codeFormArray.reset([]);
      return;
    }

    for (let i = 0; i < this.codeLength; i += 1) {
      this.codeFormArray.get(`${i}`).setValue(value.charAt(i));
    }
  }
  public registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }
  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.codeFormArray.controls.forEach((control) => (isDisabled ? control.disable() : control.enable()));
  }

  public onBackspaceKeyup(index: number): void {
    if (index < 1) return;

    const prevInput = this.codeInputs.get(index - 1)?.nativeElement;
    if (prevInput) {
      prevInput.focus();
      prevInput.select();
    }
  }

  public onInput(index: number): void {
    const control = this.codeFormArray.get(`${index}`);
    if (control.invalid) {
      control.reset();
      return;
    }

    const nextInput = this.codeInputs.get(index + 1)?.nativeElement;
    if (nextInput) nextInput.focus();
  }

  public onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const code = event.clipboardData.getData('text');

    if (code.length === this.codeLength) {
      this.codeFormArray.controls.forEach((control, index) => {
        control.setValue(code.charAt(index));
      });
    }
  }

  private initForm(): void {
    for (let index = 0; index < this.codeLength; index += 1) {
      this.codeFormArray.setControl(
        index,
        new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]),
      );
    }
  }

  private handleFormChange(): void {
    this.codeFormArray.valueChanges
      .pipe(
        map((value) => value.join('')),
        takeUntil(this.destroyed$),
      )
      .subscribe((code) => this.onChange(code));
  }
}
