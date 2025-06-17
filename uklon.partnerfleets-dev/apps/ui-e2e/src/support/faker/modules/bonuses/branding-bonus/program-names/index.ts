import { BonusBrandingProgramNameDto } from '@data-access';

import { ModuleBase } from '../../../_internal';

export type BuildProps = Partial<{
  count: number;
  programId: string;
  programName: string;
  status: 'active' | 'deleted';
  items: BonusBrandingProgramNameDto[];
}>;

const DEFAULT_COUNT = 5;

export class BrandingProgramNamesModule extends ModuleBase<BonusBrandingProgramNameDto[], BuildProps> {
  public buildDto(props?: BuildProps): BonusBrandingProgramNameDto[] {
    return props?.items?.length > 0
      ? props.items
      : Array.from({ length: props?.count ?? DEFAULT_COUNT }).map((_, index) => this.buildItem(index, props));
  }

  private buildItem(index: number, props?: BuildProps): BonusBrandingProgramNameDto {
    return {
      id: props?.programId ?? this.faker.string.uuid(),
      name: props?.programName ?? this.faker.string.alpha({ length: { min: 4, max: 15 } }),
      status: props?.status ?? (index % 2 === 0 ? 'active' : 'deleted'),
    };
  }
}
