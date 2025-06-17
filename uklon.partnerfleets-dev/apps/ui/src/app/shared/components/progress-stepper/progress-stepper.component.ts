import { ChangeDetectionStrategy, Component, Inject, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { ProgressBarComponent } from '@ui/shared';
import { IconsConfig } from '@ui/shared/tokens/icons.config';
import { ICONS } from '@ui/shared/tokens/icons.token';

interface IStep {
  icon: string;
  iconActive?: string;
  title: string;
  description: string;
  size?: 'sm' | 'md';
}

const DEFAULT_STEPS: IStep[] = [
  {
    icon: 'i-doc-green',
    title: 'Vehicles.Creation.Stepper.Title',
    description: 'Vehicles.Creation.Stepper.StepFirst',
  },
  {
    icon: 'i-camera-gray',
    iconActive: 'i-camera-green',
    title: 'Vehicles.Creation.Stepper.Title',
    description: 'Vehicles.Creation.Stepper.StepSecond',
    size: 'md',
  },
];

@Component({
  selector: 'upf-progress-stepper',
  standalone: true,
  imports: [MatIconModule, TranslateModule, ProgressBarComponent],
  templateUrl: './progress-stepper.component.html',
  styleUrls: ['./progress-stepper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressStepperComponent {
  @Input() public steps: IStep[] = DEFAULT_STEPS;
  @Input() public activeStep = 0;
  @Input() public progressPercentage = 0;

  public readonly completedIcon = 'i-check-white';

  constructor(@Inject(ICONS) public icons: IconsConfig) {}
}
