import { TestBed } from '@angular/core/testing';

import { AuthenticationDomainModule } from './authentication-domain.module';

describe('AuthenticationDomainModule', () => {
  let module: AuthenticationDomainModule;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [AuthenticationDomainModule] });

    module = TestBed.inject(AuthenticationDomainModule);
  });

  it('should create', () => {
    expect(module).toBeDefined();
  });
});
