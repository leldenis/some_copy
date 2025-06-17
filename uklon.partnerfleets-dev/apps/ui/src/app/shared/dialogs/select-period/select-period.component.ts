import { coerceNumberProperty } from '@angular/cdk/coercion';
import { TextFieldModule } from '@angular/cdk/text-field';
import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter, MatNativeDateModule, NativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { IconsConfig } from '@ui/shared/tokens/icons.config';
import { ICONS } from '@ui/shared/tokens/icons.token';
import { endOfDay } from 'date-fns';
import { DateTime } from 'luxon';
import { NgxMaskDirective } from 'ngx-mask';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

const DAY_START_TIME = '0000';
const DAY_END_TIME = '2359';

export interface SelectPeriodData {
  from: number;
  to: number;
  withDefaultTime?: boolean;
  showTime?: boolean;
}

function parseTimeControlValue(value: string): { minute: number; hour: number } {
  return {
    minute: coerceNumberProperty(value.slice(2), 0),
    hour: coerceNumberProperty(value.slice(0, 2), 0),
  };
}

function compareTime(date: DateTime, compareDate: DateTime): boolean {
  const daysDiff = date.diff(compareDate, 'days').days;
  const minutesDiff = date.diff(compareDate, 'minutes').minutes;
  // eslint-disable-next-line yoda
  return -1 < daysDiff && daysDiff < 1 && minutesDiff > 0;
}

function timeToValidator(
  fromDateControl: AbstractControl<string>,
  toDateControl: AbstractControl<string>,
): ValidatorFn {
  return (control: AbstractControl<string>): ValidationErrors => {
    const errors =
      Validators.required(control) || Validators.required(fromDateControl) || Validators.required(toDateControl);

    if (errors) {
      return null;
    }

    const { hour, minute } = parseTimeControlValue(control.value);
    const toDate = DateTime.fromJSDate(new Date(toDateControl.value)).set({ hour, minute });
    const fromDate = DateTime.fromJSDate(new Date(fromDateControl.value)).set({ hour, minute });
    const validationErrors: Record<string, boolean> = {};

    if (compareTime(toDate, DateTime.local())) {
      validationErrors['currentTime'] = true;
    }

    if (compareTime(toDate, fromDate)) {
      validationErrors['time'] = true;
    }

    return Object.keys(validationErrors).length > 0 ? validationErrors : null;
  };
}

function timeFromValidator(
  fromDateControl: AbstractControl<string>,
  toDateControl: AbstractControl<string>,
  toTimeControl: AbstractControl<string>,
): ValidatorFn {
  return (control: AbstractControl<string>): ValidationErrors => {
    const errors =
      Validators.required(control) ||
      Validators.required(fromDateControl) ||
      Validators.required(toDateControl) ||
      Validators.required(toTimeControl);

    if (errors) {
      return null;
    }

    const fromTime = parseTimeControlValue(control.value);
    const toTime = parseTimeControlValue(toTimeControl.value);
    const fromDate = DateTime.fromJSDate(new Date(fromDateControl.value)).set(fromTime);
    const toDate = DateTime.fromJSDate(new Date(toDateControl.value)).set(toTime);
    const hasError = compareTime(fromDate, toDate);
    return hasError ? { time: true } : null;
  };
}

