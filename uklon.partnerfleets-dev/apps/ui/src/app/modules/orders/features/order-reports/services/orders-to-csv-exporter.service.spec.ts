import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { OrdersToCsvExporterService } from '@ui/modules/orders/features/order-reports/services/orders-to-csv-exporter.service';
import { OrderReportsParamsDto } from '@ui/modules/orders/models/order-reports.dto';
import { CSVFileRef, DurationPipe } from '@ui/shared';

describe('OrdersToCsvExporterService', () => {
  let ordersToCsvExporterService: OrdersToCsvExporterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [OrdersToCsvExporterService, DurationPipe],
    });
    ordersToCsvExporterService = TestBed.inject(OrdersToCsvExporterService);
  });

  it('should be created', () => {
    expect(ordersToCsvExporterService).toBeTruthy();
  });

  it('should call export with correct parameters and return CSVFileRef', () => {
    const fleetId = '2c854e0f-b08a-4447-9e2b-25b1a90f2f93';
    const queryParams: OrderReportsParamsDto = {
      dateFrom: 1_713_733_200_000,
      dateTo: 1_714_337_999_999,
      limit: 30,
      offset: 0,
    };

    const csvFile: CSVFileRef = ordersToCsvExporterService.export(fleetId, queryParams);
    expect(csvFile).toBeInstanceOf(CSVFileRef);
  });
});
