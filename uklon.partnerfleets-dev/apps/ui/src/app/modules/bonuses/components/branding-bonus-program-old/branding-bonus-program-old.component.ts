import { DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatOption, MatSelect } from '@angular/material/select';
import { Day } from '@constant';
import { BrandingBonusCalculationPeriodOldDto, BrandingBonusSpecOldDto, BrandingTypeOldDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { GROW_VERTICAL, TranslateItemsPipe } from '@ui/shared';
import { MoneyPipe } from '@ui/shared/pipes/money';
import { Seconds2DatePipe } from '@ui/shared/pipes/seconds-2-date/seconds-2-date.pipe';

@Component({
  selector: 'upf-branding-bonus-program-old',
  standalone: true,
  templateUrl: './branding-bonus-program-old.component.html',
  styleUrls: ['./branding-bonus-program-old.component.scss'],
  animations: [GROW_VERTICAL()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatIcon,
    TranslateModule,
    MatFormField,
    MatSelect,
    MatLabel,
    ReactiveFormsModule,
    MatOption,
    TranslateItemsPipe,
    DecimalPipe,
    MoneyPipe,
    Seconds2DatePipe,
  ],
})
export class BrandingBonusProgramOldComponent implements OnChanges {
  @Input() public currentCalculation: BrandingBonusCalculationPeriodOldDto;
  @Input() public specification: BrandingBonusSpecOldDto;

  @Output() public brandingTypeChanged = new EventEmitter<string>();
  @Output() public toggleBrandingType = new EventEmitter<boolean>();
  @Output() public toggleBrandingPrograms = new EventEmitter<boolean>();

  public brandingTypeControl = new FormControl<string>('');

  public readonly days = [Day.MONDAY, Day.TUESDAY, Day.WEDNESDAY, Day.THURSDAY, Day.FRIDAY, Day.SATURDAY, Day.SUNDAY];

  public open = true;

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentCalculation'] && this.currentCalculation?.brandingTypes?.length > 0) {
      this.brandingTypeControl.setValue(this.currentCalculation.brandingTypes[0]?.calculation_id);
    }
  }

  public compareBrandingTypeFn(obj1: BrandingTypeOldDto, obj2: BrandingTypeOldDto): boolean {
    return obj1?.calculation_id === obj2?.calculation_id;
  }

  public brandingTypeChange(calculationId: string): void {
    this.brandingTypeChanged.emit(calculationId);
  }

  public toggleBrandingTypeSelect(opened: boolean): void {
    this.toggleBrandingType.emit(opened);
  }

  public toggleBrandingProgram(): void {
    this.open = !this.open;
    this.toggleBrandingPrograms.emit(this.open);
  }

  public resetBrandingTypeControl(): void {
    this.brandingTypeControl.reset();
  }
}
