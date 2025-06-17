import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ReferencesState } from '@ui/core/store/references/references.reducer';
import { getRegions } from '@ui/core/store/references/references.selectors';

import { RegionPipe } from './region.pipe';

describe('RegionPipe', () => {
  let store: MockStore<ReferencesState>;
  let pipe: RegionPipe;

  const cases = [
    { id: 0, code: 'Kyiv' },
    { id: 1, code: 'Lutsk' },
    { id: 2, code: 'Lviv' },
  ] as const;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: getRegions,
              value: cases,
            },
          ],
        }),
      ],
    });

    store = TestBed.inject(MockStore<ReferencesState>);
    pipe = new RegionPipe(store);
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe.each(cases)('When id is valid', ({ id, code }) => {
    it(`should return ${code}`, () => {
      pipe.transform(id).subscribe((result) => {
        expect(result).toBe(code);
      });
    });
  });

  const emptyCases = [null, undefined, 5, { code: 'Lviv' }, [1, 2, 3]];

  describe.each(emptyCases)('When id is invalid', (id) => {
    it(`should return empty string if id is ${id}`, () => {
      pipe.transform(id as number).subscribe((result) => {
        expect(result).toBe('');
      });
    });
  });
});
