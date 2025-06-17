import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { LiveMapEmployeeDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { StatusBadgeComponent } from '@ui/shared';
import { DefaultImgSrcDirective } from '@ui/shared/directives/default-img-src/default-img-src.directive';
import { LOCATION_STATUS_STYLING } from '@ui/shared/modules/live-map-shared';
import { NgxTippyModule } from 'ngx-tippy-wrapper';

@Component({
  selector: 'upf-map-courier-details',
  standalone: true,
  imports: [StatusBadgeComponent, TranslateModule, DefaultImgSrcDirective, MatIcon, NgxTippyModule],
  templateUrl: './map-courier-details.component.html',
  styleUrls: ['./map-courier-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapCourierDetailsComponent {
  @Input() public employee: LiveMapEmployeeDto;
  @Input() public showStatus = false;

  public readonly statusStyling = LOCATION_STATUS_STYLING;
}
