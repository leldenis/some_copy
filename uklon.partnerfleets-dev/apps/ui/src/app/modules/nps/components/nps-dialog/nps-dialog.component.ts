import { SelectionModel } from '@angular/cdk/collections';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { DOCUMENT, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, Inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AnalyticsNPS, FleetAnalyticsEventType, SurveyMark } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { StorageService, userRoleKey } from '@ui/core/services/storage.service';
import { NgxTippyModule } from 'ngx-tippy-wrapper';

const MAX_COMMENT_LENGTH = 5000;

@Component({
  selector: 'upf-nps-dialog',
  standalone: true,
  imports: [
    NgClass,
    MatDialogModule,
    MatDividerModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    CdkTextareaAutosize,
    MatCheckboxModule,
    MatButtonModule,
    TranslateModule,
    NgxTippyModule,
  ],
  templateUrl: './nps-dialog.component.html',
  styleUrl: './nps-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NpsDialogComponent implements OnInit {
  public readonly eventType = FleetAnalyticsEventType;
  public marks = Array.from({ length: 10 }).map((_, index) => index + 1);
  public readonly surveyMark = SurveyMark;

  public readonly markSelection = new SelectionModel<string>(false, []);
  public readonly npsForm = new FormGroup({
    mark: new FormControl<string>(null, Validators.required),
    comment: new FormControl<string>('', Validators.maxLength(MAX_COMMENT_LENGTH)),
    skip: new FormControl<boolean>(false),
  });
  constructor(
    private readonly dialogRef: MatDialogRef<NpsDialogComponent>,
    private readonly analytics: AnalyticsService,
    private readonly storage: StorageService,
    private readonly destroyRef: DestroyRef,
    @Inject(DOCUMENT) private readonly document: Document,
  ) {}

  private get userRole(): string {
    return this.storage.get(userRoleKey);
  }

  public ngOnInit(): void {
    this.handleBackdropClick();
    this.reportAnalytics(this.eventType.NPS_DIALOG_OPENED, { url: this.document.location.pathname });
  }

  public selectMark(mark: string): void {
    this.markSelection.toggle(mark);
    const [selected] = this.markSelection.selected;
    this.npsForm.get('mark').setValue(selected || null);

    this.reportAnalytics(this.eventType.NPS_DIALOG_MARK_CHANGE, {
      mark,
      mark_state: this.npsForm.get('mark').value ? 'selected' : 'unselected',
    });
  }

  public closeDialog(answered: boolean): void {
    this.reportDialogClose(answered);
    const { value } = this.npsForm;
    this.dialogRef.close(answered || value.skip ? value : null);
  }

  public reportAnalytics(eventType: FleetAnalyticsEventType, props: AnalyticsNPS = {}): void {
    this.analytics.reportEvent<AnalyticsNPS>(eventType, { user_access: this.userRole, ...props });
  }

  private handleBackdropClick(): void {
    this.dialogRef
      .backdropClick()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.reportAnalytics(this.eventType.NPS_DIALOG_BACKDROP_CLICK));
  }

  private reportDialogClose(answered: boolean): void {
    const { skip, mark } = this.npsForm.value;

    if (answered) {
      this.reportAnalytics(this.eventType.NPS_DIALOG_SUBMIT, { mark });
      return;
    }

    skip
      ? this.reportAnalytics(this.eventType.NPS_DIALOG_CLOSE_BTN_CLICK, { url: this.document.location.pathname })
      : this.reportAnalytics(this.eventType.NPS_DIALOG_LATER_BTN_CLICK);
  }
}
