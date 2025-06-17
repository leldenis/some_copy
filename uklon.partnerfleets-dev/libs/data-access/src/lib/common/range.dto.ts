import { UNIXDate } from '@uklon/fleets/angular/cdk';

export interface DateRangeDto<T = UNIXDate> {
  from: T;
  to: T;
}
