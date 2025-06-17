export enum HistoryInitiatorType {
  FLEET_OWNER = 'FleetOwner',
  UKLON_MANAGER = 'UklonManager',
  SYSTEM = 'System',
}

export interface HistoryChangeInitiatorDto {
  account_id: string;
  display_name: string;
  type?: HistoryInitiatorType;
}
