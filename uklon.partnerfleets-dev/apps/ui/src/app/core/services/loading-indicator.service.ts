import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingIndicatorService {
  private readonly loadingSbj = new BehaviorSubject<{ show: boolean; title?: string }>({ show: false });

  public get isLoading$(): Observable<{ show: boolean; title?: string }> {
    return this.loadingSbj.asObservable();
  }

  public show(title = 'Common.LoadingData'): void {
    this.loadingSbj.next({ show: true, title });
  }

  public hide(): void {
    this.loadingSbj.next({ show: false });
  }
}
