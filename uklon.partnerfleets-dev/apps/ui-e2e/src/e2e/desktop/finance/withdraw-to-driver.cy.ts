import { EmployeeWalletItemDto, FleetRole, FleetType, WithdrawalType } from '@data-access';

import { Currency } from '@uklon/types';

import { MeIntercept } from '../../../support/interceptor';
import { CashLimitsSettingsIntercept } from '../../../support/interceptor/finance/cash-limits';
import { FleetDriversWalletsIntercept } from '../../../support/interceptor/finance/drivers-wallets';
import { FleetWalletIntercept } from '../../../support/interceptor/finance/fleet-wallet';
import { IndividualEntrepreneursIntercept } from '../../../support/interceptor/finance/individual-entrepreneus';
import { FleetPaymentCardIntercept } from '../../../support/interceptor/finance/payment-card';
import { WithdrawToCardSettingsIncept } from '../../../support/interceptor/finance/withdraw-to-card-settings';
import { AccountKind, getAccountByKind, isMockingData } from '../../../support/utils';

const fleetId = '*';
const meData = new MeIntercept();
const fleetDriversWallets = new FleetDriversWalletsIntercept(fleetId);
const individualEntrepreneurs = new IndividualEntrepreneursIntercept(fleetId, true);
const withdrawToCardSettings = new WithdrawToCardSettingsIncept(fleetId);
const fleetWallet = new FleetWalletIntercept(fleetId);
const fleetPaymentCard = new FleetPaymentCardIntercept(fleetId);
const cashLimitsSettings = new CashLimitsSettingsIntercept(fleetId);
const driversWalletsBeforeTransfer: EmployeeWalletItemDto[] = [
  {
    driver_id: '6296c966-be87-4f7e-988b-40f218758d51',
    first_name: 'Aqadpilu404',
    last_name: 'Aqaafeyh404',
    phone: '380723659856',
    signal: 500_265,
    wallet: {
      id: '35554482-8b4f-4c80-ba71-18137a633f32',
      balance: {
        amount: 0,
        currency: Currency.UAH,
      },
    },
  },
  {
    driver_id: '73709b95-4a71-487a-bd1e-1bd3539f6a11',
    first_name: 'Aqasczqp',
    last_name: 'Aqaanmxf',
    phone: '380556532158',
    signal: 500_270,
    wallet: {
      id: 'ebe5c49b-c675-4331-b8c2-c0e417146aaa',
      balance: {
        amount: 100_000,
        currency: Currency.UAH,
      },
    },
  },
];
const driversWalletsAfterTransfer: EmployeeWalletItemDto[] = [
  {
    driver_id: '6296c966-be87-4f7e-988b-40f218758d51',
    first_name: 'Aqadpilu404',
    last_name: 'Aqaafeyh404',
    phone: '380723659856',
    signal: 500_265,
    wallet: {
      id: '35554482-8b4f-4c80-ba71-18137a633f32',
      balance: {
        amount: 0,
        currency: Currency.UAH,
      },
    },
  },
  {
    driver_id: 'd8b2481e-5e43-40b3-b9c5-119313c96da2',
    first_name: 'Aqasczqp',
    last_name: 'Aqaanmxf',
    phone: '380556532158',
    signal: 500_270,
    wallet: {
      id: 'ebe5c49b-c675-4331-b8c2-c0e417146aaa',
      balance: {
        amount: 200_000,
        currency: Currency.UAH,
      },
    },
  },
];

function enterAmount(row: string, amount: string): void {
  cy.getBySel(row).within(() => {
    cy.getBySel('amount-input').type(amount);
  });
}

function checkBalance(row: string, amount: string, attempts: number = 3): void {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(4000);
  cy.reload();

  cy.getBySel(row).within(() => {
    cy.getBySel('driver-balance-positive')
      .should('contain', amount)
      .then((balance) => {
        if (balance) {
          return;
        }
        if (attempts > 1) {
          checkBalance(row, amount, attempts - 1);
        }
      });
  });
}

describe('Withdraw-to-driver', () => {
  beforeEach(() => {
    if (isMockingData()) {
      meData.apply({
        name: 'ok',
        props: {
          fleets: [
            {
              id: '829492c9-29d5-41df-8e9b-14a407235ce1',
              name: 'AQA404TESTFLEET',
              region_id: 26,
              role: FleetRole.OWNER,
              fleet_type: FleetType.COMMERCIAL,
              tin_refused: false,
              is_fiscalization_enabled: false,
              wallet_transfers_allowed: true,
              email: 'aqa404fleet@uklon.com',
            },
          ],
        },
      });

      fleetWallet.apply({ name: 'ok', props: { amount: 100_000 } });
      fleetDriversWallets.apply({
        name: 'ok',
        props: { total_amount: 166_400, drivers_wallets: driversWalletsBeforeTransfer },
      });
      individualEntrepreneurs.apply({ name: 'ok', props: { withdrawal_type: WithdrawalType.PAYMENT_CARD } });
      withdrawToCardSettings.apply({ name: 'ok' });
      fleetPaymentCard.apply({ name: 'ok' });
      cashLimitsSettings.apply({ name: 'ok', props: { noSettings: true } });

      cy.intercept('api/fleets/*/finance/wallet-transactions?*', { statusCode: 200 });
      cy.intercept('api/fleets/*/finance/wallet/transfers/transfer-to-employees', { statusCode: 200 });
    }

    cy.clearLocalStorage();
    const notificationFleetAccount = getAccountByKind(AccountKind.NOTIFICATION_OWNER);
    cy.loginWithSession('fleetWallet', notificationFleetAccount.username, notificationFleetAccount.password);
    cy.visit('/workspace/finance#wallets');
    cy.getBySel('withdraw-to-fleet-button').should('be.visible');
  });

  it('[4692] should open pop-up', () => {
    enterAmount('row-380556532158', '20');
    cy.getBySel('withdraw-to-drivers-button').click();
    cy.getBySel('withdraw-to-drivers-modal').should('be.visible');

    cy.getBySel('driver-id-73709b95-4a71-487a-bd1e-1bd3539f6a11').should('be.visible');
  });

  it('[4693] withdraw to drivers button should be disabled ', () => {
    enterAmount('row-380723659856', '1000');
    enterAmount('row-380556532158', '4000');
    cy.getBySel('withdraw-to-drivers-button').should('be.disabled');
  });

  it('[3981] successful withdraw to driver', () => {
    enterAmount('row-380556532158', '1000');
    cy.getBySel('withdraw-to-drivers-button').click();
    cy.getBySel('transfer-btn').click();

    if (isMockingData()) {
      fleetDriversWallets.apply({
        name: 'ok',
        props: { total_amount: 166_400, drivers_wallets: driversWalletsAfterTransfer },
      });
    }

    checkBalance('row-380556532158', '₴ 2 000.00', 3);
  });

  after(() => {
    if (isMockingData()) {
      return;
    }
    cy.visit('/workspace/finance#wallets');
    enterAmount('row-380556532158', '1000');
    cy.getBySel('withdraw-to-fleet-button').click();
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.getBySel('transfer-btn').click();

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(4000);

    cy.reload();
    checkBalance('row-380556532158', '₴ 1 000.00', 3);
  });
});
