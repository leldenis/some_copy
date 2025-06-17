import { DatePipe, DOCUMENT, formatDate, formatNumber } from '@angular/common';
import { inject, LOCALE_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { transformFormatDuration } from '@ui/shared/utils/format-duration';

const CONVERT_PENNIES_TO_INTEGER = 100;
const CONVERT_TO_KM = 1000;

export abstract class CSVFileCreatorService {
  protected readonly document = inject(DOCUMENT);
  protected readonly localeId = inject(LOCALE_ID);
  protected readonly translateService = inject(TranslateService);
  protected readonly dateTimeFormat = 'HH.mm dd.MM.yy';
  protected readonly mimeType = 'data:text/csv;charset=utf-8';

  public createFilename(dateFrom: number, dateTo: number, fileNameKey = 'Orders.Csv.Filename'): string {
    const from = formatDate(dateFrom, this.dateTimeFormat, this.localeId);
    const to = formatDate(dateTo, this.dateTimeFormat, this.localeId);
    return `${this.translateService.instant(fileNameKey, { from, to })}.csv`;
  }

  public downloadFile(filename: string, csvData: string): void {
    const blob = new Blob([csvData], { type: this.mimeType });
    const link = this.document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', filename);
    link.click();
  }

  protected formatCol(column: string): string {
    let col = column.replace('"', '""');
    if (col.search(/,/g)) {
      col = `"${col}"`;
    }
    return col;
  }

  protected toCsvRow(value: string[]): string {
    return `${value.map((col) => this.formatCol(col)).join(',')}\r\n`;
  }

  protected getMoneyFormatValue(value: number, convertPenniesToInteger = true): string {
    let numberValue = value;

    if (convertPenniesToInteger) {
      numberValue = this.convertPenniesToInteger(numberValue);
    }
    return numberValue ? numberValue.toFixed(2) : '';
  }

  protected getFormattedNumber(value: number, convertToKilometers = true): string {
    let numberValue = value;

    if (convertToKilometers) {
      numberValue = this.convertMetersToKilometers(numberValue);
    }
    return numberValue ? formatNumber(numberValue, this.localeId, '.2-2') : '';
  }

  protected parseDate(ms: number): string {
    return new DatePipe(this.localeId).transform(ms * 1000, 'dd.MM.yyyy');
  }

  protected formatDuration(ms: number): string {
    const time = transformFormatDuration(ms);
    const hoursTranslation = time.hours
      ? this.translateService.instant('Common.Abbreviation.Hours', { hours: time.hours })
      : '';
    const minutesTranslation = this.translateService.instant('Common.Abbreviation.Minutes', {
      minutes: time.minutes,
    });

    return `${hoursTranslation} ${minutesTranslation}`;
  }

  private convertPenniesToInteger(value: number): number {
    return (value || 0) / CONVERT_PENNIES_TO_INTEGER;
  }

  private convertMetersToKilometers(meters: number): number {
    return (meters || 0) / CONVERT_TO_KM;
  }
}
