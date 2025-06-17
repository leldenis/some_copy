export const isMockingData = (): boolean => {
  return !!Cypress.env('mock');
};

export enum AccountKind {
  DEFAULT = 'default',
  EMPTY = 'empty',
  NOTIFICATION_OWNER = 'notification_owner',
  NOTIFICATION_MANAGER = 'notification_manager',
  MERCHANT = 'merchant',
  PRIVATE_DRIVER = 'private_driver',
  GLOBAL_PARTNER_MODERATOR = 'global_partner_moderator',
}

export const getAccountByKind = (kind = AccountKind.DEFAULT): { username: string; password: string } | undefined => {
  return Cypress.env('account')?.[kind];
};
