export interface NavigationRouteDto {
  path: string;
  name: string;
  icon: string;
  disabled?: boolean;
  hidden?: boolean;
  exact?: boolean;
  indicator?: boolean;
}
