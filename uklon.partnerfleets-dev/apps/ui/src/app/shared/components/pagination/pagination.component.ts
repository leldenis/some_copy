import { AsyncPipe } from '@angular/common';
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { Store } from '@ngrx/store';
import { CustomMatPaginatorIntl } from '@ui/shared/components/pagination/pagination.intl';
import { paginationActions } from '@ui/shared/components/pagination/store/pagination.actions';
import { PaginationState } from '@ui/shared/components/pagination/store/pagination.reducer';
import { getPagination } from '@ui/shared/components/pagination/store/pagination.selectors';
import { PaginationDto } from '@ui/shared/models/pagination.dto';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'upf-pagination',
  standalone: true,
  imports: [MatPaginator, AsyncPipe],
  providers: [
    {
      provide: MatPaginatorIntl,
      useClass: CustomMatPaginatorIntl,
    },
  ],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  @Input() public totalCount: number;

  public pagination$ = this.paginationStore.select(getPagination).pipe(
    tap((pagination: PaginationDto) => {
      this.pagination = pagination;
    }),
  );
  private pagination: PaginationDto;

  constructor(private readonly paginationStore: Store<PaginationState>) {}

  public onPageChange(page: { length: number; pageIndex: number; pageSize: number; previousPageIndex?: number }): void {
    this.paginationStore.dispatch(
      paginationActions.setPagination({
        offset: page.pageIndex * this.pagination.limit,
        limit: this.pagination.limit,
      }),
    );
  }
}
