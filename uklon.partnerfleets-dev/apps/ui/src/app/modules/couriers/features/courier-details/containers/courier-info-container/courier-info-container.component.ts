import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { CourierDetailsDto, CourierRestrictionDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { CourierActivityComponent } from '@ui/modules/couriers/features/courier-details/components/courier-activity/courier-activity.component';
import { CourierDataComponent } from '@ui/modules/couriers/features/courier-details/components/courier-data/courier-data.component';
import { CourierInfoComponent } from '@ui/modules/couriers/features/courier-details/components/courier-info/courier-info.component';
import { ProfileRemoveBtnComponent } from '@ui/shared/components/profile-remove-btn/profile-remove-btn.component';
import { EmployeeRestrictionPanelComponent } from '@ui/shared/modules/restrictions-shared/components/employee-restriction-panel/employee-restriction-panel.component';

@Component({
  selector: 'upf-courier-info-container',
  standalone: true,
  imports: [
    CourierInfoComponent,
    CourierActivityComponent,
    EmployeeRestrictionPanelComponent,
    CourierDataComponent,
    MatDivider,
    ProfileRemoveBtnComponent,
    TranslateModule,
  ],
  templateUrl: './courier-info-container.component.html',
  styleUrls: ['./courier-info-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourierInfoContainerComponent {
  @Input() public courier: CourierDetailsDto;
  @Input() public restrictions: CourierRestrictionDto[];

  @Output() public removeCourier = new EventEmitter<void>();
}
