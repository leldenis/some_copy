import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  FleetMerchant,
  FleetOrderRecordDto,
  FleetOrderRecordCollectionDto,
  FleetOrderRecordCollectionQueryDto,
} from '@data-access';
import { ORDERS_TRIP_ITEM_1_MOCK, ORDERS_TRIPS_COLLECTION_MOCK } from '@ui/modules/orders/services/orders.mock';
import { OrdersService } from '@ui/modules/orders/services/orders.service';
import { DEFAULT_LIMIT } from '@ui/shared/consts';
import { take } from 'rxjs/operators';

import { Currency } from '@uklon/types';

describe('OrdersService', () => {
  let ordersService: OrdersService;
  let httpTesting: HttpTestingController;

  const query: Partial<FleetOrderRecordCollectionQueryDto> = {
    limit: DEFAULT_LIMIT,
    cursor: 53_636,
    from: 1_704_060_000_000,
    to: 1_711_918_799_000,
    fleetId: '2c854e0f-b08a-4447-9e2b-25b1a90f2f93',
  };
  const url = `/api/fleets/orders?limit=${query.limit}&cursor=${query.cursor}&from=${query.from}&to=${query.to}&fleetId=${query.fleetId}`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    ordersService = TestBed.inject(OrdersService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('should be created', () => {
    expect(ordersService).toBeTruthy();
  });

  it('should get all orders trips', (done) => {
    const testCase: FleetOrderRecordCollectionDto = ORDERS_TRIPS_COLLECTION_MOCK;
    const expectedData: FleetOrderRecordDto = ORDERS_TRIP_ITEM_1_MOCK;

    ordersService
      .getFleetOrders(query)
      .pipe(take(1))
      .subscribe((data: FleetOrderRecordCollectionDto) => {
        expect(data.cursor).toBeGreaterThanOrEqual(0);
        expect(data.items).toHaveLength(3);
        expect(data.items[0]).toEqual(expectedData);
        done();
      });

    const req = httpTesting.expectOne(url);

    expect(req.request.method).toBe('GET');
    req.flush({ ...testCase });
  });

  it('should be correct split payments of entrepreneurs', (done) => {
    const testCase: FleetOrderRecordCollectionDto = ORDERS_TRIPS_COLLECTION_MOCK;

    ordersService
      .getFleetOrders(query)
      .pipe(take(1))
      .subscribe((data: FleetOrderRecordCollectionDto) => {
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
    const testCase: FleetOrderRecordCollectionDto = { items: [], cursor: 0 };

    ordersService
      .getFleetOrders(query)
      .pipe(take(1))
      .subscribe((data: FleetOrderRecordCollectionDto) => {
        expect(data.items).toHaveLength(0);
        expect(data.cursor).toEqual(0);
        done();
      });

    httpTesting.expectOne(url).flush(testCase);
  });
});
