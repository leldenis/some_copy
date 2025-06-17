import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { BonusExportOldService } from '@ui/modules/bonuses/services/bonus-export-old.service';
import {
  BRANDING_BONUS_CALCULATION_PERIOD_ITEM_1_OLD_MOCK,
  BRANDING_BONUS_CALCULATION_PROGRAM_OLD_MOCK,
  BRANDING_BONUS_PROGRAMS_COLLECTION_OLD_MOCK,
} from '@ui/modules/bonuses/services/bonus-old.mock';
import { DurationPipe } from '@ui/shared';

describe('BonusExportOldService', () => {
  let service: BonusExportOldService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [BonusExportOldService, DurationPipe],
    });
    service = TestBed.inject(BonusExportOldService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should correct convert to csv data', () => {
    const data: string = service.convertToCsv(
      BRANDING_BONUS_PROGRAMS_COLLECTION_OLD_MOCK.items,
      BRANDING_BONUS_CALCULATION_PROGRAM_OLD_MOCK,
      BRANDING_BONUS_CALCULATION_PERIOD_ITEM_1_OLD_MOCK.period,
    );
    expect(data).not.toBeNull();
    expect(data).not.toBeNaN();
    expect(data).not.toBeUndefined();
    expect(typeof data).toBe('string');
  });
});
