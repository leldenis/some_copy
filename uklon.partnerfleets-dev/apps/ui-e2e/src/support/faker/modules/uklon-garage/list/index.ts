import { CollectionCursorDto, UklonGarageApplicationStatus, UklonGarageFleetApplicationDto } from '@data-access';
import { DEFAULT_LIMIT } from '@ui/shared/consts';

import { ModuleBase } from '../../_internal';

export type BuildProps = Partial<{
  count?: number;
  previous_cursor?: string;
  next_cursor?: string;
  status?: UklonGarageApplicationStatus;
}>;

export class UklonGarageApplicationsListModule extends ModuleBase<
  CollectionCursorDto<UklonGarageFleetApplicationDto>,
  BuildProps
> {
  public buildDto(props?: BuildProps): CollectionCursorDto<UklonGarageFleetApplicationDto> {
    return {
      previous_cursor: props?.previous_cursor ?? '0',
      next_cursor: props?.count > 0 ? '4' : '0',
      items:
        props?.count > 0
          ? Array.from({ length: props?.count ?? DEFAULT_LIMIT }).map(
              this.buildUklonGarageApplication.bind(this, props?.status),
            )
          : [],
    };
  }

  private buildUklonGarageApplication(status: UklonGarageApplicationStatus): UklonGarageFleetApplicationDto {
    return {
      comment: this.faker.string.sample(),
      created_at: this.faker.date.anytime().getTime(),
      first_name: this.faker.person.firstName(),
      id: this.faker.string.uuid(),
      last_name: this.faker.person.lastName(),
      phone: this.faker.phone.number(),
      status: status ?? UklonGarageApplicationStatus.NEW,
    };
  }
}
