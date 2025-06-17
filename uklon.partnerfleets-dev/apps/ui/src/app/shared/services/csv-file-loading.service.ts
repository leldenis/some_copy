import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export enum CSVFileType {
  DRIVERS_REPORTS = 1,
  TRIPS,
  VEHICLE_REPORTS,
  BRANDING_BONUS_OLD,
  BRANDING_BONUS,
}

@Injectable({ providedIn: 'root' })
export class CSVFileLoadingService {
  private loaders: Record<CSVFileType, BehaviorSubject<boolean>> = {
    [CSVFileType.DRIVERS_REPORTS]: new BehaviorSubject<boolean>(false),
    [CSVFileType.TRIPS]: new BehaviorSubject<boolean>(false),
    [CSVFileType.VEHICLE_REPORTS]: new BehaviorSubject<boolean>(false),
    [CSVFileType.BRANDING_BONUS_OLD]: new BehaviorSubject<boolean>(false),
    [CSVFileType.BRANDING_BONUS]: new BehaviorSubject<boolean>(false),
  };

  public isLoading$(key: CSVFileType): Observable<boolean> {
    return this.getLoader(key).asObservable();
  }

  public startLoading(key: CSVFileType): void {
    this.getLoader(key).next(true);
  }

  public finishLoading(key: CSVFileType): void {
    this.getLoader(key).next(false);
  }

  private getLoader(key: CSVFileType): BehaviorSubject<boolean> {
    if (!this.loaders[key]) {
      this.loaders[key] = new BehaviorSubject<boolean>(false);
    }
    return this.loaders[key];
  }
}
