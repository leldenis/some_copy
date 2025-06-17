import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

import { StorageService } from '../../models';

@Injectable({ providedIn: 'root' })
export class SessionStorageService implements StorageService {
  private readonly sessionStorage: Storage;

  constructor(@Inject(DOCUMENT) document: Document) {
    this.sessionStorage = document.defaultView.sessionStorage;
  }

  public get<T>(key: string): T {
    return JSON.parse(this.sessionStorage.getItem(key)) as T;
  }

  public remove(key: string): void {
    this.sessionStorage.removeItem(key);
  }

  public set<T>(key: string, value: T): void {
    this.sessionStorage.setItem(key, JSON.stringify(value));
  }
}
