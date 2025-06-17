import { AsyncPipe } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, Input, OnDestroy } from '@angular/core';
import {
  UntypedFormArray,
  UntypedFormControl,
  ValidationErrors,
  UntypedFormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { ActivatedRoute } from '@angular/router';
import { FleetDto, VehicleProductConfigurationDto } from '@data-access';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { vehiclesActions } from '@ui/modules/vehicles/store/vehicles/vehicles.actions';
import { VehiclesState } from '@ui/modules/vehicles/store/vehicles/vehicles.reducer';
import * as vehiclesSelectors from '@ui/modules/vehicles/store/vehicles/vehicles.selectors';
import { NormalizeStringPipe } from '@ui/shared';
import { Subject, tap } from 'rxjs';

@Component({
  selector: 'upf-vehicle-products',
  standalone: true,
  imports: [TranslateModule, AsyncPipe, ReactiveFormsModule, MatSlideToggle, NormalizeStringPipe, MatButton],
  templateUrl: './vehicle-products.component.html',
  styleUrls: ['./vehicle-products.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleProductsComponent implements OnInit, OnDestroy {
  @Input() public fleet: FleetDto;
  @Input() public isVehicleBlocked: boolean;

  public products$ = this.vehiclesStore.select(vehiclesSelectors.getFleetVehicleProductConfigurations).pipe(
    tap((products: VehicleProductConfigurationDto[]) => {
      if (products) {
        this.productsList = products;
        this.setProducts(products);
      }
    }),
  );
  public vehicleId: string;
  public productsFormArray: UntypedFormArray;
  public productsList: VehicleProductConfigurationDto[] = [];

  private readonly destroyed$ = new Subject<void>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly vehiclesStore: Store<VehiclesState>,
  ) {}

  public ngOnInit(): void {
    this.vehicleId = this.route.snapshot.paramMap.get('vehicleId');
    this.vehiclesStore.dispatch(
      vehiclesActions.getFleetVehicleProductConfigurations({
        fleetId: this.fleet.id,
        vehicleId: this.vehicleId,
      }),
    );
  }

  public ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  public getFormGroup(index: number): UntypedFormGroup {
    return this.productsFormArray.controls[index] as UntypedFormGroup;
  }

  public setProducts(products: VehicleProductConfigurationDto[]): void {
    this.productsFormArray = new UntypedFormArray([]);

    products.forEach((product) => {
      const form = new UntypedFormGroup({
        product_id: new UntypedFormControl(product?.product?.id),
        is_available: new UntypedFormControl({
          value: product.is_available,
          disabled: !product.is_editable || this.isVehicleBlocked,
        }),
      });
      this.productsFormArray.push(form);
    });

    this.productsFormArray.setValidators(
      this.isValueChangedValidator(products, this.productsFormArray.controls as UntypedFormGroup[]),
    );
    this.productsFormArray.updateValueAndValidity();
  }

  public updateProductsConfiguration(): void {
    const changedProducts = this.productsFormArray.value.filter(
      (product: { id: string; is_available: boolean }, index: number) =>
        product?.is_available !== this.productsList[index].is_available,
    );
    const payload = {
      vehicleId: this.vehicleId,
      fleetId: this.fleet.id,
      body: {
        items: changedProducts,
      },
    };

    this.vehiclesStore.dispatch(vehiclesActions.updateFleetVehicleProductConfigurations(payload));
  }

  private isValueChangedValidator(defaultData: VehicleProductConfigurationDto[], forms: UntypedFormGroup[] = null) {
    return (): ValidationErrors | null => {
      if (!forms) {
        return null;
      }
      const result = forms.some(
        (form: UntypedFormGroup, index: number) =>
          form.controls['is_available']?.value !== defaultData[index].is_available,
      );
      return result ? null : { valueChangedError: true };
    };
  }
}
