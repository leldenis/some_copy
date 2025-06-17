import { ChangeDetectionStrategy, Component, DestroyRef, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIcon } from '@angular/material/icon';
import { BrandingBonusCalculationPeriodDto, BrandingCalculationsProgramDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { ToastService } from '@ui/core/services/toast.service';
import { BonusExportService } from '@ui/modules/bonuses/services/bonus-export.service';
import { BonusService } from '@ui/modules/bonuses/services/bonus.service';
import { CSVFileRef } from '@ui/shared';
import { LoaderButtonComponent } from '@ui/shared/components/loader-button/loader-button.component';
import { CSVFileLoadingService, CSVFileType } from '@ui/shared/services/csv-file-loading.service';
import { ICONS } from '@ui/shared/tokens/icons.token';
import { map } from 'rxjs/operators';

@Component({
  selector: 'upf-branding-bonus-export-btn',
  standalone: true,
  imports: [LoaderButtonComponent, MatIcon, TranslateModule],
  templateUrl: './branding-bonus-export-btn.component.html',
  styleUrl: './branding-bonus-export-btn.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandingBonusExportBtnComponent {
  public readonly fleetId = input.required<string>();
  public readonly calculation = input.required<BrandingBonusCalculationPeriodDto>();
  public readonly vehicleId = input.required<string>();
  public readonly programDetails = input<BrandingCalculationsProgramDto>();
  public readonly disabled = input.required<boolean>();
  public readonly loading = input.required<boolean>();

  public readonly icons = inject(ICONS);
  private readonly csvFileLoadingService = inject(CSVFileLoadingService);
  private readonly bonusService = inject(BonusService);
  private readonly bonusExportService = inject(BonusExportService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastService = inject(ToastService);

  public exportFile(): void {
    this.csvFileLoadingService.startLoading(CSVFileType.BRANDING_BONUS);

    const csvFileBonusProgramsCalculationsData = this.bonusService
      .getBrandingProgramsCalculations(this.calculation()?.calculation_id, this.fleetId(), this.vehicleId())
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map((collection) =>
          this.bonusExportService.convertToCsv(collection.items, this.programDetails(), this.calculation()?.period),
        ),
      );

    const fileName = this.bonusExportService.getFilename();
    const csvRef = new CSVFileRef(csvFileBonusProgramsCalculationsData, fileName, (fileData: string) => {
      this.bonusExportService.downloadFile(fileName, fileData);
    });

    csvRef
      .hasError()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.toastService.error('Bonuses.CSV.Notification.Error');
        this.csvFileLoadingService.finishLoading(CSVFileType.BRANDING_BONUS);
      });

    csvRef
      .isSuccessful()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((filename) => {
        this.toastService.success('Bonuses.CSV.Notification.Success', { filename });
        this.csvFileLoadingService.finishLoading(CSVFileType.BRANDING_BONUS);
      });

    csvRef.download();
  }
}
