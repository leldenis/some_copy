import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { CommissionProgramsParticipantType, CommissionProgramType } from '@constant';
import { TranslateModule } from '@ngx-translate/core';
import { StorageFiltersKey, StorageService } from '@ui/core/services/storage.service';

@Component({
  selector: 'upf-commission-programs-sub-tabs',
  standalone: true,
  imports: [CommonModule, MatButton, TranslateModule],
  templateUrl: './commission-programs-sub-tabs.component.html',
  styleUrl: './commission-programs-sub-tabs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommissionProgramsSubTabsComponent implements OnInit {
  public readonly participantType = input<CommissionProgramsParticipantType>(CommissionProgramsParticipantType.DRIVER);
  public readonly activatedProgramType = input.required<CommissionProgramType>();

  public readonly changeProgramType = output<CommissionProgramType>();

  private readonly storageActiveTabKey = computed(() =>
    this.participantType() === CommissionProgramsParticipantType.DRIVER
      ? StorageFiltersKey.DRIVER_ACTIVE_COMMISSION_TAB
      : StorageFiltersKey.VEHICLE_ACTIVE_COMMISSION_TAB,
  );

  public readonly programTypes = CommissionProgramType;

  private readonly storage = inject(StorageService);

  public ngOnInit(): void {
    const activeTab: CommissionProgramType = this.storage.get(this.storageActiveTabKey());
    this.handlerProgramType(activeTab || CommissionProgramType.ACTIVE);
  }

  public handlerProgramType(programType: CommissionProgramType): void {
    this.storage.set(this.storageActiveTabKey(), programType);
    this.changeProgramType.emit(programType);
  }
}
