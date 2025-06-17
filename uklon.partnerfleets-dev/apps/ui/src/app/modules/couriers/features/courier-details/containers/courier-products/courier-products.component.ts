import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { CourierProductDto } from '@data-access';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { courierDetailsActions } from '@ui/modules/couriers/features/courier-details/store/courier-details.actions';
import { CourierDetailsState } from '@ui/modules/couriers/features/courier-details/store/courier-details.reducer';
import {
  getCourierProducts,
  getCourierProductsPending,
} from '@ui/modules/couriers/features/courier-details/store/courier-details.selectors';
import { NormalizeStringPipe } from '@ui/shared';

@Component({
  selector: 'upf-courier-products',
  standalone: true,
  imports: [TranslateModule, AsyncPipe, MatSlideToggle, NormalizeStringPipe],
  templateUrl: './courier-products.component.html',
  styleUrls: ['./courier-products.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourierProductsComponent implements OnInit {
  public products$ = this.store.select(getCourierProducts);
  public pending$ = this.store.select(getCourierProductsPending);

  constructor(private readonly store: Store<CourierDetailsState>) {}

  public ngOnInit(): void {
    this.store.dispatch(courierDetailsActions.getFleetCourierProducts());
  }

  public toggleProduct(product: CourierProductDto): void {
    this.store.dispatch(
      courierDetailsActions.updateFleetCourierProducts({
        items: [
          {
            product_id: product.product.id,
            is_available: !product.availability.is_available,
          },
        ],
      }),
    );
  }
}
