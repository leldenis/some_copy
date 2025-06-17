import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  CollectionCursorDto,
  FleetHistoryChangeItemDto,
  FleetHistoryRequestParamsDto,
  FleetHistoryType,
  HistoryInitiatorType,
} from '@data-access';
import { FleetService } from '@ui/core';
import {
  FLEET_HISTORY_MOCK,
  HISTORY_ADDITIONAL_INFO_B2B_SPLIT_ADJUSTMENT_MOCK,
  HISTORY_ADDITIONAL_INFO_B2B_SPLIT_DISTRIBUTION_MOCK,
} from '@ui/core/services/datasource/fleet.service.mock';
import { take } from 'rxjs';

describe('FleetService', () => {
  let fleetService: FleetService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    fleetService = TestBed.inject(FleetService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('should be created', () => {
    expect(fleetService).toBeTruthy();
  });

  describe('should get all history items', () => {
    let responseItems: FleetHistoryChangeItemDto[];

    beforeAll((done) => {
      const fleetId = '2c854e0f-b08a-4447-9e2b-25b1a90f2f93';
      const queryParams: FleetHistoryRequestParamsDto = {
        limit: 30,
        cursor: 0,
        changeType: '',
      };
      const MOCK_RESPONSE: CollectionCursorDto<FleetHistoryChangeItemDto> = FLEET_HISTORY_MOCK;

      fleetService
        .getFleetHistory(fleetId, queryParams)
        .pipe(take(1))
        .subscribe((response) => {
          expect(response).toEqual(MOCK_RESPONSE);
          responseItems = response.items;
          done();
        });

      const req = httpTesting.expectOne(`api/fleets/${fleetId}/history?limit=30&cursor=0&changeType=`);
      expect(req.request.method).toBe('GET');
      req.flush(MOCK_RESPONSE);
    });

    afterAll(() => httpTesting.verify());

    it('should have next properties each history item', () => {
      const historyTypeEnumValues = Object.values(FleetHistoryType);
      const initiatorTypeEnumValues = Object.values(HistoryInitiatorType);
      responseItems.forEach((item) => {
        expect(historyTypeEnumValues).toContain(item.change_type);
        expect(typeof item.id).toBe('string');
        expect(typeof item.occurred_at).toBe('number');
        expect(typeof item.has_additional_data).toBe('boolean');
        expect(typeof item.initiator.account_id).toBe('string');
        expect(typeof item.initiator.display_name).toBe('string');
        expect(initiatorTypeEnumValues).toContain(item.initiator.type);
      });
    });

    it('should have additional data as false for type COMMERCIAL_CREATED', () => {
      const historyItem = responseItems.find((item) => item.change_type === FleetHistoryType.COMMERCIAL_CREATED);
      expect(historyItem.has_additional_data).toBeFalsy();
    });

    it('should have all change types', () => {
      const expectedChangeTypes = [
        FleetHistoryType.VEHICLE_REGISTERED,
        FleetHistoryType.OWNER_DELETED,
        FleetHistoryType.DRIVER_REMOVED,
        FleetHistoryType.PROFILE_CHANGED,
        FleetHistoryType.DRIVER_ADDED,
        FleetHistoryType.VEHICLE_REMOVED,
        FleetHistoryType.VEHICLE_ADDED,
        FleetHistoryType.DRIVER_REGISTERED,
        FleetHistoryType.COMMERCIAL_CREATED,
        FleetHistoryType.MANAGER_ADDED,
        FleetHistoryType.WITHDRAWAL_TYPE_CHANGED,
        FleetHistoryType.INDIVIDUAL_ENTREPRENEUR_UPDATED,
        FleetHistoryType.INDIVIDUAL_ENTREPRENEUR_SELECTED,
        FleetHistoryType.B2B_SPLIT_ADJUSTMENT_CHANGED,
        FleetHistoryType.B2B_SPLIT_DISTRIBUTION_CHANGED,
      ];
      const responseTypes = responseItems.map((item) => item.change_type);
      expectedChangeTypes.forEach((item) => {
        expect(responseTypes).toContain(item);
      });
    });
  });

  describe('should get additional info by type B2BSplitAdjustmentChanged', () => {
    let responseItem: FleetHistoryChangeItemDto;

    beforeAll((done) => {
      const params = {
        fleetId: '2c854e0f-b08a-4447-9e2b-25b1a90f2f93',
        changeType: FleetHistoryType.B2B_SPLIT_ADJUSTMENT_CHANGED,
        changeId: '5beedb2d-b1b7-49aa-8ee9-71a9e405e605',
      };
      const MOCK_RESPONSE: FleetHistoryChangeItemDto = HISTORY_ADDITIONAL_INFO_B2B_SPLIT_ADJUSTMENT_MOCK;

      fleetService
        .getFleetHistoryAdditionalInfo(params.fleetId, FleetHistoryType.B2B_SPLIT_ADJUSTMENT_CHANGED, params.changeId)
        .pipe(take(1))
        .subscribe((response) => {
          expect(response).toEqual(HISTORY_ADDITIONAL_INFO_B2B_SPLIT_ADJUSTMENT_MOCK);
          responseItem = response;
          done();
        });

      const req = httpTesting.expectOne(`api/fleets/${params.fleetId}/history/${params.changeType}/${params.changeId}`);
      expect(req.request.method).toBe('GET');
      req.flush(MOCK_RESPONSE);
    });

    afterAll(() => httpTesting.verify());

    it('should have b2b split adjustment response', () => {
      expect(typeof responseItem.id).toBe('string');
      expect(responseItem.change_type).toBe(FleetHistoryType.B2B_SPLIT_ADJUSTMENT_CHANGED);
      expect(typeof responseItem.occurred_at).toBe('number');
      expect(typeof responseItem.initiator.account_id).toBe('string');
      expect(typeof responseItem.initiator.display_name).toBe('string');
      expect(responseItem.initiator.type).toBe(HistoryInitiatorType.UKLON_MANAGER);
      expect(responseItem.details['old_value']).toEqual('TimeRange');
      expect(responseItem.details['current_value']).toEqual('PerSplit');
      expect(responseItem.details['update_type']).toEqual('Changed');
    });
  });

  describe('should get additional info by type B2BSplitDistributionChanged', () => {
    let responseItem: FleetHistoryChangeItemDto;

    beforeAll((done) => {
      const params = {
        fleetId: '2c854e0f-b08a-4447-9e2b-25b1a90f2f93',
        changeType: FleetHistoryType.B2B_SPLIT_DISTRIBUTION_CHANGED,
        changeId: '5beedb2d-b1b7-49aa-8ee9-71a9e405e605',
      };
      const MOCK_RESPONSE: FleetHistoryChangeItemDto = HISTORY_ADDITIONAL_INFO_B2B_SPLIT_DISTRIBUTION_MOCK;

      fleetService
        .getFleetHistoryAdditionalInfo(params.fleetId, FleetHistoryType.B2B_SPLIT_DISTRIBUTION_CHANGED, params.changeId)
        .pipe(take(1))
        .subscribe((response) => {
          expect(response).toEqual(HISTORY_ADDITIONAL_INFO_B2B_SPLIT_DISTRIBUTION_MOCK);
          responseItem = response;
          done();
        });

      const req = httpTesting.expectOne(`api/fleets/${params.fleetId}/history/${params.changeType}/${params.changeId}`);
      expect(req.request.method).toBe('GET');
      req.flush(MOCK_RESPONSE);
    });

    afterAll(() => httpTesting.verify());

    it('should have b2b split distribution response', () => {
      expect(typeof responseItem.id).toBe('string');
      expect(responseItem.change_type).toBe(FleetHistoryType.B2B_SPLIT_DISTRIBUTION_CHANGED);
      expect(typeof responseItem.occurred_at).toBe('number');
      expect(typeof responseItem.initiator.account_id).toBe('string');
      expect(typeof responseItem.initiator.display_name).toBe('string');
      expect(responseItem.initiator.type).toBe(HistoryInitiatorType.UKLON_MANAGER);
      expect(responseItem.details['old_value']).toEqual('ProportionalToCommission');
      expect(responseItem.details['current_value']).toEqual('BalanceDependent');
      expect(responseItem.details['update_type']).toEqual('Changed');
    });
  });
});
