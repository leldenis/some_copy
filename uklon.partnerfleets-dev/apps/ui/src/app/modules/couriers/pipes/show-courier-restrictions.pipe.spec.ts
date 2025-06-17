import { Restriction, RestrictionReason } from '@constant';
import { EmployeeRestrictionDetailsDto } from '@data-access';
import { ShowCourierRestrictionsPipe } from '@ui/modules/couriers/pipes/show-courier-restrictions.pipe';

describe('ShowCourierRestrictionsPipe', () => {
  let pipe: ShowCourierRestrictionsPipe;

  beforeEach(() => {
    pipe = new ShowCourierRestrictionsPipe();
  });

  it('should be created', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return false if no restrictions', () => {
    const restrictions: EmployeeRestrictionDetailsDto[] = [];
    expect(pipe.transform(restrictions)).toBe(false);
  });

  it('should return true if restrictions contain Cash or ActivityRate', () => {
    const restrictions: EmployeeRestrictionDetailsDto[] = [
      {
        restricted_by: RestrictionReason.CANCEL_FREQUENCY,
        restriction_items: [{ fleet_id: '18b0f255-3a0a-4d00-aedc-d204667c3fbd', type: Restriction.BROAD_CAST }],
      },
      {
        restricted_by: RestrictionReason.ACTIVITY_RATE,
        restriction_items: [{ fleet_id: '2c854e0f-b08a-4447-9e2b-25b1a90f2f93', type: Restriction.CASH }],
      },
    ];
    expect(pipe.transform(restrictions)).toBe(true);
  });

  it('should return false if restrictions do not contain Cash or ActivityRate', () => {
    const restrictions: EmployeeRestrictionDetailsDto[] = [
      {
        restricted_by: RestrictionReason.CANCEL_FREQUENCY,
        restriction_items: [{ fleet_id: '18b0f255-3a0a-4d00-aedc-d204667c3fbd', type: Restriction.BROAD_CAST }],
      },
      {
        restricted_by: RestrictionReason.BALANCE,
        restriction_items: [{ fleet_id: '2c854e0f-b08a-4447-9e2b-25b1a90f2f93', type: Restriction.CASHLESS }],
      },
    ];
    expect(pipe.transform(restrictions)).toBe(false);
  });
});
