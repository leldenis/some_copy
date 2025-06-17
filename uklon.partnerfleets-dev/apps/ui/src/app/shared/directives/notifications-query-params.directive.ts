import { AfterViewInit, Directive, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { dateToRange } from '@data-access';
import { filter } from 'rxjs/operators';

const RANGE_PARAM = 'sentAt';

@Directive({
  selector: '[upfNotificationsQueryParams]',
  standalone: true,
})
export class NotificationsQueryParamsDirective implements AfterViewInit {
  private readonly formDirective = inject(FormGroupDirective);
  constructor(
    private readonly route: ActivatedRoute,
    private readonly destroyRef: DestroyRef,
  ) {}

  private get form(): FormGroup {
    return this.formDirective.form;
  }

  public ngAfterViewInit(): void {
    const keys = Object.keys(this.formDirective.form.value);
    let values: Record<string, unknown> = {};

    this.route.queryParams
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((params) => Object.keys(params).length > 0),
      )
      .subscribe((params) => {
        if (params[RANGE_PARAM]) {
          const period = dateToRange(params[RANGE_PARAM]);
          const control = this.getPeriodControl();
          if (control) values = { ...values, [control]: period };
        }

        keys.forEach((key) => {
          if (!this.form.get(key) || !params[key]) return;
          values = { ...values, [key]: params[key] };
        });

        this.form.patchValue(values);
        values = {};
      });
  }

  private getPeriodControl(): string | null {
    return Object.keys(this.form.value).find((key) => this.form.value[key]?.from && this.form.value[key]?.to) || null;
  }
}
