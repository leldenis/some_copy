import { FleetType } from '@data-access';
import { CorePaths } from '@ui/core/models/core-paths';
import { DriverPaths } from '@ui/modules/drivers/models/driver-paths';
import { OrdersPaths } from '@ui/modules/orders/models/orders-paths';
import { NavigationRouteDto } from '@ui/modules/shell/models';
import { VehiclePaths } from '@ui/modules/vehicles/models/vehicle-paths';

export const NAVIGATION_ROUTES: NavigationRouteDto[] = [
  {
    name: 'Workspace.Navigation.Dashboard',
    path: 'general',
    icon: 'i-dashboard',
  },
  {
    name: 'Workspace.Navigation.Drivers',
    path: 'drivers',
    icon: 'i-drivers',
  },
  {
    name: 'Workspace.Navigation.Vehicles',
    path: 'vehicles',
    icon: 'i-vehicles',
  },
  {
    name: 'Live map',
    path: 'live-map',
    icon: 'i-map',
  },
  {
    name: 'Workspace.Navigation.Orders',
    path: 'orders',
    icon: 'i-orders',
  },
  {
    name: 'Workspace.Navigation.Finance',
    path: 'finance',
    icon: 'i-finance',
  },
  {
    name: 'Workspace.Navigation.Bonuses',
    path: 'bonuses',
    icon: 'i-bonuses',
  },
  {
    name: 'Workspace.Navigation.Feedbacks',
    path: 'feedbacks',
    icon: 'i-feedbacks',
  },
  {
    name: 'Workspace.Navigation.Forbidden',
    path: 'forbidden',
    icon: '',
    hidden: true,
  },
  {
    name: 'Account.Title',
    path: 'account',
    icon: '',
    hidden: true,
  },
  {
    name: 'Workspace.Navigation.FleetProfile',
    path: 'fleet-profile',
    icon: 'i-fleet-profile',
    indicator: true,
  },
];

export const COURIER_NAVIGATION_ROUTES: NavigationRouteDto[] = [
  {
    name: 'Workspace.Navigation.Couriers',
    path: 'couriers',
    icon: 'i-drivers',
    exact: true,
  },
  {
    name: 'Live map',
    path: 'couriers/live-map',
    icon: 'i-map',
    exact: true,
  },
  {
    name: 'Workspace.Navigation.Orders',
    path: 'couriers/orders',
    icon: 'i-orders',
    exact: true,
  },
  {
    name: 'Workspace.Navigation.Finance',
    path: 'couriers/finance',
    icon: 'i-finance',
    exact: true,
  },
  {
    name: 'Workspace.Navigation.CouriersFeedbacks',
    path: 'couriers/feedbacks',
    icon: 'i-feedbacks',
    exact: true,
  },
  {
    name: 'Workspace.Navigation.Forbidden',
    path: 'forbidden',
    icon: '',
    hidden: true,
  },
  {
    name: 'Account.Title',
    path: 'account',
    icon: '',
    hidden: true,
  },
  {
    name: 'Workspace.Navigation.FleetProfile',
    path: 'fleet-profile',
    icon: 'i-fleet-profile',
  },
];

export const ALL_NAVIGATION_ROUTES = [...NAVIGATION_ROUTES, ...COURIER_NAVIGATION_ROUTES];

export const FLEET_TYPE_ROUTES: Map<FleetType, NavigationRouteDto[]> = new Map([
  [FleetType.COMMERCIAL, NAVIGATION_ROUTES],
  [FleetType.PRIVATE, NAVIGATION_ROUTES],
  [FleetType.RENTAL, NAVIGATION_ROUTES],
  [FleetType.COURIER_FINANCE_MEDIATOR, COURIER_NAVIGATION_ROUTES],
  [FleetType.PRIVATE_COURIER, COURIER_NAVIGATION_ROUTES],
]);

export const AVAILABLE_PAGE_FOR_REDIRECT = [
  `/${CorePaths.WORKSPACE}/${CorePaths.DRIVERS}/${DriverPaths.DETAILS}`,
  `/${CorePaths.WORKSPACE}/${CorePaths.ORDERS}/${OrdersPaths.DETAILS}`,
  `/${CorePaths.WORKSPACE}/${CorePaths.VEHICLES}/${VehiclePaths.DETAILS}`,
  `/${CorePaths.WORKSPACE}/${CorePaths.ACCOUNT}`,
  `/${CorePaths.WORKSPACE}/${CorePaths.VEHICLES}/${VehiclePaths.CREATE}`,
  `/${CorePaths.WORKSPACE}/${CorePaths.FINANCE}`,
  `/${CorePaths.WORKSPACE}/${CorePaths.VEHICLES}/${VehiclePaths.TICKET}`,
] as const;
