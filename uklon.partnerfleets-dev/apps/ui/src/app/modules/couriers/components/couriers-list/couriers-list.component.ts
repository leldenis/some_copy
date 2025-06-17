import { SelectionModel } from '@angular/cdk/collections';
import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CourierItemDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { CorePaths } from '@ui/core/models/core-paths';
import { CourierPaths } from '@ui/modules/couriers/models/courier-paths';
import { ShowCourierRestrictionsPipe } from '@ui/modules/couriers/pipes/show-courier-restrictions.pipe';
import { NgxTippyModule } from 'ngx-tippy-wrapper';

@Component({
  selector: 'upf-couriers-list',
  standalone: true,
  imports: [
    CommonModule,
    CdkTableModule,
    TranslateModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    NgxTippyModule,
    ShowCourierRestrictionsPipe,
  ],
  templateUrl: './couriers-list.component.html',
  styleUrls: ['./couriers-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CouriersListComponent {
  @Input() public couriers: CourierItemDto[] = [];

  public readonly corePaths = CorePaths;
  public readonly courierPaths = CourierPaths;
  public readonly columns = ['FullName', 'Phone', 'Rating', 'ActivityRate', 'Toggle', 'ExpandedView'];
  public readonly selection = new SelectionModel<number>();

  public toggle(value: number): void {
    this.selection.toggle(value);
  }
}
