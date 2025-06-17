import { CorePaths } from '@ui/core/models/core-paths';

export const FINANCE_WALLET_TAB = `${CorePaths.WORKSPACE}/${CorePaths.FINANCE}#wallet`;
export const FINANCE_BALANCE_TAB = `${CorePaths.WORKSPACE}/${CorePaths.FINANCE}#wallets`;
export const FINANCE_TRANSACTIONS_TAB = `${CorePaths.WORKSPACE}/${CorePaths.FINANCE}#transactios`;
export const FINANCE_CASH_LIMITS_TAB = `${CorePaths.WORKSPACE}/${CorePaths.FINANCE}#cash-limits`;

export const FINANCE_TABS = [
  FINANCE_WALLET_TAB,
  FINANCE_BALANCE_TAB,
  FINANCE_TRANSACTIONS_TAB,
  FINANCE_TRANSACTIONS_TAB,
];

export const FINANCE_TRANSACTION_OFFSET = 0;
export const FINANCE_TRANSACTION_LIMIT = 30;
