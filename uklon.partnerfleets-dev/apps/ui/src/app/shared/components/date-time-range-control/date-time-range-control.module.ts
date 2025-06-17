import { NgModule } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { LuxonDateAdapter, MAT_LUXON_DATE_ADAPTER_OPTIONS } from '@angular/material-luxon-adapter';

export const CUSTOM_FORMATS = {
  parse: {
    dateInput: 'dd.MM.yyyy',
  },
  display: {
    dateInput: 'dd.MM.yyyy',
    monthYearLabel: 'LLL yyyy',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'LLL yyyy',
  },
};

@NgModule({
  providers: [
    {
      provide: DateAdapter,
      useClass: LuxonDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_LUXON_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_FORMATS },
  ],
})
export class DateTimeRangeControlModule {}
