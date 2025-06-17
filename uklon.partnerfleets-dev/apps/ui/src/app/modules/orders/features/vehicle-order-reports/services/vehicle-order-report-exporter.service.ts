import { Injectable } from '@angular/core';
import { VehicleOrderReportItemDto } from '@data-access';
import { CSVFileCreatorService } from '@ui/shared';
import { CURRENCY_INTL } from '@ui/shared/consts';

const EMPTY_COLUMN = '';

@Injectable({ providedIn: 'root' })
export class VehicleOrderReportExporterService extends CSVFileCreatorService {
  public convertToCSV(reports: VehicleOrderReportItemDto[]): string {
    return [
      this.createHeaderGroupRow(),
      this.createHeaderRow(this.getCurrency(reports[0])),
      ...reports.map((item) => this.createVehicleRow(item)),
    ]
      .map((items) => this.toCsvRow(items))
      .join('');
  }

  private createHeaderGroupRow(): string[] {
    return [
      this.translateService.instant('VehicleOrderReportList.Csv.Header.GroupRow.VehicleInfo'),
      EMPTY_COLUMN,
      EMPTY_COLUMN,
      EMPTY_COLUMN,
      this.translateService.instant('VehicleOrderReportList.Csv.Header.GroupRow.Orders'),
      EMPTY_COLUMN,
      EMPTY_COLUMN,
      EMPTY_COLUMN,
      EMPTY_COLUMN,
      this.translateService.instant('VehicleOrderReportList.Csv.Header.GroupRow.AdditionalIncome'),
      EMPTY_COLUMN,
      EMPTY_COLUMN,
      this.translateService.instant('VehicleOrderReportList.Csv.Header.GroupRow.TotalEarning'),
      EMPTY_COLUMN,
      this.translateService.instant('VehicleOrderReportList.Csv.Header.GroupRow.AverageOrderCost'),
      EMPTY_COLUMN,
      EMPTY_COLUMN,
      EMPTY_COLUMN,
      this.translateService.instant('VehicleOrderReportList.Csv.Header.GroupRow.Expenses'),
      EMPTY_COLUMN,
      EMPTY_COLUMN,
      EMPTY_COLUMN,
    ];
  }

  private createHeaderRow(currency: string): string[] {
    return [
      this.translateService.instant('VehicleOrderReportList.Csv.Header.Row.LicensePlate'),
      this.translateService.instant('VehicleOrderReportList.Csv.Header.Row.Make'),
      this.translateService.instant('VehicleOrderReportList.Csv.Header.Row.Model'),
      this.translateService.instant('VehicleOrderReportList.Csv.Header.Row.BrandedAndPriority'),
      this.translateService.instant('VehicleOrderReportList.Csv.Header.Row.TotalOrdersCount'),
      this.translateService.instant('VehicleOrderReportList.Csv.Header.Row.OnlineTime'),
      this.translateService.instant('VehicleOrderReportList.Csv.Header.Row.TotalDistanceMeters', {
        km: this.translateService.instant('Common.Km'),
      }),
      this.translateService.instant('VehicleOrderReportList.Csv.Header.Row.GrossIncome', { currency }),
      this.translateService.instant('VehicleOrderReportList.Csv.Header.Row.ProfitAmount', { currency }),
      this.translateService.instant('VehicleOrderReportList.Csv.Header.Row.TotalCompensations', { currency }),
      this.translateService.instant('VehicleOrderReportList.Csv.Header.Row.TotalTips', { currency }),
      this.translateService.instant('VehicleOrderReportList.Csv.Header.Row.TotalBonus', { currency }),
      this.translateService.instant('VehicleOrderReportList.Csv.Header.Row.TotalCashEarnings', { currency }),
      this.translateService.instant('VehicleOrderReportList.Csv.Header.Row.TotalCashlessEarnings', { currency }),
      this.translateService.instant('VehicleOrderReportList.Csv.Header.Row.AverageOrderCost', { currency }),
      this.translateService.instant('VehicleOrderReportList.Csv.Header.Row.AverageCashlessOrderCost', { currency }),
      this.translateService.instant('VehicleOrderReportList.Csv.Header.Row.AverageCashOrderCost', { currency }),
      this.translateService.instant('VehicleOrderReportList.Csv.Header.Row.AveragePricePerKilometer', {
        km: this.translateService.instant('Common.Km'),
      }),
      this.translateService.instant('VehicleOrderReportList.Csv.Header.Row.TotalPenalties', { currency }),
      this.translateService.instant('VehicleOrderReportList.Csv.Header.Row.FeeAmount', { currency }),
      this.translateService.instant('VehicleOrderReportList.Csv.Header.Row.OrdersExecutionTime'),
      this.translateService.instant('VehicleOrderReportList.Csv.Header.Row.OrdersPerHour'),
    ];
  }

  private createVehicleRow(report: VehicleOrderReportItemDto): string[] {
    return [
      report.license_plate,
      report.make,
      report.model,
      this.brandedAndPriorityColumn(report),
      `${report.total_orders_count || 0}`,
      this.formatDuration(report.online_time_seconds),
      this.getFormattedNumber(report.total_distance_meters),
      this.getMoneyFormatValue(report.gross_income?.amount),
      this.getMoneyFormatValue(report.profit_amount?.amount),
      this.getMoneyFormatValue(report.total_compensations?.amount),
      this.getMoneyFormatValue(report.total_tips?.amount),
      this.getMoneyFormatValue(report.total_bonus?.amount),
      this.getMoneyFormatValue(report.total_cash_earnings?.amount),
      this.getMoneyFormatValue(report.total_cashless_earnings?.amount),
      this.getMoneyFormatValue(report.average_order_cost?.amount),
      this.getMoneyFormatValue(report.average_cashless_order_cost?.amount),
      this.getMoneyFormatValue(report.average_cash_order_cost?.amount),
      this.getMoneyFormatValue(report.average_price_per_kilometer?.amount),
      this.getMoneyFormatValue(report.total_penalties?.amount),
      this.getMoneyFormatValue(report.fee_amount?.amount),
      this.formatDuration(report.orders_execution_time_seconds),
      `${report.orders_per_hour || 0}`,
    ];
  }

  private brandedAndPriorityColumn(report: VehicleOrderReportItemDto): string {
    let value = '';

    if (report.is_branded && report.has_dispatching_priority) {
      value = this.translateService.instant(
        'VehicleOrderReportList.LicencePlace.Tooltip.BrandedWithPriority.Description',
        {
          days: report.branded_days,
          additionalDays: report.dispatching_priority_days,
        },
      );
    }

    if (report.is_branded && !report.has_dispatching_priority) {
      value = this.translateService.instant('VehicleOrderReportList.LicencePlace.Tooltip.Branded.Description', {
        days: report.branded_days,
      });
    }

    if (!report.is_branded && report.has_dispatching_priority) {
      value = this.translateService.instant('VehicleOrderReportList.LicencePlace.Tooltip.Priority.Description', {
        days: report.dispatching_priority_days,
      });
    }

    return value;
  }

  private getCurrency(report: VehicleOrderReportItemDto): string {
    return report.profit_amount?.currency
      ? this.translateService.instant(CURRENCY_INTL.get(report.profit_amount.currency))
      : '';
  }
}
