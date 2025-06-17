import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  ElementRef,
  forwardRef,
  Inject,
  input,
  OnInit,
  Optional,
  output,
  Self,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MAT_FORM_FIELD, MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelect, MatSelectChange, MatSelectModule } from '@angular/material/select';
import { DateRangeDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { DateTimeRangeControlModule } from '@ui/shared/components/date-time-range-control/date-time-range-control.module';
import { DATE_PERIODS } from '@ui/shared/consts';
import { SelectPeriodComponent } from '@ui/shared/dialogs/select-period/select-period.component';
import { PeriodLabel } from '@ui/shared/enums';
import { IconsConfig } from '@ui/shared/tokens/icons.config';
import { ICONS } from '@ui/shared/tokens/icons.token';
import { cloneDeep } from 'lodash';
import moment from 'moment';
import { Subject } from 'rxjs';

export interface Period {
  label: PeriodLabel | string;
  values: {
    from: number;
    to: number;
    isCustom?: boolean;
  };
  cyLabel?: string;
}

interface DateTimeRange {
  from: number;
  to: number;
  isCustom?: boolean;
}

type DateTimeRangeOption = Period;
type DateTimeRangeControlTouchedFn = () => object;
type DateTimeRangeControlChangeFn = (value: DateTimeRange) => void;

function getDateTimeRangeOptions(): DateTimeRangeOption[] {
  const dateTimeRangeOptions = cloneDeep(DATE_PERIODS);
  return dateTimeRangeOptions.filter((option) => option.label !== PeriodLabel.CHOOSE_PERIOD);
}

function getCustomDateTimeRangeOption(): DateTimeRangeOption {
  return {
    label: PeriodLabel.CHOOSE_PERIOD,
    values: {
      from: null,
      to: null,
    },
  };
}

@Component({
  selector: 'upf-date-time-range-control',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatIconModule,
    MatDialogModule,
    MatNativeDateModule,
    DateTimeRangeControlModule,
  ],
  templateUrl: './date-time-range-control.component.html',
  styleUrls: ['./date-time-range-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: MatFormFieldControl, useExisting: forwardRef(() => DateTimeRangeControlComponent) }],
})
export class DateTimeRangeControlComponent
  extends MatFormFieldControl<DateTimeRange>
  implements OnInit, ControlValueAccessor
{
  public readonly withDefaultTime = input<boolean>(false);
  public readonly showTime = input<boolean>(true);

  public readonly rangeChange = output<DateRangeDto>();

  public readonly dateTimeRangeOptions: DateTimeRangeOption[] = getDateTimeRangeOptions();
  public customDateTimeRangeOption = getCustomDateTimeRangeOption();
  public control = new FormControl<DateRangeDto>(null);

  public override focused = false;
  public override stateChanges: Subject<void>;

  private readonly selectDateTimeRangeComponent = SelectPeriodComponent;
  private readonly matSelect = viewChild(MatSelect);
  private readonly dateTimeFormat = computed(() => (this.showTime() ? 'DD.MM.YYYY HH:mm' : 'DD.MM.YYYY'));

  constructor(
    @Inject(ICONS) public readonly icons: IconsConfig,
    @Optional() @Inject(MAT_FORM_FIELD) public readonly formField: MatFormField,
    @Optional() @Self() public override readonly ngControl: NgControl,
    private readonly matDialog: MatDialog,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly elementRef: ElementRef,
  ) {
    super();
    if (this.ngControl) this.ngControl.valueAccessor = this;
    this.elementRef.nativeElement.dataset.cy = 'date-range-control';
  }

  public setDescribedByIds(ids: string[]): void {
    if (ids.length > 0) {
      this.elementRef.nativeElement.setAttribute('aria-describedby', ids.join(' '));
    } else {
      this.elementRef.nativeElement.removeAttribute('aria-describedby');
    }
  }

  public ngOnInit(): void {
    this.control = (this.ngControl?.control as FormControl<DateRangeDto>) || new FormControl<DateRangeDto>(null);
    this.stateChanges = this.matSelect().stateChanges;
  }

  public onContainerClick(): void {
    this.matSelect().onContainerClick();
    this.focused = true;
    this.stateChanges.next();
  }

  public writeValue(value: DateTimeRange): void {
    if (this.isCustomRange(value.from, value.to)) {
      this.customDateTimeRangeOption.values = value;
      this.setCustomDateTimeRangeOptionLabel(value);
    } else {
      this.customDateTimeRangeOption = getCustomDateTimeRangeOption();
    }

    this.matSelect().writeValue(value);
  }

  public isCustomRange(dateFrom: number, dateTo: number): boolean {
    const range = this.dateTimeRangeOptions.find(
      ({ values: { from, to } }) => from === Number(dateFrom) && to === Number(dateTo),
    );

    return !range;
  }

  public registerOnChange(changeFn: DateTimeRangeControlChangeFn): void {
    this.matSelect().registerOnChange(changeFn);
  }

  public registerOnTouched(touchedFn: DateTimeRangeControlTouchedFn): void {
    this.matSelect().registerOnTouched(touchedFn);
  }

  public openCustomDateTimeRangeSelectDialog(option: DateTimeRangeOption, event: MouseEvent): void {
    event.stopPropagation();
    const dialogRef = this.matDialog.open(this.selectDateTimeRangeComponent, {
      disableClose: true,
      panelClass: 'period-modal',
      autoFocus: false,
      data: {
        from: option.values.from,
        to: option.values.to,
        withDefaultTime: this.withDefaultTime(),
        showTime: this.showTime(),
      },
    });

    dialogRef.afterClosed().subscribe((range: DateTimeRange) => {
      if (range) {
        this.setCustomDateTimeRange(range);
        this.control.setValue(range);
        this.rangeChange.emit(range);
      }
    });
  }

  public compareObjects(o1: DateTimeRange, o2: DateTimeRange): boolean {
    // eslint-disable-next-line eqeqeq
    return o1?.from == o2?.from && o1?.to == o2?.to;
  }

  public handleMatSelectBlur(): void {
    this.focused = false;
    this.stateChanges.next();
  }

  public onSelectionChange({ value }: MatSelectChange): void {
    this.rangeChange.emit(value);
  }

  private setCustomDateTimeRangeOptionLabel(dateTimeRange: DateTimeRange): void {
    const fromLabel = moment(dateTimeRange.from).format(this.dateTimeFormat());
    const toLabel = moment(dateTimeRange.to).format(this.dateTimeFormat());
    this.customDateTimeRangeOption.label = `${fromLabel} - ${toLabel}`;
    this.changeDetectorRef.detectChanges();
  }

  private setCustomDateTimeRange(dateTimeRange: DateTimeRange): void {
    this.customDateTimeRangeOption.values = dateTimeRange;

    this.setCustomDateTimeRangeOptionLabel(dateTimeRange);
    this.control.setValue(this.customDateTimeRangeOption.values);
    this.control.updateValueAndValidity();
  }
}
