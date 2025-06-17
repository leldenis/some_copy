import { Injectable } from '@angular/core';
import { hiddenProfileIndicatorKey, StorageService } from '@ui/core/services/storage.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfileIndicatorService {
  private readonly showIndicator: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private readonly storage: StorageService) {}

  public get showIndicator$(): Observable<boolean> {
    return this.showIndicator.asObservable();
  }

  public show(fleetId: string): void {
    const indicators: Record<string, boolean> = this.storage.get(hiddenProfileIndicatorKey);
    this.showIndicator.next(!indicators?.[fleetId]);
  }

  public hide(fleetId: string): void {
    const indicators: Record<string, boolean> = this.storage.get(hiddenProfileIndicatorKey) || {};
    indicators[fleetId] = true;
    this.storage.set(hiddenProfileIndicatorKey, indicators);

    this.showIndicator.next(false);
  }
}
