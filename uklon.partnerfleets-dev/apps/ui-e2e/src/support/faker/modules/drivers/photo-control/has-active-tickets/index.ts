import { PhotoControlHasActiveTicketsDto } from '@data-access';

import { ModuleBase } from '../../../_internal';

export type BuildProps = Partial<{
  hasActiveTickets?: boolean;
}>;

export class DriverPhotoControlHasActiveTicketsModule extends ModuleBase<PhotoControlHasActiveTicketsDto> {
  public buildDto(props?: BuildProps): PhotoControlHasActiveTicketsDto {
    return { has_active_tickets: props?.hasActiveTickets ?? true };
  }
}
