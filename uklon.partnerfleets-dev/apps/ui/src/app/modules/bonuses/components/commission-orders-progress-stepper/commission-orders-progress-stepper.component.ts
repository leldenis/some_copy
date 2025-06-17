import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommissionRateDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'upf-commission-orders-progress-stepper',
  standalone: true,
  imports: [MatIconModule, TranslateModule],
  templateUrl: './commission-orders-progress-stepper.component.html',
  styleUrl: './commission-orders-progress-stepper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommissionOrdersProgressStepperComponent {
  @Input() public completedOrders = 0;
  @Input() public commissions: CommissionRateDto[] = [];
  @Input() public theme: 'green' | 'black' = 'green';
  @Input() public skipActiveSteps = false;

  public stepCompleted(step: CommissionRateDto, isLast: boolean): boolean {
    return (
      !this.skipActiveSteps &&
      this.completedOrders > step.order_completed_count_range.from &&
      this.completedOrders >= step.order_completed_count_range.to &&
      !isLast
    );
  }

  public stepInProgress(step: CommissionRateDto, isLast: boolean): boolean {
    return (
      (!this.skipActiveSteps &&
        this.completedOrders >= step.order_completed_count_range.from &&
        this.completedOrders < step.order_completed_count_range.to) ||
      (this.completedOrders >= step.order_completed_count_range.to && isLast)
    );
  }

  public stepNotStarted(step: CommissionRateDto): boolean {
    return this.skipActiveSteps || this.completedOrders < step.order_completed_count_range.from;
  }
}
