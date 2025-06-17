import { TestBed } from '@angular/core/testing';
import { DriverFilter } from '@data-access';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs';

import { DriverFiltersPipe } from './driver-filters.pipe';

describe('DriverFiltersPipe', () => {
  let pipe: DriverFiltersPipe;
  let translateService: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [TranslateService],
    });

    translateService = TestBed.inject(TranslateService);
    pipe = new DriverFiltersPipe(translateService);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return no filters message', (done) => {
    pipe
      .transform(null)
      .pipe(take(1))
      .subscribe(([res]) => {
        expect(res.key).toBe('DriverFilters.NoFilters');
        expect(res.data).toBe(null);
        expect(res.isLink).toBe(false);
        done();
      });
  });

  it('should return no filters message', (done) => {
    pipe
      .transform([])
      .pipe(take(1))
      .subscribe(([res]) => {
        expect(res.key).toBe('DriverFilters.NoFilters');
        expect(res.data).toBe(null);
        expect(res.isLink).toBe(false);
        done();
      });
  });

  it('should return no filters message in online status', (done) => {
    pipe
      .transform([], true)
      .pipe(take(1))
      .subscribe(([res]) => {
        expect(res.key).toBe('DriverFilters.Short.Broadcast');
        expect(res.data).toBe(null);
        expect(res.isLink).toBe(false);
        done();
      });
  });

  it('should return translated string of filters', (done) => {
    pipe
      .transform([DriverFilter.BROADCAST, DriverFilter.CHAIN])
      .pipe(take(1))
      .subscribe((res) => {
        expect(res).toHaveLength(2);
        expect(res[0].key).toBe('DriverFilters.Broadcast');
        expect(res[0].data).toBe(null);
        expect(res[0].isLink).toBe(true);

        expect(res[1].key).toBe('DriverFilters.Chain');
        expect(res[1].data).toBe(null);
        expect(res[1].isLink).toBe(false);

        done();
      });
  });

  it('should return combined filters key', (done) => {
    pipe
      .transform([DriverFilter.BROADCAST, DriverFilter.CHAIN, DriverFilter.OFFER, DriverFilter.LOOP_FILTER], true)
      .pipe(take(1))
      .subscribe((res) => {
        expect(res).toHaveLength(3);
        expect(res[0].key).toBe('DriverFilters.CombinedFilters');
        expect(res[0].data).toBe(
          'DriverFilters.Short.Broadcast, DriverFilters.Short.Offer, DriverFilters.Short.OfferLoopFilter',
        );
        expect(res[0].isLink).toBe(true);

        expect(res[1].key).toBe('DriverFilters.Chain');
        expect(res[1].data).toBe(
          'DriverFilters.Short.Broadcast, DriverFilters.Short.Offer, DriverFilters.Short.OfferLoopFilter',
        );
        expect(res[1].isLink).toBe(false);

        expect(res[2].key).toBe('DriverFilters.Short.Broadcast');
        expect(res[2].data).toBe(
          'DriverFilters.Short.Broadcast, DriverFilters.Short.Offer, DriverFilters.Short.OfferLoopFilter',
        );
        expect(res[2].isLink).toBe(false);
        done();
      });
  });

  it('should filter out duplicated filters', (done) => {
    pipe
      .transform([DriverFilter.CHAIN, DriverFilter.HOME_FILTER, DriverFilter.FAST_SEARCH, DriverFilter.BROADCAST])
      .pipe(take(1))
      .subscribe((res) => {
        expect(res).toHaveLength(2);

        expect(res[0].key).toBe('DriverFilters.Chain');
        expect(res[0].data).toBe(null);
        expect(res[0].isLink).toBe(false);

        expect(res[1].key).toBe('DriverFilters.Broadcast');
        expect(res[1].data).toBe(null);
        expect(res[1].isLink).toBe(true);
        done();
      });
  });
});
