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
    driver_id: 'd8b2481e-5e43-40b3-b9c5-119313c96da2',
    first_name: 'Aqasczqp',
    last_name: 'Aqaanmxf',
    phone: '380556532158',
    signal: 500_270,
    wallet: {
      id: 'ebe5c49b-c675-4331-b8c2-c0e417146aaa',
      balance: {
        amount: 0,
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

function checkBalance(amount: string, attempts: number = 3): void {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(4000);
  cy.reload();

  cy.getBySel('sum-drivers-balances')
    .should('contain', amount)
    .then((balance) => {
      if (balance) {
        return;
      }
      if (attempts > 1) {
        checkBalance(amount, attempts - 1);
      }
    });
}

describe('Withdraw-to-fleet', () => {
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
      cy.intercept('api/fleets/*/finance/wallet/transfers/transfer-to-fleet', { statusCode: 200 });
    }
    cy.clearLocalStorage();
    const notificationFleetAccount = getAccountByKind(AccountKind.NOTIFICATION_OWNER);
    cy.loginWithSession('fleetWallet', notificationFleetAccount.username, notificationFleetAccount.password);
    cy.visit('/workspace/finance#wallets');
  });

  it('[4685] should highlight row', () => {
    enterAmount('row-380556532158', '20');
    cy.getBySel('row-380556532158-selected-row').should('be.visible');
  });

  it('[4686] should open pop-up', () => {
    enterAmount('row-380556532158', '20');
    cy.getBySel('withdraw-to-fleet-button').click();
    cy.getBySel('withdraw-to-fleet-popup').should('be.visible');
  });

  it('[4687] withdraw to fleet button should be disabled ', () => {
    enterAmount('row-380556532158', '12000');
    cy.getBySel('withdraw-to-fleet-button').should('be.disabled');
  });

  it('[3980] successful withdraw to fleet', () => {
    enterAmount('row-380556532158', '1000');
    cy.getBySel('withdraw-to-fleet-button').click();
    cy.getBySel('transfer-btn').click();

    if (isMockingData()) {
      fleetDriversWallets.apply({
        name: 'ok',
        props: { total_amount: 0, drivers_wallets: driversWalletsAfterTransfer },
      });
    }
    checkBalance('₴ 0.00', 3);
  });

  after(() => {
    if (isMockingData()) {
      return;
    }
    cy.visit('/workspace/finance#wallets');
    enterAmount('row-380556532158', '1000');
    cy.getBySel('withdraw-to-drivers-button').click();
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.getBySel('transfer-btn').click();

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(3000);

    if (isMockingData()) {
      fleetDriversWallets.apply({
        name: 'ok',
        props: { total_amount: 100_000, drivers_wallets: driversWalletsBeforeTransfer },
      });
    }

    cy.reload();
    checkBalance('₴ 1 000.00', 3);
  });
});
