import { LiveMapEmployeeDto } from '@data-access';

export interface LiveMapPanelGroupDto<T = LiveMapEmployeeDto> {
  status: string;
  icon: string;
  class: string;
  data: T[];
}

export enum LiveMapPanelType {
  ALL_DRIVERS = 'all_drivers',
  DRIVERS_LIST = 'drivers_list',
  SEARCH = 'search',
  DRIVER_DETAILS = 'driver_details',
  TRIP = 'trip',
}
