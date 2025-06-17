import { TitleCasePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { OrderStatus } from '@constant';
import { FleetOrderRecordDto, FleetOrderRecordCollectionQueryDto } from '@data-access';
import { ToastService } from '@ui/core/services/toast.service';
import { getMerchants, getMerchantsIncome } from '@ui/modules/orders/constants';
import { OrdersService } from '@ui/modules/orders/services/orders.service';
import { CSVFileCreatorService, CSVFileRef } from '@ui/shared';
import { CURRENCY_INTL } from '@ui/shared/consts';
import { CSVFileLoadingService, CSVFileType } from '@ui/shared/services/csv-file-loading.service';
import { normalizeString } from '@ui/shared/utils/normalize-string';
import moment from 'moment';
import { Observable, of, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';

import { toServerDate } from '@uklon/angular-core';

@Injectable({ providedIn: 'root' })
export class OrdersExporterService extends CSVFileCreatorService {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly toastService: ToastService,
    private readonly csvFileLoadingService: CSVFileLoadingService,
    private readonly titleCasePipe: TitleCasePipe,
  ) {
    super();
  }

  public exportCsv(query: FleetOrderRecordCollectionQueryDto, limit: number): void {
    this.csvFileLoadingService.startLoading(CSVFileType.TRIPS);
    const csvReport = this.getAllOrders(-1, limit, [], query).pipe(map((items) => this.convertToCSV(items)));
    const fileName = `${this.translateService.instant('Orders.Tabs.Trips')} - ${moment(new Date(query.from)).format(
      'HH.mm DD.MM.yy',
    )} - ${moment(new Date(query.to)).format('HH.mm DD.MM.yy')}.csv`;
    const csvRef = new CSVFileRef(csvReport, fileName, (fileData: string) => this.downloadFile(fileName, fileData));

    csvRef.hasError().subscribe(() => {
      this.toastService.error('VehicleOrderReportList.Csv.Notification.Error');
      this.csvFileLoadingService.finishLoading(CSVFileType.TRIPS);
    });
    csvRef.isSuccessful().subscribe((filename) => {
      this.toastService.success('VehicleOrderReportList.Csv.Notification.Success', { filename });
      this.csvFileLoadingService.finishLoading(CSVFileType.TRIPS);
    });
    csvRef.download();
  }

  public convertToCSV(reports: FleetOrderRecordDto[]): string {
    const merchants = getMerchants(reports);

    return [
      this.createHeaderRow(this.getCurrency(reports[0]), merchants),
      ...reports.map((item) => this.createVehicleRow(item, merchants)),
    ]
      .map((items) => this.toCsvRow(items))
      .join('');
  }

  private createHeaderRow(currency: string, merchants: string[]): string[] {
    return [
      this.translateService.instant('Orders.Csv.ColumnName.Driver'),
      this.translateService.instant('VehicleOrderReportList.Csv.Header.Row.LicensePlate'),
      this.translateService.instant('Orders.Trips.List.PickUp'),
      this.translateService.instant('Orders.Trips.List.Route'),
      `${this.translateService.instant('VehicleOrderReportList.Details.AdditionalIncome.Promo')}, ${currency}`,
      `${this.translateService.instant('VehicleOrderReportList.Details.AdditionalIncome.Idle')}, ${currency}`,
      `${this.translateService.instant('VehicleOrderReportList.Details.AdditionalIncome.Compensation')}, ${currency}`,
      this.translateService.instant('Orders.Csv.ColumnName.Tips', { currency }),
      this.translateService.instant('Orders.Csv.ColumnName.Fine', { currency }),
      ...merchants.flatMap((merchant) => [
        `${this.translateService.instant('Orders.Trips.List.Merchant')} ${merchant}, ${currency}`,
        `${this.translateService.instant('Orders.Trips.List.Commission')} ${merchant}, ${currency}`,
      ]),
      `${this.translateService.instant('Orders.Trips.List.Merchant')}, ${currency}`,
      `${this.translateService.instant('Orders.Trips.List.OrderCost')}, ${currency}`,
      `${this.translateService.instant('Orders.Trips.List.Distance')}, ${this.translateService.instant('Common.Km')}`,
      this.translateService.instant('Orders.Trips.List.PaymentType'),
      this.translateService.instant('Orders.Trips.List.ProductType'),
      this.translateService.instant('Orders.Trips.List.Status'),
    ];
  }

  private createVehicleRow(order: FleetOrderRecordDto, merchants: string[]): string[] {
    const canceled = order.status === OrderStatus.CANCELED;
    const feeType = this.titleCasePipe.transform(order.payment.feeType);

    const merchantsIncome = getMerchantsIncome(order.grouped_splits, merchants).map((amount) =>
      amount ? this.getMoneyFormatValue(amount) : '',
    );

    return [
      order.driver.fullName,
      order.vehicle.licencePlate,
      `${moment(order.pickupTime * 1000).format('DD.MM.yyyy HH:mm')}`,
      order.route.points.map(({ address }) => address).join(' → '),
      this.getMoneyFormatValue(order.additionalIncome?.promo?.amount),
      this.getMoneyFormatValue(order.additionalIncome?.idle?.amount),
      this.getMoneyFormatValue(order.additionalIncome?.compensation?.amount),
      this.getMoneyFormatValue(order.additionalIncome?.tips?.amount),
      this.getMoneyFormatValue(order.additionalIncome?.penalty?.amount),
      ...merchantsIncome,
      this.getMoneyFormatValue(order.merchantIncome?.amount),
      canceled ? '' : this.getMoneyFormatValue(order.payment.cost * 100),
      canceled ? '' : `${order.payment.distance}`,
      canceled ? '' : this.translateService.instant(`Orders.Trips.List.Tooltip.${feeType}`),
      this.translateService.instant(`Common.ProductTypes.${normalizeString(order.vehicle.productType)}`),
      this.translateService.instant(`Orders.Trips.Filter.OrderStatus.${order.status}`),
    ];
  }

  private getCurrency(order: FleetOrderRecordDto): string {
    return order?.payment.currency ? this.translateService.instant(CURRENCY_INTL.get(order.payment.currency)) : '';
  }

  private getAllOrders(
    next_cursor: number,
    limit: number,
    orders: FleetOrderRecordDto[],
    query: FleetOrderRecordCollectionQueryDto,
  ): Observable<FleetOrderRecordDto[]> {
    const { from, to, ...rest } = query;
    const params = {
      from: toServerDate(new Date(from)),
      to: toServerDate(new Date(to)),
      ...rest,
      cursor: next_cursor,
    };

    return this.ordersService.getFleetOrders(params).pipe(
      switchMap(({ cursor, items }) => {
        return `${next_cursor}`.startsWith('0')
          ? of([...orders, ...items])
          : this.getAllOrders(Number(cursor), limit, [...orders, ...items], query);
      }),
    );
  }
}
