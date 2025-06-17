import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActiveSurveyDto, SurveyResponseDto } from '@data-access';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '@ui/core/services/toast.service';
import { NpsDialogComponent } from '@ui/modules/nps';
import { finalize, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SurveysService {
  private dialogRef: MatDialogRef<NpsDialogComponent, SurveyResponseDto>;

  constructor(
    private readonly http: HttpClient,
    private readonly dialog: MatDialog,
    private readonly toastService: ToastService,
    private readonly injector: Injector,
  ) {}

  public getActiveSurvey(): Observable<ActiveSurveyDto> {
    return this.http.get<ActiveSurveyDto>(`api/surveys/active`).pipe(catchError((error) => throwError(() => error)));
  }

  public sendSurveyResponse(surveyId: string, survey: SurveyResponseDto): Observable<void> {
    return this.http
      .post<void>(`api/surveys/${surveyId}/send`, survey)
      .pipe(catchError((error) => throwError(() => error)));
  }

  public markSurveyAsSkipped(surveyId: string): Observable<void> {
    return this.http
      .post<void>(`api/surveys/${surveyId}/skip`, {})
      .pipe(catchError((error) => throwError(() => error)));
  }

  public getNPS(): void {
    if (this.dialogRef) return;

    this.getActiveSurvey()
      .pipe(
        filter(Boolean),
        switchMap(({ id }) => this.handleNPS(id)),
        finalize(() => {
          this.dialogRef = null;
        }),
      )
      .subscribe();
  }

  private handleNPS(surveyId: string): Observable<void> {
    this.dialogRef = this.dialog.open(NpsDialogComponent, {
      panelClass: ['nps-dialog', '!tw-max-w-full'],
      autoFocus: false,
    });

    return this.dialogRef.afterClosed().pipe(
      filter(Boolean),
      switchMap((response) => {
        if (!response.mark) return this.markSurveyAsSkipped(surveyId);

        return this.sendSurveyResponse(surveyId, response).pipe(
          finalize(() =>
            this.toastService.success(this.injector.get(TranslateService).instant('NPS.SuccessNotification')),
          ),
        );
      }),
    );
  }
}
