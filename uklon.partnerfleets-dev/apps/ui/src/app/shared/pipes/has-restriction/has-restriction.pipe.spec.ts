import { Restriction, RestrictionReason } from '@constant';
import { EmployeeRestrictionDetailsDto, EmployeeRestrictionItemDto } from '@data-access';
import { HasRestrictionPipe } from '@ui/shared';

const RESTRICTION_ITEM = (fleet_id = ''): EmployeeRestrictionItemDto => ({
  fleet_id,
  type: Restriction.CASH,
});
const RESTRICTION = (restricted_by: RestrictionReason, fleetId: string): EmployeeRestrictionDetailsDto => ({
  restricted_by,
  restriction_items: [RESTRICTION_ITEM(fleetId)],
});

describe('HasRestrictionPipe', () => {
  let pipe: HasRestrictionPipe;

  beforeEach(() => {
    pipe = new HasRestrictionPipe();
  });

  it('should return null if restrictionReason is nor found', () => {
    const restrictions = [RESTRICTION(RestrictionReason.CASH_LIMIT, '*')];
    const result = pipe.transform(restrictions, RestrictionReason.BALANCE, '');

    expect(result).toBeNull();
  });

  it('should return null if fleetId does not match', () => {
    const restrictions = [RESTRICTION(RestrictionReason.CASH_LIMIT, '*')];
    const result = pipe.transform(restrictions, RestrictionReason.CASH_LIMIT, 'test');

    expect(result).toBeNull();
  });

  it('should return null if restrictions are empty', () => {
    const result = pipe.transform([], RestrictionReason.BALANCE, '');

    expect(result).toBeNull();
  });

  it('should return null if restrictions are undefined or null', () => {
    const result = pipe.transform(undefined, RestrictionReason.BALANCE, '');
    expect(result).toBeNull();

    const result2 = pipe.transform(null, RestrictionReason.BALANCE, '');
    expect(result2).toBeNull();
  });

  it('should return restriction object if restrictedBy and some of fleetIds match', () => {
    const restrictions = [
      RESTRICTION(RestrictionReason.CASH_LIMIT, 'test'),
      RESTRICTION(RestrictionReason.MANAGER, '*'),
    ];
    const result = pipe.transform(restrictions, RestrictionReason.CASH_LIMIT, 'test');
    const result2 = pipe.transform(restrictions, RestrictionReason.MANAGER, '*');

    expect(result?.restricted_by).toBe(RestrictionReason.CASH_LIMIT);
    expect(result2?.restricted_by).toBe(RestrictionReason.MANAGER);
  });

  it('should return restriction object if restrictedBy match and no fleetId is present in restrictions array', () => {
    const restrictions = [RESTRICTION(RestrictionReason.CASH_LIMIT, ''), RESTRICTION(RestrictionReason.MANAGER, '')];
    const result = pipe.transform(restrictions, RestrictionReason.CASH_LIMIT, 'test');
    const result2 = pipe.transform(restrictions, RestrictionReason.MANAGER, 'test');

    expect(result?.restricted_by).toBe(RestrictionReason.CASH_LIMIT);
    expect(result2?.restricted_by).toBe(RestrictionReason.MANAGER);
  });
});
