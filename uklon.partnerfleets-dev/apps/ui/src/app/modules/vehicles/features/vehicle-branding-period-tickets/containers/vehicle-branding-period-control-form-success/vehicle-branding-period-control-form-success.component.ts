import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { MatAnchor } from '@angular/material/button';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CorePaths } from '@ui/core/models/core-paths';
import { VehiclePaths } from '@ui/modules/vehicles/models/vehicle-paths';
import { StatusBadgeComponent, UIService } from '@ui/shared';
import { InfoPanelComponent } from '@ui/shared/modules/info-panel/components/info-panel/info-panel.component';
import { InfoPanelSubtitleDirective } from '@ui/shared/modules/info-panel/directives';

@Component({
  selector: 'upf-vehicle-branding-period-control-form-success',
  standalone: true,
  imports: [
    MatAnchor,
    StatusBadgeComponent,
    TranslateModule,
    RouterLink,
    NgOptimizedImage,
    InfoPanelComponent,
    InfoPanelSubtitleDirective,
  ],
  templateUrl: './vehicle-branding-period-control-form-success.component.html',
  styleUrl: './vehicle-branding-period-control-form-success.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleBrandingPeriodControlFormSuccessComponent implements OnDestroy {
  public readonly route = inject(ActivatedRoute);
  private readonly uiService = inject(UIService);

  public readonly path = CorePaths;
  public readonly vehiclePath = VehiclePaths;

  public readonly licensePlate = this.route.snapshot.queryParamMap.get('licensePlate');
  public readonly vehicleId = this.route.snapshot.paramMap.get('vehicleId');

  constructor() {
    this.uiService.setConfig({
      header: {
        title: false,
        backNavigationButton: true,
        backRoute: {
          url: [CorePaths.WORKSPACE, CorePaths.VEHICLES],
          extras: {
            fragment: 'vehicle-branding-tickets',
          },
        },
      },
    });
  }

  public ngOnDestroy(): void {
    this.uiService.resetConfig();
  }
}
