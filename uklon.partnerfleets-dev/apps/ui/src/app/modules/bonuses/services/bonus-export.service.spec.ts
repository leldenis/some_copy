import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { BonusExportService } from '@ui/modules/bonuses/services/bonus-export.service';
import {
  BRANDING_BONUS_CALCULATION_PERIOD_ITEM_1_MOCK,
  BRANDING_BONUS_PROGRAM_DETAILS_MOCK,
  BRANDING_BONUS_PROGRAMS_COLLECTION_MOCK,
} from '@ui/modules/bonuses/services/bonus.mock';
import { DurationPipe } from '@ui/shared';

describe('BonusExportService', () => {
  let service: BonusExportService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [BonusExportService, DurationPipe],
    });
    service = TestBed.inject(BonusExportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should correct convert to csv data', () => {
    const data: string = service.convertToCsv(
      BRANDING_BONUS_PROGRAMS_COLLECTION_MOCK.items,
      BRANDING_BONUS_PROGRAM_DETAILS_MOCK,
      BRANDING_BONUS_CALCULATION_PERIOD_ITEM_1_MOCK.period,
    );
    expect(data).not.toBeNull();
    expect(data).not.toBeNaN();
    expect(data).not.toBeUndefined();
    expect(typeof data).toBe('string');
  });
});
