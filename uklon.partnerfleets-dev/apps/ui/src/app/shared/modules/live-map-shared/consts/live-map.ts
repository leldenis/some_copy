import { InjectionToken } from '@angular/core';
import { TicketStatus } from '@constant';
import {
  ActiveOrderStatus,
  EmployeeLocationStatus,
  LiveMapEmployeeDto,
  VehicleDetailsPhotoControlDto,
} from '@data-access';
import { PanelStyling, PHOTO_CONTROL_STATUS_STYLING } from '@ui/modules/vehicles/consts';
import { StatusColor } from '@ui/shared';
import { LatLngTuple } from 'leaflet';
import moment from 'moment';

import { toClientDate } from '@uklon/angular-core';

import { LiveMapPanelGroupDto, MapPanelState } from '../models';

export const LIVE_MAP_TYPE = new InjectionToken<LiveMapType>('liveMapType');

export enum LiveMapType {
  COURIER = 'courier',
  DRIVER = 'driver',
}

export const STATUS_ICONS: Record<string, string> = {
  [EmployeeLocationStatus.OrderExecution]: 'icon_driving.svg',
  [EmployeeLocationStatus.Active]: 'icon_active.svg',
  [EmployeeLocationStatus.Blocked]: 'icon_blocked.svg',
  [EmployeeLocationStatus.Inactive]: 'icon_inactive.svg',
};

export const GET_ROUTE_ICON = (coords: LatLngTuple[], index: number): string => {
  let iconName = 'icon_route_start.svg';
  if (index > 0 && index < coords.length - 1) {
    iconName = 'icon_route_mid.svg';
  } else if (index === coords.length - 1) {
    iconName = 'icon_route_end.svg';
  }

  return iconName;
};

export const ROUTE_COLOR = {
  SYSTEM: '#33CCA1',
  ACTUAL: '#454754',
  BORDER: '#FFFFFF',
};

export const PANEL_STATE_ZOOM: Record<PanelFragment, number> = {
  home: 12,
  employeesList: 12,
  employeeDetails: 13,
  activeOrder: 15,
};

export type PanelFragment = 'home' | 'employeesList' | 'employeeDetails' | 'activeOrder';

export const FRAGMENT_TO_STATE: Record<PanelFragment, MapPanelState> = {
  home: MapPanelState.Home,
  employeesList: MapPanelState.EmployeesList,
  employeeDetails: MapPanelState.EmployeeDetails,
  activeOrder: MapPanelState.ActiveOrder,
};

export const LOCATION_STATUS_STYLING: Record<string, StatusColor> = {
  [EmployeeLocationStatus.OrderExecution]: 'accent',
  [EmployeeLocationStatus.Active]: 'success',
  [EmployeeLocationStatus.Blocked]: 'error',
  [EmployeeLocationStatus.Inactive]: 'neutral',
};

export const ACTIVE_ORDER_STATUS_STYLING: Record<string, StatusColor> = {
  [ActiveOrderStatus.RUNNING]: 'accent',
  [ActiveOrderStatus.ACCEPTED]: 'success',
  [ActiveOrderStatus.ARRIVED]: 'primary',
};

export const GET_MAP_PANEL_GROUPS = <T = LiveMapEmployeeDto>(): LiveMapPanelGroupDto<T>[] => [
  {
    status: EmployeeLocationStatus.OrderExecution,
    icon: 'route',
    class: 'tw-bg-alert-blue-dark tw-text-alert-blue-light',
    data: [] as T[],
  },
  {
    status: EmployeeLocationStatus.Active,
    icon: 'task_alt',
    class: 'tw-bg-green-100 tw-text-green-800',
    data: [] as T[],
  },
  {
    status: EmployeeLocationStatus.Blocked,
    icon: 'lock',
    class: 'tw-bg-[#FFF7DC] tw-text-[#845700]',
    data: [] as T[],
  },
  {
    status: EmployeeLocationStatus.Inactive,
    icon: 'not_listed_location',
    class: 'tw-bg-neutral-silver tw-text-neutral-smoke',
    data: [] as T[],
  },
];

