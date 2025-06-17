import { TestBed } from '@angular/core/testing';

import { CdkModule } from './cdk.module';

describe('CdkModule', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CdkModule],
    }).compileComponents();
  });

  it('should have a module definition', () => {
    expect(CdkModule).toBeDefined();
  });
});
