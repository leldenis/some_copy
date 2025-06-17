import { formatNumber } from '@angular/common';
import { Injectable } from '@angular/core';
import {
  BrandingBonusCalculationsProgramOldDto,
  BrandingBonusProgramsOldDto,
  BrandingBonusSpecOldDto,
  RangeItemsDto,
} from '@data-access';
import { CSVFileCreatorService } from '@ui/shared';
import { CURRENCY_INTL } from '@ui/shared/consts';
import moment from 'moment/moment';

@Injectable()
export class BonusExportOldService extends CSVFileCreatorService {
  public getFilename(): string {
    return `${this.translateService.instant('Bonuses.CSV.Filename', { today: moment(new Date()).format('DD.MM.yy') })}.csv`;
  }

  public convertToCsv(
    items: BrandingBonusProgramsOldDto[],
    program: BrandingBonusCalculationsProgramOldDto,
    period: RangeItemsDto,
  ): string {
    const currency = program?.specification?.currency
      ? this.translateService.instant(CURRENCY_INTL.get(program.specification.currency))
      : '';

    return [this.createHeaderRow(currency), ...items.map((item) => this.createRow(item, program, period, currency))]
      .map((allItems) => this.toCsvRow(allItems))
      .join('');
  }

  private createHeaderRow(currency: string): string[] {
    return [
      this.translateService.instant('Bonuses.CSV.HeaderRow.LicencePlate'),
      this.translateService.instant('Bonuses.CSV.HeaderRow.Car'),
      this.translateService.instant('Bonuses.CSV.HeaderRow.CancellationPercentage'),
      this.translateService.instant('Bonuses.CSV.HeaderRow.OrdersCompleted'),
      `${this.translateService.instant('Bonuses.CSV.HeaderRow.GuaranteedEarnings')}, ${currency}`,
      this.translateService.instant('Bonuses.CSV.HeaderRow.DriverOnCar'),
      this.translateService.instant('Bonuses.CSV.HeaderRow.ProgramRequirements'),
    ];
  }

  private createRow(
    item: BrandingBonusProgramsOldDto,
    program: BrandingBonusCalculationsProgramOldDto,
    period: RangeItemsDto,
    currency: string,
  ): string[] {
    const completedCount = program.specification.orders.completed.count.length - 1 || 0;
    const totalOrders = program.specification.orders.completed.count[completedCount]?.range[0];

    return [
      item.vehicle?.license_plate,
      item.vehicle ? `${item.vehicle?.make} ${item.vehicle?.model}` : '',
      item?.calculation_source?.orders?.cancellation_percentage > 0
        ? `${formatNumber(item.calculation_source.orders.cancellation_percentage, this.localeId, '1.2-2')}%`
        : '',
      item?.calculation_source ? `${item.calculation_source.orders.completed} / ${totalOrders}` : '',
      item.bonus ? `${this.getMoneyFormatValue(item.bonus.value * 100)}` : '',
      item?.driver ? `${item.driver?.first_name} ${item.driver?.last_name}` : '',
      this.getProgramRulesColumn(program.specification, period, currency),
    ];
  }

  private getProgramRulesColumn(
    specification: BrandingBonusSpecOldDto,
    period: RangeItemsDto,
    currency: string,
  ): string {
    const rating = this.translateService.instant('Bonuses.CSV.Row.Program.Rating', {
      value: specification?.rating?.last[0]?.range[0],
    });

    const percent = this.translateService.instant('Bonuses.CSV.Row.Program.CancellationPercentage', {
      0: `${formatNumber(specification.orders.cancelled.percent?.[0]?.range?.[1], this.localeId, '1.1-1')}%`,
    });

    const maximum = this.translateService.instant('Bonuses.CSV.Row.Program.Maximum', {
      value: specification?.orders?.completed.count[specification.orders.completed.count.length - 1]?.value,
      currency,
    });

    const programPeriod = this.translateService.instant('Bonuses.CSV.Row.Program.Period', {
      from: period.range ? this.parseDate(period.range[0]) : '',
      to: period.range ? this.parseDate(period.range[1]) : '',
    });

    const days = this.translateService.instant('Bonuses.CSV.Row.Program.Days', {
      days: specification.days.map((day) => this.translateService.instant(`Common.DaysShort.${day}`)).join(', '),
    });

    return [rating, percent, maximum, programPeriod, days].join(',\n');
  }
}
