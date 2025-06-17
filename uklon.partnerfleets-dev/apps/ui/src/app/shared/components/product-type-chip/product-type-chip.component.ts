import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { OrderStatus } from '@constant';
import { GatewayOrderProductConditionDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { NormalizeStringPipe } from '@ui/shared';
import { NgxTippyModule } from 'ngx-tippy-wrapper';

interface ProductDeliveryCondition {
  main: GatewayOrderProductConditionDto;
  additional: GatewayOrderProductConditionDto[];
}

const EXCLUDE_PRODUCT_CONDITIONS = new Set(['delivery_type', 'door', 'confirmation_code']);

const mapConditions = (conditions: GatewayOrderProductConditionDto[]): ProductDeliveryCondition => {
  return {
    main: conditions.find((item) => item.name === 'delivery_type'),
    additional: conditions.filter((item) => item.name && !EXCLUDE_PRODUCT_CONDITIONS.has(item.name)),
  };
};

@Component({
  selector: 'upf-product-type-chip',
  standalone: true,
  imports: [CommonModule, NgxTippyModule, TranslateModule, NormalizeStringPipe],
  templateUrl: './product-type-chip.component.html',
  styleUrl: './product-type-chip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductTypeChipComponent {
  @Input() public productType: string;
  @Input({ transform: (conditions: GatewayOrderProductConditionDto[] = []) => mapConditions(conditions) })
  public conditions: ProductDeliveryCondition = { main: null, additional: [] };

  @Input() public orderStatus: OrderStatus;

  public get showDeliveryConditions(): boolean {
    return this.productType === 'delivery' && !!this.conditions?.main;
  }

  public get orderStatusCanceled(): boolean {
    return this?.orderStatus === OrderStatus.CANCELED;
  }
}
