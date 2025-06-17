import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CASHIER_POSITIONS_MOCK } from '@api/controllers/fiscalization/mock/cashier-pos.mock';
import { FISCALIZATION_VEHICLES_COLLECTION_MOCK } from '@api/controllers/fiscalization/mock/fiscalization-vehicles.mock';
import {
  SIGNATURE_KEY_MOCK,
  SIGNATURE_KEYS_COLLECTION_MOCK,
} from '@api/controllers/fiscalization/mock/signature.keys.mock';
import {
  FiscalizationFarePaymentType,
  FiscalizationVatType,
  FleetCashPointDto,
  FleetFiscalizationSettingsDto,
} from '@data-access';
import { switchMap, take } from 'rxjs/operators';

import { uuidv4 } from '@uklon/angular-core';

import { FleetRROService } from './fleet-rro.service';

describe('FleetRRRService', () => {
  let service: FleetRROService;
  let httpMock: HttpTestingController;
  const fleetId = '2c854e0f-b08a-4447-9e2b-25b1a90f2f93';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(FleetRROService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterAll(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get fleet fiscalization settings', (done) => {
    const mockSettings: FleetFiscalizationSettingsDto = {
      vat_type: FiscalizationVatType.RATE_0,
      fare_payment_types: [FiscalizationFarePaymentType.CASH],
    };

    service
      .getFleetFiscalizationSetting(fleetId)
      .pipe(take(1))
      .subscribe((settings) => {
        expect(settings).toEqual(mockSettings);
        done();
      });

    const req = httpMock.expectOne(`api/fiscalization/${fleetId}/settings`);
    expect(req.request.method).toBe('GET');
    req.flush(mockSettings);
  });

  it('should update fleet fiscalization settings', (done) => {
    const mockSettings: FleetFiscalizationSettingsDto = {
      vat_type: FiscalizationVatType.RATE_20,
      fare_payment_types: [FiscalizationFarePaymentType.CASH, FiscalizationFarePaymentType.CASHLESS],
    };

    service
      .updateFleetFiscalizationSettings(fleetId, mockSettings)
      .pipe(take(1))
      .subscribe((response) => {
        expect(response).toBeNull();
        done();
      });

    const req = httpMock.expectOne(`api/fiscalization/${fleetId}/settings`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockSettings);
    req.flush(null);
  });

  it('should get, update and verify updated fiscalization settings', (done) => {
    const mockSettings: FleetFiscalizationSettingsDto = {
      vat_type: FiscalizationVatType.RATE_0,
      fare_payment_types: [FiscalizationFarePaymentType.CASH],
    };
    const updatedSettings: FleetFiscalizationSettingsDto = {
      vat_type: FiscalizationVatType.RATE_20,
      fare_payment_types: [FiscalizationFarePaymentType.CASH, FiscalizationFarePaymentType.CASHLESS],
    };

    service
      .getFleetFiscalizationSetting(fleetId)
      .pipe(
        take(1),
        switchMap((initialSettings) => {
          expect(initialSettings).toEqual(mockSettings);
          return service.updateFleetFiscalizationSettings(fleetId, updatedSettings);
        }),
        switchMap(() => service.getFleetFiscalizationSetting(fleetId)),
      )
      .subscribe((finalSettings) => {
        expect(finalSettings).toEqual(updatedSettings);
        done();
      });

    const getReq1 = httpMock.expectOne(`api/fiscalization/${fleetId}/settings`);
    expect(getReq1.request.method).toBe('GET');
    getReq1.flush(mockSettings);

    const updateReq = httpMock.expectOne(`api/fiscalization/${fleetId}/settings`);
    expect(updateReq.request.method).toBe('PUT');
    expect(updateReq.request.body).toEqual(updatedSettings);
    updateReq.flush(null);

    const getReq2 = httpMock.expectOne(`api/fiscalization/${fleetId}/settings`);
    expect(getReq2.request.method).toBe('GET');
    getReq2.flush(updatedSettings);
  });

  it('should get fleet signature keys', (done) => {
    const keysMock = SIGNATURE_KEYS_COLLECTION_MOCK;
    const publicKey = '645b6efebe4a27de4a5209ea6c30b9584884822936fe813f9b7ebe05834c62ad';
    const serial = '5E984D526F82F38F040000004F8DDC0013183405';
    service
      .getFleetSignatureKeys(fleetId)
      .pipe(take(1))
      .subscribe((response) => {
        expect(response).toEqual(keysMock);

        const item = response[0];

        expect(typeof item.status).toBe('boolean');
        expect(typeof item.created_at).toBe('number');
        expect(typeof item.updated_at).toBe('number');
        expect(typeof item.expiration_date).toBe('number');
        expect(typeof item.drfo).toBe('string');
        expect(typeof item.initiated_by).toBe('string');
        expect(typeof item.key_id).toBe('string');
        expect(typeof item.fleet_id).toBe('string');
        expect(item.public_key).toBe(publicKey);
        expect(item.serial).toBe(serial);
        done();
      });

    const req = httpMock.expectOne(`api/fiscalization/${fleetId}/signature-keys`);
    expect(req.request.method).toBe('GET');
    req.flush(keysMock);
  });

  it('should get fleet signature key', (done) => {
    const keyMock = SIGNATURE_KEY_MOCK;
    const keyId = '7bc931db-2b48-4481-95a8-a10cf2b31aba';
    const publicKey = '645b6efebe4a27de4a5209ea6c30b9584884822936fe813f9b7ebe05834c62ad';
    const serial = '5E984D526F82F38F040000004F8DDC0013183405';
    service
      .getSignatureKeyById(keyId)
      .pipe(take(1))
      .subscribe((response) => {
        expect(response).toEqual(keyMock);

        expect(typeof response.status).toBe('boolean');
        expect(typeof response.created_at).toBe('number');
        expect(typeof response.updated_at).toBe('number');
        expect(typeof response.expiration_date).toBe('number');
        expect(typeof response.drfo).toBe('string');
        expect(typeof response.initiated_by).toBe('string');
        expect(typeof response.fleet_id).toBe('string');
        expect(response.key_id).toBe(keyId);
        expect(response.public_key).toBe(publicKey);
        expect(response.serial).toBe(serial);
        done();
      });

    const req = httpMock.expectOne(`api/fiscalization/signature-keys/${keyId}`);
    expect(req.request.method).toBe('GET');
    req.flush(keyMock);
  });

  it('should get fleet cashiers positions', (done) => {
    const cashierId = '121213333';

    service
      .getFleetCashiersPos(fleetId, cashierId)
      .pipe(take(1))
      .subscribe((response) => {
        expect(response).toEqual(CASHIER_POSITIONS_MOCK);
        done();
      });

    const req = httpMock.expectOne(`api/fiscalization/${fleetId}/cashiers/${cashierId}/pos`);
    expect(req.request.method).toBe('GET');
    req.flush(CASHIER_POSITIONS_MOCK);
  });

  it('should link cashier to key', (done) => {
    const cashierId = '22223333';
    const body: FleetCashPointDto = {
      id: uuidv4(),
      name: 'Org name 1',
      organization_name: 'Org name 1',
      fiscal_number: 1_234_567_789,
    };
    service
      .linkCashierToKey(cashierId, body)
      .pipe(take(1))
      .subscribe((response) => {
        expect(response).toBeNull();
        done();
      });

    const req = httpMock.expectOne(`api/fiscalization/cashiers/${cashierId}/pos`);
    expect(req.request.method).toBe('POST');
    req.flush(null);
  });

  it('should return fleet vehicles with fiscalization data', (done) => {
    service
      .getFleetVehiclesFiscalization(fleetId, { licencePlate: '' })
      .pipe(take(1))
      .subscribe((response) => {
        expect(response).toEqual(FISCALIZATION_VEHICLES_COLLECTION_MOCK);
        done();
      });

    const req = httpMock.expectOne(`api/fiscalization/${fleetId}/vehicles?licencePlate=`);
    expect(req.request.method).toBe('GET');
    req.flush(FISCALIZATION_VEHICLES_COLLECTION_MOCK);
  });

  it('should return fleet points of sale', (done) => {
    service
      .getFleetPointsOfSale(fleetId)
      .pipe(take(1))
      .subscribe((response) => {
        expect(response).toEqual(CASHIER_POSITIONS_MOCK);
        done();
      });

    const req = httpMock.expectOne(`api/fiscalization/${fleetId}/points-of-sale`);
    expect(req.request.method).toBe('GET');
    req.flush(CASHIER_POSITIONS_MOCK);
  });
});
