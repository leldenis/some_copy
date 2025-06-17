import { TicketStatus } from '@constant';

interface Query {
  status?: TicketStatus | TicketStatus[];
}

export const addBlockedByManagerStatus = <T extends Query>(query: T): T => {
  let statuses = [];

  if (query?.status) {
    statuses = Array.isArray(query.status) ? query.status : [query.status];
  }

  if (
    statuses.length === 0 ||
    (!statuses.includes(TicketStatus.REVIEW) && !statuses.includes(TicketStatus.BLOCKED_BY_MANAGER))
  ) {
    return query;
  }

  return {
    ...query,
    status: [...new Set([...statuses, TicketStatus.REVIEW, TicketStatus.BLOCKED_BY_MANAGER])],
  };
};
