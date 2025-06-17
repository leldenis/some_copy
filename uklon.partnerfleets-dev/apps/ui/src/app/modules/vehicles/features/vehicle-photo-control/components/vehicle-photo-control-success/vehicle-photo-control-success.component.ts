import { AsyncPipe } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { MatAnchor } from '@angular/material/button';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CorePaths } from '@ui/core/models/core-paths';
import { VehiclePaths } from '@ui/modules/vehicles/models/vehicle-paths';
import { StatusBadgeComponent, UIService } from '@ui/shared';
import { InfoPanelComponent } from '@ui/shared/modules/info-panel/components/info-panel/info-panel.component';
import { InfoPanelSubtitleDirective } from '@ui/shared/modules/info-panel/directives';
import { Observable, filter, map } from 'rxjs';

interface PhotoControlQueryParams {
  license_plate: string;
  vehicle_id: string;
}

@Component({
  selector: 'upf-vehicle-photo-control-success',
  standalone: true,
  imports: [
    StatusBadgeComponent,
    TranslateModule,
    InfoPanelComponent,
    RouterLink,
    MatAnchor,
    InfoPanelSubtitleDirective,
    AsyncPipe,
  ],
  templateUrl: './vehicle-photo-control-success.component.html',
  styleUrls: ['./vehicle-photo-control-success.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehiclePhotoControlSuccessComponent implements AfterViewInit, OnDestroy {
  @ViewChild('headerTpl')
  public headerTpl: TemplateRef<unknown>;

  public readonly path = CorePaths;
  public readonly vehiclePath = VehiclePaths;
  public readonly data$: Observable<PhotoControlQueryParams> = this.route.queryParamMap.pipe(
    filter(Boolean),
    map((params) => ({
      license_plate: params.get('license_plate'),
      vehicle_id: params.get('vehicle_id'),
    })),
  );

  constructor(
    private readonly uiService: UIService,
    private readonly route: ActivatedRoute,
  ) {}

  public ngAfterViewInit(): void {
    this.initShellConfig();
  }

  public ngOnDestroy(): void {
    this.uiService.resetConfig();
  }

  private initShellConfig(): void {
    this.uiService.setConfig({
      header: {
        title: false,
        branding: false,
        backNavigationButton: false,
        hideTitleOnMobile: true,
        template: this.headerTpl,
      },
    });
  }
}
