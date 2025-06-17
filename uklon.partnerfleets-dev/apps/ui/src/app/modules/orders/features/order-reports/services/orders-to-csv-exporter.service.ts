import { Injectable } from '@angular/core';
import { DriversOrdersReportDto, ReportByOrdersEmployeeDto } from '@data-access';
import { OrderReportsParamsDto } from '@ui/modules/orders/models/order-reports.dto';
import { ReportsService } from '@ui/modules/orders/services';
import { CSVFileCreatorService, CSVFileRef } from '@ui/shared';
import { CURRENCY_INTL, DEFAULT_LIMIT } from '@ui/shared/consts';
import { Observable, of } from 'rxjs';
import { filter, map, switchMap, tap, toArray } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class OrdersToCsvExporterService extends CSVFileCreatorService {
  private readonly limit = 30;
  private readonly merchants = new Set<string>();

  constructor(private readonly reportsService: ReportsService) {
    super();
  }

  public export(fleetId: string, queryParams: OrderReportsParamsDto): CSVFileRef {
    let localizedCurrency = '';
    const params = { ...queryParams, limit: this.limit };

    const csvReport = this.getAllOrdersItems(fleetId, params, []).pipe(
      filter((items) => items.length > 0),
      tap((orders) => {
        localizedCurrency = this.getCurrency(orders);
        orders.forEach((order) => {
          order?.split_payments?.forEach(({ payment_provider }) => this.merchants.add(payment_provider));
        });
      }),
      toArray(),
      map((ordersLists) => ordersLists.flat()),
      map((orders) => orders.map((order) => this.toCsvRow(this.createOrderRow(order)))),
      map((rows) => [this.toCsvRow(this.createHeaderRow(localizedCurrency)), ...rows]),
      map((rows) => rows.join('')),
    );

    const filename = this.createFilename(queryParams.dateFrom, queryParams.dateTo);
    return new CSVFileRef(csvReport, filename, (fileData: string) => this.downloadFile(filename, fileData));
  }

  private getCurrency(orders: DriversOrdersReportDto[]): string {
    const report: DriversOrdersReportDto = orders.find(({ profit }) => !!profit);
    return report?.currency ? this.translateService.instant(CURRENCY_INTL.get(report?.currency)) : '';
  }

  private getAllOrdersItems(
    fleetId: string,
    params: OrderReportsParamsDto,
    orders: DriversOrdersReportDto[],
    offset = 0,
  ): Observable<DriversOrdersReportDto[]> {
    const queryParams: OrderReportsParamsDto = {
      ...params,
      offset,
    };

    return this.reportsService.findAllOrders(fleetId, queryParams).pipe(
      switchMap(({ items, has_more_items }) => {
        return has_more_items
          ? this.getAllOrdersItems(fleetId, params, [...orders, ...items], offset + DEFAULT_LIMIT)
          : of([...orders, ...items]);
      }),
    );
  }

  private createHeaderRow(currency: string): string[] {
    return [
      this.translateService.instant('Orders.Csv.ColumnName.Driver'),
      this.translateService.instant('Orders.Csv.ColumnName.Signal'),
      this.translateService.instant('Orders.Csv.ColumnName.RidesCount'),
      this.translateService.instant('Orders.Csv.ColumnName.OnlineTime'),
      this.translateService.instant('Orders.Csv.ColumnName.TotalExecutingTime'),
      this.translateService.instant('Orders.Csv.ColumnName.RidesPerHour'),
      this.translateService.instant('Orders.Csv.ColumnName.Distance'),
      this.translateService.instant('Orders.Csv.ColumnName.PickUp'),
      this.translateService.instant('Orders.Csv.ColumnName.TotalProfit', { currency }),
      this.translateService.instant('Orders.Csv.ColumnName.Compensation', { currency }),
      this.translateService.instant('Orders.Csv.ColumnName.Bonus', { currency }),
      this.translateService.instant('Orders.Csv.ColumnName.Tips', { currency }),
      this.translateService.instant('Orders.Csv.ColumnName.Fine', { currency }),
      this.translateService.instant('Orders.Csv.ColumnName.Commission', { currency }),
      this.translateService.instant('Orders.Csv.ColumnName.AveragePricePerHour', { currency }),
      this.translateService.instant('Orders.Csv.ColumnName.AveragePricePerKm', { currency }),
      this.translateService.instant('Orders.Csv.ColumnName.Total', { currency }),
      this.translateService.instant('Orders.Csv.ColumnName.Cash', { currency }),
      this.translateService.instant('Orders.Csv.ColumnName.Card', { currency }),
      this.translateService.instant('Orders.Csv.ColumnName.Wallet', { currency }),
      ...[...this.merchants].flatMap((merchant) => [
        this.translateService.instant('Orders.Csv.ColumnName.Merchant', {
          merchant,
          currency,
        }),
        `${this.translateService.instant('Orders.Trips.List.Commission')} ${merchant}, ${currency}`,
      ]),
      this.translateService.instant('Orders.Csv.ColumnName.MerchantsTotal', { currency }),
      this.translateService.instant('Orders.Csv.ColumnName.Promotion.Support', { currency }),
      this.translateService.instant('Orders.Csv.ColumnName.Promotion.PassengerAbsence', { currency }),
      this.translateService.instant('Orders.Csv.ColumnName.BonusDetails.OrderBonus', { currency }),
      this.translateService.instant('Orders.Csv.ColumnName.BonusDetails.GuaranteedBonus', { currency }),
      this.translateService.instant('Orders.Csv.ColumnName.BonusDetails.WeekBonus', { currency }),
      this.translateService.instant('Orders.Csv.ColumnName.BonusDetails.IndividualBonus', { currency }),
      this.translateService.instant('Orders.Csv.ColumnName.BonusDetails.BrandingBonus', { currency }),
      this.translateService.instant('Orders.Csv.ColumnName.Refill.Self', { currency }),
      this.translateService.instant('Orders.Csv.ColumnName.Refill.Balance', { currency }),
      this.translateService.instant('Orders.Csv.ColumnName.CommissionDiscount', { currency }),
      this.translateService.instant('Orders.Csv.ColumnName.Activity.Chain'),
      this.translateService.instant('Orders.Csv.ColumnName.Activity.Passenger'),
      this.translateService.instant('Orders.Csv.ColumnName.Activity.Broadcast'),
      this.translateService.instant('Orders.Csv.ColumnName.Activity.Offer'),
    ];
  }

  private createOrderRow(order: DriversOrdersReportDto): string[] {
    return [
      this.formatDriverName(order.driver),
      `${order.driver.signal}`,
      `${order.total_orders_count || 0}`,
      this.formatDuration(order.online_time_seconds),
      this.formatDuration(order.total_executing_time + order.total_time_from_accepted_to_running),
      `${order.orders_per_hour || 0}`,
      this.getFormattedNumber(order.total_distance_meters),
      this.getFormattedNumber(order.total_distance_to_pickup_meters),
      this.getMoneyFormatValue(order.profit?.order?.amount),
      this.getMoneyFormatValue(order?.compensation?.total?.amount),
      this.getMoneyFormatValue(order?.bonuses?.total?.amount),
      this.getMoneyFormatValue(order?.tips?.amount),
      this.getMoneyFormatValue(order.penalties.amount),
      this.getMoneyFormatValue(order?.commission?.actual?.amount),
      this.getMoneyFormatValue(order?.average_order_price_per_hour?.amount),
      this.getMoneyFormatValue(order?.average_order_price_per_kilometer?.amount),
      this.getMoneyFormatValue(order.profit?.total?.amount),
      this.getMoneyFormatValue(order.profit?.cash?.amount),
      this.getMoneyFormatValue(order.profit?.card?.amount),
      this.getMoneyFormatValue(order.profit?.wallet?.amount),
      ...[...this.merchants]
        .map((merchant) => order?.split_payments?.find(({ payment_provider }) => payment_provider === merchant))
        .flatMap((merchant) => {
          return [
            merchant?.total?.amount ? this.getMoneyFormatValue(merchant.total.amount) : '',
            merchant?.fee?.amount ? this.getMoneyFormatValue(merchant.fee.amount) : '',
          ];
        }),
      this.getMoneyFormatValue(order.profit?.merchant?.amount),
      this.getMoneyFormatValue(order.compensation?.ticket.amount),
      this.getMoneyFormatValue(order.compensation?.absence?.amount),
      this.getMoneyFormatValue(order.bonuses.order.amount),
      this.getMoneyFormatValue(order.bonuses.guaranteed.amount),
      this.getMoneyFormatValue(order.bonuses.week.amount),
      this.getMoneyFormatValue(order.bonuses.individual.amount),
      this.getMoneyFormatValue(order.bonuses.branding.amount),
      this.getMoneyFormatValue(order.transfers.replenishment.amount),
      this.getMoneyFormatValue(order.transfers.from_balance.amount),
      this.getMoneyFormatValue(order.commission.actual.amount - (order.commission?.total.amount || 0)),
      this.formatDuration(order.chain_time_seconds),
      this.formatDuration(order.total_executing_time),
      this.formatDuration(order.broadcast_time_seconds),
      this.formatDuration(order.offer_time_seconds),
    ];
  }

  private formatDriverName(driver: ReportByOrdersEmployeeDto): string {
    if (driver.last_name && driver.first_name) {
      return `${driver.last_name} ${driver.first_name}`;
    }
    if (driver.last_name) {
      return driver.last_name;
    }
    if (driver.first_name) {
      return driver.first_name;
    }
    return '';
  }
}
