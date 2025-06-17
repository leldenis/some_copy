import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { FleetWithArchivedDriversBasicInfoDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { RatingLessRequirementPipe } from '@ui/modules/bonuses/pipes/rating-less-requirement/rating-less-requirement.pipe';
import { InfoPanelComponent } from '@ui/shared/modules/info-panel/components/info-panel/info-panel.component';

@Component({
  selector: 'upf-vehicle-program-requirements-info-error',
  standalone: true,
  imports: [RatingLessRequirementPipe, TranslateModule, InfoPanelComponent],
  templateUrl: './vehicle-program-requirements-info-error.component.html',
  styleUrl: './vehicle-program-requirements-info-error.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleProgramRequirementsInfoErrorComponent {
  public readonly driver = input.required<FleetWithArchivedDriversBasicInfoDto>();
  public readonly minProgramRating = input.required<number>();

  public readonly hasDriver = computed(
    () => this.driver() && (!!this.driver()?.first_name || !!this.driver()?.last_name),
  );
}
