import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { Restriction, RestrictionReason } from '@constant';
import { CourierRestriction, CourierRestrictionDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { StatusBadgeComponent } from '@ui/shared';

interface CourierRestrictionForm {
  cash: FormControl<boolean>;
}

@Component({
  selector: 'upf-courier-restrictions',
  standalone: true,
  imports: [TranslateModule, ReactiveFormsModule, MatSlideToggle, StatusBadgeComponent],
  templateUrl: './courier-restrictions.component.html',
  styleUrls: ['./courier-restrictions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourierRestrictionsComponent implements OnChanges {
  @Input() public cashRestrictionSettings: CourierRestrictionDto;

  @Output() public updateRestriction = new EventEmitter<CourierRestriction>();
  @Output() public removeRestriction = new EventEmitter<CourierRestriction>();

  public readonly restrictionType = Restriction;
  public readonly restrictionReasonMap: Map<Partial<RestrictionReason>, string> = new Map([
    [RestrictionReason.MANAGER, 'Common.Enums.RestrictionReason.Title.Manager'],
    [RestrictionReason.FLEET, 'Common.Enums.RestrictionReason.Title.Fleet'],
  ]);

  public readonly restrictionReasonBadgeMap: Map<Partial<RestrictionReason>, boolean> = new Map([
    [RestrictionReason.MANAGER, true],
    [RestrictionReason.FLEET, false],
  ]);

  public form: FormGroup<CourierRestrictionForm>;

  public ngOnChanges({ cashRestrictionSettings }: SimpleChanges): void {
    if (!this.form) {
      this.form = this.createForm();
    }

    if (
      cashRestrictionSettings.currentValue &&
      cashRestrictionSettings.previousValue !== cashRestrictionSettings.currentValue
    ) {
      this.patchForm();
    }
  }

  public changeRestriction(checked: boolean, type: CourierRestriction): void {
    checked ? this.removeRestriction.emit(type) : this.updateRestriction.emit(type);
  }

  private createForm(): FormGroup<CourierRestrictionForm> {
    return new FormGroup({
      cash: new FormControl<boolean>(this.isEnabledRestriction(this.cashRestrictionSettings)),
    });
  }

  private patchForm(): void {
    this.form.patchValue({
      cash: this.isEnabledRestriction(this.cashRestrictionSettings),
    });
  }

  private isEnabledRestriction(restriction: CourierRestrictionDto): boolean {
    return restriction?.created_at && restriction?.actual_from
      ? restriction.created_at > restriction.actual_from
      : true;
  }
}
