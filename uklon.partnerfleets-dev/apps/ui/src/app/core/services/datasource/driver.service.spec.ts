import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DateFilterDto, FleetMerchant, StatisticDetailsDto } from '@data-access';
import { DriverService } from '@ui/core';
import { DRIVER_STATISTIC_MOCK } from '@ui/core/services/datasource/driver.mock';
import { take } from 'rxjs/operators';

import { Currency } from '@uklon/types';

describe('DriverService', () => {
  let driverService: DriverService;
  let httpTesting: HttpTestingController;

  const fleetId = '2c854e0f-b08a-4447-9e2b-25b1a90f2f93';
  const driverId = 'b8fea45d-55cf-4cfa-889c-42fb4152421e';
  const query: DateFilterDto = {
    date_from: 1_704_060_000_000,
    date_to: 1_711_918_799_999,
  };
  const url = `api/fleets/${fleetId}/drivers/${driverId}/statistic?date_from=${query.date_from}&date_to=${query.date_to}`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    driverService = TestBed.inject(DriverService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('should be created', () => {
    expect(driverService).toBeTruthy();
  });

  it('should be correct split payments of entrepreneurs', (done) => {
    const testCase: StatisticDetailsDto = DRIVER_STATISTIC_MOCK;

    driverService
      .getFleetDriverStatistics(fleetId, driverId, query)
      .pipe(take(1))
      .subscribe((data: StatisticDetailsDto) => {
        const entrepreneurs = Object.keys(data.grouped_splits);
        entrepreneurs.forEach((entrepreneur) => {
          const split = data.grouped_splits[entrepreneur];
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
    req.flush({ ...testCase });
  });

  describe('should be correct statistic data', () => {
    const testCase: StatisticDetailsDto = DRIVER_STATISTIC_MOCK;

    let response: StatisticDetailsDto;

    beforeEach((done) => {
      driverService
        .getFleetDriverStatistics(fleetId, driverId, query)
        .pipe(take(1))
        .subscribe((data: StatisticDetailsDto) => {
          response = data;
          done();
        });

      const req = httpTesting.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush({ ...testCase });
    });

    it('should be correct total earning data', () => {
      expect(typeof response.earnings_for_period.amount).toBe('number');
      expect(typeof response.profit.order.total.amount).toBe('number');
    });

    it('should be correct driver info', () => {
      expect(response.rating).toBeLessThanOrEqual(5);
      expect(typeof response.cancellation_percentage).toBe('number');
      expect(response.completed_orders).toBeGreaterThanOrEqual(0);
      expect(response.average_price_per_kilometer?.amount).toBeGreaterThanOrEqual(0);
      expect(response.total_distance_meters).toBeGreaterThanOrEqual(0);
      expect(response.total_executing_time).toBeGreaterThanOrEqual(0);
    });

    it('should be correct order data', () => {
      expect(response.profit.order.cash.amount).toBeGreaterThanOrEqual(0);
      expect(response.profit.order.card.amount).toBeGreaterThanOrEqual(0);
      expect(response.profit.order.wallet.amount).toBeGreaterThanOrEqual(0);
      expect(response.profit.order.merchant.amount).toBeGreaterThanOrEqual(0);
    });

    it('should be correct fines data', () => {
      expect(typeof response.loss?.total?.amount).toBe('number');
      expect(response.profit.commission_programs_profit?.amount).toBeGreaterThanOrEqual(0);
      expect(response.profit.commission_programs_profit?.currency).toBe(Currency.UAH);
    });

    it('should be correct additional earns data', () => {
      expect(response.profit.tips.amount).toBeGreaterThanOrEqual(0);
      expect(response.profit.bonus.amount).toBeGreaterThanOrEqual(0);
      expect(response.profit.compensation.amount).toBeGreaterThanOrEqual(0);
    });

    it('should get currency', () => {
      expect(response.earnings_for_period.currency).toBe(Currency.UAH);
      expect(response.profit.order.total.currency).toBe(Currency.UAH);
      expect(response.average_price_per_kilometer?.currency).toBe(Currency.UAH);
      expect(response.profit.order.cash.currency).toBe(Currency.UAH);
      expect(response.profit.order.card.currency).toBe(Currency.UAH);
      expect(response.profit.order.wallet.currency).toBe(Currency.UAH);
      expect(response.profit.order.merchant.currency).toBe(Currency.UAH);
      expect(response.loss.total.currency).toBe(Currency.UAH);
      expect(response.profit.tips.currency).toBe(Currency.UAH);
      expect(response.profit.bonus.currency).toBe(Currency.UAH);
      expect(response.profit.compensation.currency).toBe(Currency.UAH);
    });
  });
});
