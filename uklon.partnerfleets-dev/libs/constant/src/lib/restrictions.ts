export enum RestrictionReason {
  CANCEL_FREQUENCY = 'CancelFrequency',
  BALANCE = 'Balance',
  ACTIVE_ORDERS_LIMIT = 'ActiveOrdersLimit',
  KARMA = 'Karma',
  MANAGER = 'Manager',
  FLEET = 'Fleet',
  TICKET = 'Ticket',
  ACTIVITY_RATE = 'ActivityRate',
  FINANCIAL_VERIFICATION = 'FinancialVerification',
  CASH_LIMIT = 'CashLimit',
}

export enum Restriction {
  FILTER_OFFER = 'FilterOffer',
  BROAD_CAST = 'BroadCast',
  FAST_SEARCH = 'FastSearch',
  SECTOR_QUEUE = 'SectorQueue',
  CASH = 'Cash',
  CASHLESS = 'Cashless',
  FINANCIAL_VERIFICATION = 'FinancialVerification',
}

export enum DriverFinanceAllowing {
  UKLON_MANAGER = 'UklonManager',
  FLEET_OWNER = 'FleetOwner',
}