export const GET_MAP_PHOTO_CONTROL_TEXT = (
  photoControl: VehicleDetailsPhotoControlDto,
  passedDeadline: boolean,
): { title: string; message: string } => {
  let title = '';
  let message;

  if (photoControl?.block_immediately) {
    message = 'PhotoControl.Tooltips.LiveMap.BlockMessage';
    title = 'PhotoControl.Tooltips.VehiclesList.DraftTitle';
    return { title, message };
  }

  switch (photoControl.status) {
    case TicketStatus.CLARIFICATION:
      message = passedDeadline
        ? 'PhotoControl.Tooltips.LiveMap.BlockMessage'
        : 'PhotoControl.Tooltips.LiveMap.DraftMessage';
      title = 'PhotoControl.Tooltips.VehiclesList.ClarificationTitle';
      break;
    case TicketStatus.DRAFT:
      message = passedDeadline
        ? 'PhotoControl.Tooltips.LiveMap.BlockMessage'
        : 'PhotoControl.Tooltips.LiveMap.DraftMessage';
      title = 'PhotoControl.Tooltips.VehiclesList.DraftTitle';
      break;
    case TicketStatus.REJECTED:
      message = 'PhotoControl.Tooltips.LiveMap.RejectedMessage';
      title = 'PhotoControl.Panel.Title';
      break;
    default:
      message = '';
      break;
  }

  return { title, message };
};

export const GET_MAP_PHOTO_CONTROL_PANEL_STYING = ({
  status,
  deadline_to_send,
}: VehicleDetailsPhotoControlDto): PanelStyling => {
  const IMPLICIT_STATUSES = new Set([TicketStatus.REJECTED, TicketStatus.SENT, TicketStatus.REVIEW]);

  if (!status) return PHOTO_CONTROL_STATUS_STYLING[TicketStatus.DRAFT];
  if (IMPLICIT_STATUSES.has(status)) return PHOTO_CONTROL_STATUS_STYLING[status];

  const daysDiff = moment(toClientDate(deadline_to_send)).diff(moment(), 'days');
  return PHOTO_CONTROL_STATUS_STYLING[daysDiff >= 0 ? TicketStatus.DRAFT : TicketStatus.REJECTED];
};

// const EMPLOYEE = {
//   id: 'b8fea45d-55cf-4cfa-889c-42fb4152421e',
//   phone: '380680923156',
//   last_name: 'Тестович',
//   first_name: 'Тестік',
//   status: 'OrderExecution',
//   location: {
//     longitude: 30.326_89,
//     latitude: 50.4025,
//   },
//   active_orders: [
//     {
//       id: '22773189-9458-4ce0-b99b-f95d6815ab23',
//       status: 'arrived',
//     },
//     {
//       id: 'ff24e002-4073-488c-b1a6-b86f83b619fa',
//       status: 'running',
//     },
//   ],
//   vehicle: {
//     id: '7d794dcc-7445-490f-93aa-0403c77ee019',
//     license_plate: 'YT5656YT',
//     make: 'Abarth',
//     model: 'Fiat 500',
//     comfort_level: 'Comfort',
//     photos: {
//       driver_car_front_photo: {
//         url: faker.image.avatar(),
//         fallback_url: faker.image.avatar(),
//         uploaded_at: 1_710_526_152,
//         upload_source: 'Frontend',
//       },
//     },
//   },
//   photos: {
//     driver_avatar_photo: {
//       url: faker.image.avatar(),
//       fallback_url: faker.image.avatar(),
//       uploaded_at: 1_707_568_027,
//       upload_source: 'Frontend',
//     },
//   },
// };
//
// export const MOCK_MAP_DRIVERS = (count = 20) => {
//   const randomCount = faker.number.int({ min: 15, max: 60 });
//
//   return {
//     data: Array.from({ length: count || randomCount }).map((_, index) => {
//       const rand = faker.number.int({ min: 0, max: 3 });
//       const status = Object.values(EmployeeLocationStatus)[rand];
//       const active_orders = status === 'OrderExecution' || !index ? EMPLOYEE.active_orders : [];
//
//       return {
//         ...EMPLOYEE,
//         id: `${index}`,
//         status,
//         active_orders,
//         last_name: faker.person.lastName(),
//         first_name: `${faker.person.firstName()} ${index}`,
//         location:
//           status === EmployeeLocationStatus.Blocked || status === EmployeeLocationStatus.Inactive
//             ? null
//             : {
//                 latitude: faker.location.latitude(50.5, 50.15),
//                 longitude: faker.location.longitude(30.5, 30.15),
//               },
//         photos: {
//           driver_avatar_photo: {
//             ...EMPLOYEE.photos.driver_avatar_photo,
//             url: faker.image.avatar(),
//           },
//         },
//         vehicle: {
//           ...EMPLOYEE.vehicle,
//           license_plate: faker.vehicle.vrm(),
//         },
//       };
//     }),
//     actual_on: toServerDate(new Date()),
//     cache_time_to_live: 10,
//   };
// };
