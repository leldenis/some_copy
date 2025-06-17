import { TestBed } from '@angular/core/testing';
import { CSVFileLoadingService, CSVFileType } from '@ui/shared/services/csv-file-loading.service';
import { combineLatest, take } from 'rxjs';

describe('CSVFileLoadingService', () => {
  let service: CSVFileLoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CSVFileLoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start loading', (done) => {
    service.startLoading(CSVFileType.DRIVERS_REPORTS);
    service
      .isLoading$(CSVFileType.DRIVERS_REPORTS)
      .pipe(take(1))
      .subscribe((isLoading) => {
        expect(isLoading).toBe(true);
        done();
      });
  });

  it('should finish loading', (done) => {
    service.startLoading(CSVFileType.DRIVERS_REPORTS);
    service.finishLoading(CSVFileType.DRIVERS_REPORTS);
    service
      .isLoading$(CSVFileType.DRIVERS_REPORTS)
      .pipe(take(1))
      .subscribe((isLoading) => {
        expect(isLoading).toBe(false);
        done();
      });
  });

  describe('independent loading states', () => {
    it('should maintain independent loading states', (done) => {
      service.startLoading(CSVFileType.DRIVERS_REPORTS);
      service.startLoading(CSVFileType.TRIPS);
      service.startLoading(CSVFileType.VEHICLE_REPORTS);
      service.startLoading(CSVFileType.BRANDING_BONUS_OLD);
      service.startLoading(CSVFileType.BRANDING_BONUS);

      combineLatest([
        service.isLoading$(CSVFileType.DRIVERS_REPORTS),
        service.isLoading$(CSVFileType.TRIPS),
        service.isLoading$(CSVFileType.VEHICLE_REPORTS),
        service.isLoading$(CSVFileType.BRANDING_BONUS_OLD),
        service.isLoading$(CSVFileType.BRANDING_BONUS),
      ])
        .pipe(take(1))
        .subscribe(
          ([isLoadingDrivers, isLoadingTrips, isLoadingVehicleReports, isLoadingBonusesOld, isLoadingBonuses]) => {
            expect(isLoadingDrivers).toBe(true);
            expect(isLoadingTrips).toBe(true);
            expect(isLoadingVehicleReports).toBe(true);
            expect(isLoadingBonusesOld).toBe(true);
            expect(isLoadingBonuses).toBe(true);

            service.finishLoading(CSVFileType.DRIVERS_REPORTS);
            service.finishLoading(CSVFileType.VEHICLE_REPORTS);

            combineLatest([
              service.isLoading$(CSVFileType.DRIVERS_REPORTS),
              service.isLoading$(CSVFileType.TRIPS),
              service.isLoading$(CSVFileType.VEHICLE_REPORTS),
              service.isLoading$(CSVFileType.BRANDING_BONUS_OLD),
              service.isLoading$(CSVFileType.BRANDING_BONUS),
            ])
              .pipe(take(1))
              // eslint-disable-next-line rxjs/no-nested-subscribe
              .subscribe(([loadingDrivers, loadingTrips, loadingVehicleReports, loadingBonusesOld, loadingBonuses]) => {
                expect(loadingDrivers).toBe(false);
                expect(loadingTrips).toBe(true);
                expect(loadingVehicleReports).toBe(false);
                expect(loadingBonusesOld).toBe(true);
                expect(loadingBonuses).toBe(true);
                done();
              });
          },
        );
    });
  });
});
