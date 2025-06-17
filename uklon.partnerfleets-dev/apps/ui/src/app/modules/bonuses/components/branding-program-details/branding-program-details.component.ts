import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { BrandingCalculationProgramParamsDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { GROW_VERTICAL, TranslateItemsPipe } from '@ui/shared';
import { MoneyPipe } from '@ui/shared/pipes/money';

@Component({
  selector: 'upf-branding-program-details',
  standalone: true,
  imports: [MatIcon, TranslateModule, ReactiveFormsModule, TranslateItemsPipe, DecimalPipe, MoneyPipe],
  templateUrl: './branding-program-details.component.html',
  styleUrl: './branding-program-details.component.scss',
  animations: [GROW_VERTICAL()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandingProgramDetailsComponent {
  public readonly parameters = input<BrandingCalculationProgramParamsDto>();

  public readonly toggleBrandingPrograms = output<boolean>();

  public readonly mobilePanelOpen = signal<boolean>(true);

  public toggleBrandingProgram(): void {
    this.mobilePanelOpen.set(!this.mobilePanelOpen());
    this.toggleBrandingPrograms.emit(this.mobilePanelOpen());
  }
}
