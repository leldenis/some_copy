import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl } from '@angular/forms';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'upf-checkbox-select-all',
  standalone: true,
  imports: [CommonModule, MatCheckbox, TranslateModule],
  templateUrl: './checkbox-select-all.component.html',
  styleUrl: './checkbox-select-all.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxSelectAllComponent<T> implements OnInit {
  public control = input.required<AbstractControl<T[]>>();
  public controlOptions = input.required<T[]>();

  public isChecked = signal<boolean>(false);
  public isIndeterminate = signal<boolean>(false);

  private readonly destroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    this.control()
      .valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.updateIndeterminate();
        this.updateChecked();
      });
  }

  public updateChecked(): void {
    this.isChecked.set(
      this.control().value &&
        this.controlOptions().length > 0 &&
        this.control().value.length === this.controlOptions().length,
    );
  }

  public updateIndeterminate(): void {
    this.isIndeterminate.set(
      this.control().value &&
        this.controlOptions().length > 0 &&
        this.control().value.length > 0 &&
        this.control().value.length < this.controlOptions().length,
    );
  }

  public toggleSelection(change: MatCheckboxChange): void {
    if (change.checked) {
      this.control().setValue(this.controlOptions());
    } else {
      this.control().setValue([]);
    }
  }
}
