import { OnDestroy, Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

const ON_LABEL_KEY = 'Common.Of';

@Injectable()
export class CustomMatPaginatorIntl extends MatPaginatorIntl implements OnDestroy {
  private readonly destroyed$ = new Subject<void>();
  private ofLabel: string;

  constructor(private readonly translateService: TranslateService) {
    super();
    this.translateService.onLangChange.pipe(takeUntil(this.destroyed$)).subscribe(() => {
      this.getAndInitTranslations();
    });

    this.getAndInitTranslations();
    this.nextPageLabel = '';
    this.previousPageLabel = '';
  }

  public ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  public override getRangeLabel = (page: number, pageSize: number, currentLength: number): string => {
    let length = currentLength;

    if (length === 0 || pageSize === 0) {
      return `0 ${this.ofLabel} ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} ${this.ofLabel} ${length}`;
  };

  private getAndInitTranslations(): void {
    this.translateService
      .get([ON_LABEL_KEY])
      .pipe(takeUntil(this.destroyed$))
      .subscribe((translation) => {
        this.ofLabel = translation[ON_LABEL_KEY];
        this.changes.next();
      });
  }
}
