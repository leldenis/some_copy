import { Injectable } from '@angular/core';

@Injectable()
export abstract class BaseAuthenticationStorage {
  public abstract set<T = unknown>(key: string, value: T): void;
  public abstract get<T>(key: string): T;
  public abstract getOrCreateDeviceId(): string;
  public abstract createDeviceId(): string;
}
