import { ModuleBase } from '../../_internal';

export type BuildProps = Partial<{
  fleetsNotifications?: Record<string, number>;
}>;

export class FleetNotificationsUnreadModule extends ModuleBase<Record<string, number>> {
  public buildDto(props?: BuildProps): Record<string, number> {
    return props?.fleetsNotifications ?? {};
  }
}
