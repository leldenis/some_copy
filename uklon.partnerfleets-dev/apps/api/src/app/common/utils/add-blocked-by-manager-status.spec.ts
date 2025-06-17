import { addBlockedByManagerStatus } from '@api/common/utils/add-blocked-by-manager-status';
import { TicketStatus } from '@constant';

describe('addBlockedByManagerStatus', () => {
  it('should return unmodified query if there is no status', () => {
    const query = addBlockedByManagerStatus({ license_plate: '1' } as any);

    expect(query.license_plate).toMatch('1');
    expect(query).not.toHaveProperty('status');
  });

  it('should return unmodified query if statuses array is empty', () => {
    const query = addBlockedByManagerStatus({ license_plate: '2', status: [] });

    expect(query.license_plate).toMatch('2');
    expect(query.status).toHaveLength(0);
  });

  it('should return unmodified query if status is not Review or BlockedByManager', () => {
    const query = addBlockedByManagerStatus({ license_plate: '3', status: TicketStatus.DRAFT });

    expect(query.license_plate).toMatch('3');
    expect(query.status).toBe(TicketStatus.DRAFT);
  });

  it('should return unmodified query if status array includes both Review and BlockedByManager statuses', () => {
    const query = addBlockedByManagerStatus({
      license_plate: '4',
      status: [TicketStatus.REVIEW, TicketStatus.BLOCKED_BY_MANAGER],
    });

    expect(query.license_plate).toMatch('4');
    expect(query.status).toHaveLength(2);
    expect(query.status).toEqual([TicketStatus.REVIEW, TicketStatus.BLOCKED_BY_MANAGER]);
  });

  it('should return unmodified query if status array doesnt include Review or BlockedByManager statuses', () => {
    const query = addBlockedByManagerStatus({
      license_plate: '5',
      status: [
        TicketStatus.DRAFT,
        TicketStatus.SENT,
        TicketStatus.CLARIFICATION,
        TicketStatus.REJECTED,
        TicketStatus.APPROVED,
      ],
    });

    expect(query.license_plate).toMatch('5');
    expect(query.status).toHaveLength(5);
    expect(query.status).toEqual([
      TicketStatus.DRAFT,
      TicketStatus.SENT,
      TicketStatus.CLARIFICATION,
      TicketStatus.REJECTED,
      TicketStatus.APPROVED,
    ]);
  });

  it('should add Review status if query status is BlockedByManager', () => {
    const query = addBlockedByManagerStatus({
      license_plate: '6',
      status: TicketStatus.BLOCKED_BY_MANAGER,
    });

    expect(query.license_plate).toMatch('6');
    expect(query.status).toHaveLength(2);
    expect(query.status).toEqual([TicketStatus.BLOCKED_BY_MANAGER, TicketStatus.REVIEW]);
  });

  it('should add BlockedByManager status if query status is Review', () => {
    const query = addBlockedByManagerStatus({
      license_plate: '7',
      status: TicketStatus.BLOCKED_BY_MANAGER,
    });

    expect(query.license_plate).toMatch('7');
    expect(query.status).toHaveLength(2);
    expect(query.status).toEqual([TicketStatus.BLOCKED_BY_MANAGER, TicketStatus.REVIEW]);
  });

  it('should add BlockedByManager status if query status array includes Review', () => {
    const query = addBlockedByManagerStatus({
      license_plate: '8',
      status: [TicketStatus.DRAFT, TicketStatus.REVIEW],
    });

    expect(query.license_plate).toMatch('8');
    expect(query.status).toHaveLength(3);
    expect(query.status).toEqual([TicketStatus.DRAFT, TicketStatus.REVIEW, TicketStatus.BLOCKED_BY_MANAGER]);
  });

  it('should add Review status if query status array includes BlockedByManager', () => {
    const query = addBlockedByManagerStatus({
      license_plate: '9',
      status: [TicketStatus.DRAFT, TicketStatus.BLOCKED_BY_MANAGER],
    });

    expect(query.license_plate).toMatch('9');
    expect(query.status).toHaveLength(3);
    expect(query.status).toEqual([TicketStatus.DRAFT, TicketStatus.BLOCKED_BY_MANAGER, TicketStatus.REVIEW]);
  });
});
