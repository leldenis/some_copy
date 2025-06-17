import { Injectable } from '@angular/core';

import { uuidv4 } from '@uklon/angular-core';
import { BaseAuthenticationStorage } from '@uklon/fleets/fleets-app/authentication/domain';

export enum StorageType {
  LOCAL = 'local',
  SESSION = 'session',
}

export const storageDeviceKey = 'device';
export const storageUserKey = 'user';
export const storageTypeKey = 'storageType';
export const localeIdKey = 'localeId';
export const userRoleKey = 'userRole';
export const userIdKey = 'user_id';
export const fleetIdKey = 'selectedFleetId';
export const resendAuthCodeInterval = 'resendAuthCodeInterval';
export const hiddenProfileIndicatorKey = 'hiddenProfileIndicator';
export const cashLimitsDialogKey = 'cashLimitsDialog';
export const accountInfoKey = 'accountInfo';

export enum StorageFiltersKey {
  ORDER = 'orderFilter',
  ORDER_REPORTS = 'orderReportsFilter',
  VEHICLE_LIST = 'vehicleListFilter',
  DRIVER_LIST = 'driverListFilter',
  DRIVER_TRANSACTIONS = 'driverTransactionsFilter',
  DRIVER_BALANCE = 'driverBalanceFilter',
  FLEET_WALLET = 'fleetWalletFilter',
  COURIERS_FLEET_WALLET = 'couriersFleetWalletFilter',
  DRIVER_ORDERS = 'driverOrdersFilter',
  VEHICLE_ORDERS = 'vehicleOrdersFilter',
  FEEDBACKS = 'feedbacksFilter',
  LIVE_MAP = 'liveMapFilter',
  COURIERS_LIVE_MAP = 'couriersLiveMapFilter',
  DRIVER_TICKETS = 'driverTicketsFilter',
  VEHICLE_TICKETS = 'vehicleTicketsFilter',
  PHOTO_CONTROL = 'photoControlFilter',
  VEHICLE_BRANDING_PERIOD = 'vehicleBrandingPeriod',
  DASHBOARD = 'dashboardFilter',
  COURIERS_LIST = 'couriersList',
  COURIERS_DELIVERIES = 'couriersDeliveries',
  COURIER_TRANSACTIONS = 'courierTransactions',
  COURIER_STATISTIC = 'courierStatisticsFilter',
  COURIER_DELIVERIES = 'courierDeliveriesFilter',
  COURIERS_WALLETS = 'couriersWallets',
  DRIVER_STATISTICS = 'driverStatisticsFilter',
  DRIVER_HISTORY = 'driverHistoryFilter',
  VEHICLE_HISTORY = 'vehicleHistoryFilters',
  FLEET_HISTORY = 'fleetHistory',
  COURIERS_REPORTS = 'couriersReports',
  VEHICLE_ORDER_REPORTS = 'vehicleOrderReportsFilter',
  COURIERS_FEEDBACKS = 'couriers_feedbacks',
  BRANDING_BONUS_OLD_TAB = 'brandingBonusOldTabFilter',
  BRANDING_BONUS_TAB = 'brandingBonusTabFilter',
  DRIVER_ACTIVE_COMMISSION_PROGRAMS = 'driverActiveProgramsFilter',
  DRIVER_PLANNED_COMMISSION_PROGRAMS = 'driverPlannedProgramsFilter',
  DRIVER_ARCHIVED_COMMISSION_PROGRAMS = 'driverArchivedProgramsFilter',
  DRIVER_ACTIVE_COMMISSION_TAB = 'driverActiveCommissionTab',
  VEHICLE_ACTIVE_COMMISSION_PROGRAMS = 'vehicleActiveProgramsFilter',
  VEHICLE_PLANNED_COMMISSION_PROGRAMS = 'vehiclePlannedProgramsFilter',
  VEHICLE_ARCHIVED_COMMISSION_PROGRAMS = 'vehicleArchivedProgramsFilter',
  VEHICLE_ACTIVE_COMMISSION_TAB = 'vehicleActiveCommissionTab',
  RRO_VEHICLE_LIST = 'rroVehicleListFilter',
  UKLON_GARAGE_APPLICATIONS = 'uklonGarageApplications',
  DRIVERS_PHOTO_CONTROL = 'driversPhotoControlFilter',
  CASH_LIMITS = 'cashLimitsFilter',
}

export enum StoragePaginationKey {
  ORDER_REPORTS = 'orderReportsPagination',
}

export const KEEP_STORAGE_KEYS = [storageDeviceKey, hiddenProfileIndicatorKey, cashLimitsDialogKey];

@Injectable()
export class StorageService implements BaseAuthenticationStorage {
  private storageType: StorageType;

  constructor() {
    this.storageType = JSON.parse(localStorage.getItem(storageTypeKey)) || StorageType.LOCAL;
  }

  public set<T>(key: string, data: T): void {
    this.getStorage().setItem(key, JSON.stringify(data));
  }

  public get<T = string>(key: string): T | null {
    const result = KEEP_STORAGE_KEYS.includes(key) ? localStorage.getItem(key) : this.getStorage().getItem(key);
    if (!result) {
      return null;
    }

    try {
      return JSON.parse(result);
    } catch {
      return null;
    }
  }

  public delete(key: string): void {
    this.getStorage().removeItem(key);
  }

  public clear(): void {
    this.getStorage().clear();
  }

  public clearExcept(keep: string[] = []): void {
    if (keep.length > 0) {
      Object.keys(this.getStorage()).forEach((key) => {
        if (!keep.includes(key)) this.delete(key);
      });
    } else {
      this.clear();
    }
  }

  public setStorageType(type: StorageType): void {
    this.storageType = type;
    localStorage.setItem(storageTypeKey, JSON.stringify(type));
  }

  public getOrCreateDeviceId(): string {
    const deviceId = localStorage.getItem(storageDeviceKey);

    try {
      const id = JSON.parse(deviceId);
      return id || this.createDeviceId();
    } catch {
      return this.createDeviceId();
    }
  }

  public createDeviceId(): string {
    const deviceId = uuidv4();
    localStorage.setItem(storageDeviceKey, JSON.stringify(deviceId));
    return deviceId;
  }

  private getStorage(): Storage {
    return this.storageType === StorageType.LOCAL ? localStorage : sessionStorage;
  }
}
