import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Restriction, RestrictionReason } from '@constant';
import { DriverRestrictionDto } from '@data-access';

export const ALLOWED_TO_DISPLAY_RESTRICTIONS_MAP = new Map([
  [Restriction.BROAD_CAST, true],
  [Restriction.FILTER_OFFER, true],
  [Restriction.CASH, true],
]);

export const RESTRICTION_REASON_TRANSLATION_MAP = new Map([
  [RestrictionReason.MANAGER, 'Common.Enums.RestrictionReason.Title.Manager'],
  [RestrictionReason.FLEET, 'Common.Enums.RestrictionReason.Title.Fleet'],
]);

export const RESTRICTION_REASON_BADGE_TYPE_MAP = new Map([
  [RestrictionReason.MANAGER, true],
  [RestrictionReason.FLEET, false],
]);

export const RESTRICTION_TYPE_TITLE_TRANSLATION_MAP = new Map([
  [Restriction.FILTER_OFFER, 'Common.Enums.Restriction.Title.FilterOffer'],
  [Restriction.BROAD_CAST, 'Common.Enums.Restriction.Title.BroadCast'],
  [Restriction.CASH, 'Common.Enums.Restriction.Title.Cash'],
]);

export const RESTRICTION_TYPE_DESCRIPTION_TRANSLATION_MAP = new Map([
  [Restriction.FILTER_OFFER, 'Common.Enums.Restriction.Description.FilterOffer'],
  [Restriction.BROAD_CAST, 'Common.Enums.Restriction.Description.BroadCast'],
  [Restriction.CASH, 'Common.Enums.Restriction.Description.Cash'],
]);

export interface RestrictionViewModel {
  title: string;
  description: string;
  reason: string;
  reasonBadge: boolean;
  hasRestriction: boolean;
  formGroupName: number;
}

export interface RestrictionForm {
  hasRestriction: FormControl<boolean>;
  type: FormControl<Restriction>;
}

@Injectable()
export class DriverRestrictionViewModelFactoryService {
  public get restrictionTypes(): Restriction[] {
    return [...ALLOWED_TO_DISPLAY_RESTRICTIONS_MAP.keys()];
  }

  public createAll(
    restrictions: Partial<DriverRestrictionDto>[],
    formArray: FormArray<FormGroup<RestrictionForm>>,
  ): RestrictionViewModel[] {
    const viewModels: RestrictionViewModel[] = [];

    restrictions.forEach((restriction, i) => {
      const viewModel = this.create(restriction, i);

      if (viewModel) {
        viewModels.push(viewModel);

        this.createOrUpdateRestrictionFormGroup(formArray, i, viewModel, restriction);
      }
    });

    return viewModels;
  }

  private create(value: Partial<DriverRestrictionDto>, formGroupName: number): RestrictionViewModel | null {
    return {
      reason: RESTRICTION_REASON_TRANSLATION_MAP.get(value?.restricted_by),
      reasonBadge: RESTRICTION_REASON_BADGE_TYPE_MAP.get(value?.restricted_by),
      title: RESTRICTION_TYPE_TITLE_TRANSLATION_MAP.get(value.type),
      description: RESTRICTION_TYPE_DESCRIPTION_TRANSLATION_MAP.get(value.type),
      hasRestriction: this.getHasRestriction(value),
      formGroupName,
    };
  }

  private createOrUpdateRestrictionFormGroup(
    formArray: FormArray<FormGroup<RestrictionForm>>,
    formGroupName: number,
    viewModel: RestrictionViewModel,
    restriction: Partial<DriverRestrictionDto>,
  ): void {
    const formGroup = formArray.get([formGroupName]);

    if (formGroup) {
      formGroup.patchValue(viewModel.hasRestriction);
    } else {
      formArray.insert(
        formGroupName,
        new FormGroup({
          hasRestriction: new FormControl<boolean>(viewModel.hasRestriction),
          type: new FormControl<Restriction>(restriction.type),
        }),
      );
    }
  }

  private getHasRestriction(value: Partial<DriverRestrictionDto>): boolean {
    const hasDriverRestriction = value?.created_at && value?.actual_from;
    return hasDriverRestriction ? value.created_at > value.actual_from : true;
  }
}