@Component({
  selector: 'upf-select-period',
  standalone: true,
  imports: [
    TranslateModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatNativeDateModule,
    MatDatepickerModule,
    TextFieldModule,
    NgxMaskDirective,
  ],
  templateUrl: './select-period.component.html',
  styleUrls: ['./select-period.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectPeriodComponent implements OnInit, OnDestroy {
  public formGroup: UntypedFormGroup;
  public timeGroup: UntypedFormGroup;
  public dateGroup: UntypedFormGroup;
  public startAtDateControl: UntypedFormControl;
  public endAtDateControl: UntypedFormControl;
  public startAtTimeControl: UntypedFormControl;
  public endAtTimeControl: UntypedFormControl;
  public maxDate: Date;
  private readonly maxRangeDaysInMs = 92 * 24 * 60 * 60 * 1000;
  private readonly destroyed$ = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public readonly periodData: SelectPeriodData,
    @Inject(ICONS)
    public readonly icons: IconsConfig,
    private readonly dialogRef: MatDialogRef<SelectPeriodComponent>,
    private readonly dateAdapter: DateAdapter<NativeDateAdapter>,
  ) {
    this.dateAdapter.getFirstDayOfWeek = () => 1;
  }

  public ngOnInit(): void {
    this.initForm();
    this.subscribeFormChanges();
    this.maxDate = new Date();
  }

  public ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  public onAcceptClick(): void {
    const fromDate = new Date(this.startAtDateControl.value);
    const toDate = new Date(this.endAtDateControl.value);
    this.dialogRef.close({
      from: fromDate.setHours(this.startAtTimeControl.value.slice(0, 2), this.startAtTimeControl.value.slice(2)),
      to: toDate.setHours(this.endAtTimeControl.value.slice(0, 2), this.endAtTimeControl.value.slice(2)),
      isCustom: true,
    });
  }

  public onCancelClick(): void {
    this.dialogRef.close();
  }

  private initForm(): void {
    this.startAtDateControl = new UntypedFormControl('', [Validators.required]);
    this.endAtDateControl = new UntypedFormControl('', [Validators.required]);
    this.startAtTimeControl = new UntypedFormControl(this.periodData.withDefaultTime ? DAY_START_TIME : '');
    this.endAtTimeControl = new UntypedFormControl(this.periodData.withDefaultTime ? DAY_END_TIME : '');

    if (this.periodData.from && this.periodData.to) {
      this.patchForm();
    }

    this.startAtTimeControl.setValidators([
      Validators.required,
      timeFromValidator(this.startAtDateControl, this.endAtDateControl, this.endAtTimeControl),
    ]);

    this.endAtTimeControl.setValidators([
      Validators.required,
      timeToValidator(this.startAtDateControl, this.endAtDateControl),
    ]);

    this.startAtDateControl.setValidators([Validators.required]);

    this.endAtDateControl.setValidators([
      Validators.required,
      this.dateRangeValidator(this.startAtDateControl, this.endAtDateControl, this.maxRangeDaysInMs),
    ]);

    this.dateGroup = new UntypedFormGroup({
      startAtDate: this.startAtDateControl,
      endAtDate: this.endAtDateControl,
    });

    this.timeGroup = new UntypedFormGroup({
      startAtTime: this.startAtTimeControl,
      endAtTime: this.endAtTimeControl,
    });

    this.formGroup = new UntypedFormGroup({
      dateRange: this.dateGroup,
      timeRange: this.timeGroup,
    });
  }

  private patchForm(): void {
    const fromTime = this.timeToString(this.periodData.from);
    const toTime = this.timeToString(this.periodData.to);
    this.startAtDateControl.patchValue(new Date(this.periodData.from));
    this.endAtDateControl.patchValue(new Date(this.periodData.to));
    this.startAtTimeControl.patchValue(fromTime);
    this.endAtTimeControl.patchValue(toTime);
  }

  private subscribeFormChanges(): void {
    this.timeGroup.statusChanges.pipe(takeUntil(this.destroyed$)).subscribe(() => {
      this.startAtTimeControl.markAsTouched();
      this.endAtTimeControl.markAsTouched();
    });

    this.dateGroup.statusChanges.pipe(takeUntil(this.destroyed$)).subscribe(() => {
      this.startAtDateControl.markAsTouched();
      this.endAtDateControl.markAsTouched();
    });

    this.endAtDateControl.valueChanges
      .pipe(
        filter((value: string) => !!value),
        takeUntil(this.destroyed$),
      )
      .subscribe((value: string) => {
        const date = new Date(value);
        const currentDate = new Date();
        const isSameDate = date.toDateString() === currentDate.toDateString();
        const formattedTimeFrom = this.timeToString(+date);
        const formattedTimeTo = isSameDate ? this.timeToString(+currentDate) : this.timeToString(+endOfDay(date));
        this.startAtTimeControl.patchValue(formattedTimeFrom);
        this.endAtTimeControl.patchValue(formattedTimeTo);
      });
  }

  private readonly dateRangeValidator = (
    dateFromControl: AbstractControl,
    dateToControl: AbstractControl,
    maxRangeDaysInMs: number,
  ) => {
    return (): ValidationErrors | null => {
      const fromValue = dateFromControl?.value;
      const toValue = dateToControl?.value;

      if (fromValue != null && toValue != null) {
        const from = +fromValue;
        const to = +endOfDay(+toValue).getTime();
        const condition = to - from > maxRangeDaysInMs;

        if (condition) {
          return { dateRange: true };
        }
      }

      return null;
    };
  };

  private timeToString(value: number): string {
    const hours = new Date(value).getHours();
    const minutes = new Date(value).getMinutes();
    const formatedHours = hours < 10 ? `0${hours}` : hours;
    const formatedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formatedHours}${formatedMinutes}`;
  }
}
