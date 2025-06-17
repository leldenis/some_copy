import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  DestroyRef,
  Directive,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DateRangeDto, FleetDto, getCurrentWeek } from '@data-access';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { StorageFiltersKey, StorageService } from '@ui/core/services/storage.service';
import { AccountState } from '@ui/core/store/account/account.reducer';
import { getSelectedFleet } from '@ui/core/store/account/account.selectors';
import { LetDirective } from '@ui/shared/directives/let.directive';
import { GROW_VERTICAL } from '@ui/shared/utils';
import { BehaviorSubject, Observable, debounceTime, filter, startWith, tap, map } from 'rxjs';
import { pairwise } from 'rxjs/operators';

const DEFAULT_RANGE = getCurrentWeek();
const DEBOUNCE_TIME_MS = 300;

type Filters = Record<string, string | string[] | DateRangeDto>;

const arrayControlChanged = <T extends any[], K>(prev: T, current: K): boolean =>
  !Array.isArray(current) || prev.length !== current.length || !prev.every((value, index) => value === current[index]);

const dateControlChanged = <T extends DateRangeDto, K extends DateRangeDto>({ from, to }: T, prev?: K): boolean => {
  if (prev) {
    return from !== prev.from || to !== prev.to;
  }

  return from !== DEFAULT_RANGE.from || to !== DEFAULT_RANGE.to;
};

@Directive({
  selector: 'ng-template[upfFiltersActionButton]',
  standalone: true,
})
export class FiltersActionButtonDirective {}

@Component({
  selector: 'upf-filters-container',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, TranslateModule, LetDirective],
  templateUrl: './filters-container.component.html',
  styleUrls: ['./filters-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [GROW_VERTICAL()],
})
export class FiltersContainerComponent<T> implements AfterContentInit, AfterViewInit {
  @ContentChild(FormGroupDirective, { static: true })
  public formGroupDirective: FormGroupDirective;

  @ContentChild(FiltersActionButtonDirective, { read: TemplateRef })
  public actionButton: TemplateRef<unknown> | undefined;

  @Input() public isOpened = true;
  @Input() public expandable = true;
  @Input() public direction: 'col' | 'row' = 'col';
  @Input() public debounceTime: number = DEBOUNCE_TIME_MS;
  @Input() public defaultFilters: T | undefined;
  @Input({ required: true }) public filterKey: StorageFiltersKey | string;
  @Input() public filterSubKey: string;

  @Output() public filtersReset = new EventEmitter<void>();
  @Output() public filtersChange = new EventEmitter<T>();
  @Output() public controlsChange = new EventEmitter<T[]>();

  public animationDisabled = true;
  public changedControls = new Set<string>();
  public appliedFiltersLength$ = new BehaviorSubject<number>(0);
  public fleet$: Observable<FleetDto> = this.store.select(getSelectedFleet).pipe(
    filter(Boolean),
    pairwise(),
    filter(([prev, current]) => prev.id !== current.id),
    map(([_, current]) => current),
    tap(() => this.handleReset()),
  );

  private initialValue: T;
  private readonly previousValue = signal<Filters>(null);
  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly store: Store<AccountState>,
    private readonly storage: StorageService,
  ) {}

  private get filtersForm(): FormGroup {
    return this.formGroupDirective.form;
  }

  public ngAfterContentInit(): void {
    this.getSelectedFilters();
    this.handleControlsChange();
  }

  public ngAfterViewInit(): void {
    this.animationDisabled = false;
  }

  public handleReset(): void {
    this.filtersForm.reset(this.initialValue);
    this.changedControls.clear();
    this.appliedFiltersLength$.next(this.changedControls.size);

    let found: Record<string, unknown>;

    if (this.filterSubKey) {
      found = this.storage.get(this.filterKey) || {};
      found[this.filterSubKey] = this.initialValue;
    }

    this.storage.set(
      this.filterKey,
      this.filterSubKey ? found || { [this.filterSubKey]: this.initialValue } : this.initialValue,
    );
    this.filtersReset.emit();
  }

  private handleControlsChange(): void {
    this.initialValue = this.getInitialValue();

    this.filtersForm.valueChanges
      .pipe(
        startWith(this.filtersForm.value),
        debounceTime(this.debounceTime),
        filter(() => this.filtersForm.valid),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((value) => {
        this.countChangedFilters(value as Filters);
        this.filtersChange.emit(value);
        const filterValue: Record<string, string> = this.storage.get(this.filterKey);

        if (this.filterSubKey && filterValue) {
          filterValue[this.filterSubKey] = value;
        }

        this.storage.set(this.filterKey, this.filterSubKey ? filterValue || { [this.filterSubKey]: value } : value);
      });
  }

  private getSelectedFilters(): void {
    const filters: Record<string, unknown> = this.storage.get(this.filterKey);
    this.filtersForm.patchValue(filters?.[this.filterSubKey] || filters);
    this.previousValue.set(this.filtersForm.value as Filters);
  }

  private getInitialValue(): T {
    if (this.defaultFilters) return this.defaultFilters;

    const { from, to } = DEFAULT_RANGE;
    const filters = { ...(this.filtersForm.getRawValue() as Filters) };

    Object.keys(filters).forEach((key) => {
      const control = filters[key];

      if (Array.isArray(control)) {
        filters[key] = [];
      } else if (this.isDateControl(control)) {
        filters[key] = { from, to };
      } else {
        filters[key] = '';
      }
    });

    return filters as T;
  }

  private countChangedFilters(filters: Filters): void {
    const changedProps: Filters[] = [];

    Object.keys(filters).forEach((key) => {
      const control = filters[key];
      const initialControl = (this.initialValue as Filters)[key];
      const prevControl = this.previousValue()[key];

      let filterChanged: boolean;
      let propChanged: boolean;

      if (Array.isArray(control)) {
        filterChanged = arrayControlChanged(control, initialControl);
        propChanged = arrayControlChanged(control, prevControl);
      } else if (this.isDateControl(control)) {
        filterChanged = dateControlChanged(control);
        propChanged = dateControlChanged(control, prevControl as DateRangeDto);
      } else {
        filterChanged = control !== initialControl;
        propChanged = control !== prevControl;
      }

      filterChanged ? this.changedControls.add(key) : this.changedControls.delete(key);
      this.appliedFiltersLength$.next(this.changedControls.size);
      if (propChanged) changedProps.push({ [key]: filters[key] });
    });

    if (changedProps.length > 0) {
      this.controlsChange.emit(changedProps as T[]);
    }

    this.previousValue.set(filters);
  }

  private isDateControl(control: DateRangeDto | string): control is DateRangeDto {
    return (control as DateRangeDto)?.from !== undefined && (control as DateRangeDto)?.to !== undefined;
  }
}
