import { SelectionModel } from '@angular/cdk/collections';
import { CdkTableModule } from '@angular/cdk/table';
import { DecimalPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { DashboardStatisticsTopDriverDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { CorePaths } from '@ui/core/models/core-paths';
import { DriverPaths } from '@ui/modules/drivers/models/driver-paths';
import { EmptyStateComponent } from '@ui/shared/components/empty-state/empty-state.component';
import { EmptyStates } from '@ui/shared/components/empty-state/empty-states';
import { MoneyPipe } from '@ui/shared/pipes/money';

@Component({
  selector: 'upf-top-drivers',
  standalone: true,
  imports: [
    NgClass,
    DecimalPipe,
    TranslateModule,
    CdkTableModule,
    MatIconModule,
    MatDividerModule,
    RouterModule,
    MatIconButton,
    MoneyPipe,
    EmptyStateComponent,
  ],
  templateUrl: './top-drivers.component.html',
  styleUrls: ['./top-drivers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopDriversComponent {
  public readonly drivers = input.required<DashboardStatisticsTopDriverDto[]>();

  public readonly driverDetailsPath = `/${CorePaths.WORKSPACE}/${CorePaths.DRIVERS}/${DriverPaths.DETAILS}`;
  public emptyState = EmptyStates;
  public selection: SelectionModel<number> = new SelectionModel(true, []);
  public columns = ['Driver', 'OrdersCount', 'CancellationRate', 'Income', 'Rating', 'Karma', 'Toggle', 'ExpandedView'];
}
