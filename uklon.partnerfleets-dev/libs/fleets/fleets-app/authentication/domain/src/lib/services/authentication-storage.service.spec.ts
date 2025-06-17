import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BaseAuthenticationStorage } from './authentication-storage.service';

@Injectable()
class AuthenticationStorageServiceFake implements BaseAuthenticationStorage {
  public get<T>(_: string): T {
    return undefined;
  }

  public getOrCreateDeviceId(): string {
    return '';
  }

  public createDeviceId(): string {
    return '';
  }

  public set<T = unknown>(__: string, _: T): void {}
}

describe.skip('BaseAuthenticationStorage', () => {
  let service: BaseAuthenticationStorage;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: BaseAuthenticationStorage, useClass: AuthenticationStorageServiceFake }],
    });
    service = TestBed.inject(BaseAuthenticationStorage);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
