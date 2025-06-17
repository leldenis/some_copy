import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FleetMerchant, ReportByOrdersCollectionDto, ReportByOrdersDto } from '@data-access';
import { OrderReportsParamsDto } from '@ui/modules/orders/models/order-reports.dto';
import {
  ORDER_REPORT_ITEM_1_MOCK,
  REPORTS_ORDERS_COLLECTION_MOCK,
  ORDERS_REPORTS_REQUEST_MOCK,
} from '@ui/modules/orders/services/reports.mock';
import { ReportsService } from '@ui/modules/orders/services/reports.service';
import { DEFAULT_LIMIT } from '@ui/shared/consts';
import { take } from 'rxjs/operators';

import { Currency } from '@uklon/types';

describe('ReportsService', () => {
  let reportsService: ReportsService;
  let httpTesting: HttpTestingController;

  const fleetId = '2c854e0f-b08a-4447-9e2b-25b1a90f2f93';
  const query: OrderReportsParamsDto = {
    limit: DEFAULT_LIMIT,
    offset: 0,
    dateFrom: 1_704_060_000_000,
    dateTo: 1_711_918_799_000,
  };
  const url = `api/fleets/reports/${fleetId}/drivers-orders?limit=${query.limit}&offset=${query.offset}&dateFrom=1704060000&dateTo=1711918799`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    reportsService = TestBed.inject(ReportsService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('should be created', () => {
    expect(reportsService).toBeTruthy();
  });

  it('should get all order reports', (done) => {
    const testCase: ReportByOrdersCollectionDto = REPORTS_ORDERS_COLLECTION_MOCK;
    const expectedData: ReportByOrdersDto = ORDER_REPORT_ITEM_1_MOCK;

    reportsService
      .findAllOrders(fleetId, query)
      .pipe(take(1))
      .subscribe((data) => {
        expect(data.has_more_items).toBeTruthy();
        expect(data.items).toHaveLength(3);
        expect(data.items[0]).toEqual(expectedData);
        done();
      });

    const req = httpTesting.expectOne(url);

    expect(req.request.method).toBe('GET');
    req.flush({ ...testCase, has_more_items: true });
  });

  it('should load the all data', async () => {
    const mockItems = ORDERS_REPORTS_REQUEST_MOCK;
    const expectedItemsCount = 90;
    const offsetIncrement = 30;

    const mockFetchItems = async (
      offset: number,
      limit: number,
    ): Promise<{ has_more_items: boolean; items: ReportByOrdersDto[] }> => {
      return Promise.resolve({
        has_more_items: offset < mockItems.items.length - limit,
        items: mockItems.items.slice(offset, offset + limit),
      });
    };

    let offset = 0;
    let receivedItemsCount = 0;

    while (receivedItemsCount < expectedItemsCount) {
      // eslint-disable-next-line no-await-in-loop
      const response = await mockFetchItems(offset, DEFAULT_LIMIT);

      receivedItemsCount += response.items.length;

      expect(receivedItemsCount).toBeLessThanOrEqual(expectedItemsCount);

      offset += offsetIncrement;

      if (response.has_more_items) {
        expect(response.items.length).toBe(DEFAULT_LIMIT);
        expect(offset).toBeLessThan(expectedItemsCount);
      } else {
        expect(receivedItemsCount).toBe(expectedItemsCount);
        expect(response.has_more_items).toBeFalsy();
        expect(response.items.length).toBeLessThanOrEqual(offset + DEFAULT_LIMIT);
      }
    }
  });

  it('should be correct split payments of entrepreneurs', (done) => {
    const testCase: ReportByOrdersCollectionDto = REPORTS_ORDERS_COLLECTION_MOCK;

    reportsService
      .findAllOrders(fleetId, query)
      .pipe(take(1))
      .subscribe((data) => {
        const { grouped_splits } = data.items[0];

        const entrepreneurs = Object.keys(grouped_splits);
        entrepreneurs.forEach((entrepreneur) => {
          const split = grouped_splits[entrepreneur];
          if (split) {
            const fondy = split[0];
            const iPay = split[1];
            const platon = split[2];

            expect(fondy.payment_provider).toEqual(FleetMerchant.FONDY);
            expect(iPay.payment_provider).toEqual(FleetMerchant.IPAY);
            expect(platon.payment_provider).toEqual(FleetMerchant.PLATON);

            expect(typeof fondy.merchant_id).toBe('string');
            expect(fondy.total.amount).toBeGreaterThan(0);
            expect(fondy.total.currency).toBe(Currency.UAH);
          }
        });

        done();
      });

    const req = httpTesting.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(testCase);
  });

  it('should get empty response', (done) => {
    const testCase: ReportByOrdersCollectionDto = { has_more_items: false, items: [] };

    reportsService
      .findAllOrders(fleetId, query)
      .pipe(take(1))
      .subscribe((data) => {
        expect(data.has_more_items).toBeFalsy();
        expect(data.items).toHaveLength(0);
        done();
      });

    httpTesting.expectOne(url).flush(testCase);
  });
});
