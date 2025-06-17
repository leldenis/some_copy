import { EmployeeWalletItemDto, FleetRole, FleetType, WithdrawalType } from '@data-access';

import { Currency } from '@uklon/types';

import { CashLimitsSettingsIntercept } from '../../../support/interceptor/finance/cash-limits';
import { FleetDriversWalletsIntercept } from '../../../support/interceptor/finance/drivers-wallets';
import { FleetWalletIntercept } from '../../../support/interceptor/finance/fleet-wallet';
import { IndividualEntrepreneursIntercept } from '../../../support/interceptor/finance/individual-entrepreneus';
import { FleetPaymentCardIntercept } from '../../../support/interceptor/finance/payment-card';
import { WithdrawToCardSettingsIncept } from '../../../support/interceptor/finance/withdraw-to-card-settings';
import { MeIntercept } from '../../../support/interceptor/me';
import { isMockingData } from '../../../support/utils';

const fleetId = '*';
const meData = new MeIntercept();
const fleetDriversWallets = new FleetDriversWalletsIntercept(fleetId);
const individualEntrepreneurs = new IndividualEntrepreneursIntercept(fleetId, true);
const withdrawToCardSettings = new WithdrawToCardSettingsIncept(fleetId);
const fleetWallet = new FleetWalletIntercept(fleetId);
const fleetPaymentCard = new FleetPaymentCardIntercept(fleetId);
const cashLimitsSettings = new CashLimitsSettingsIntercept(fleetId);
const driversWallets: EmployeeWalletItemDto[] = [
  {
    driver_id: '6296c966-be87-4f7e-988b-40f218758d51',
    first_name: 'Aqadpilu404',
    last_name: 'Aqaafeyh404',
    phone: '380506326599',
    signal: 500_265,
    wallet: {
      id: '35554482-8b4f-4c80-ba71-18137a633f32',
      balance: {
        amount: 2_065_400,
        currency: Currency.UAH,
      },
    },
  },
  {
    driver_id: 'd8b2481e-5e43-40b3-b9c5-119313c96da2',
    first_name: 'Aqasczqp',
    last_name: 'Aqaanmxf',
    phone: '576019807038',
    signal: 500_270,
    wallet: {
      id: 'ebe5c49b-c675-4331-b8c2-c0e417146aaa',
      balance: {
        amount: 2_000_000,
        currency: Currency.UAH,
      },
    },
  },
];
if (isMockingData()) {
  describe('Withdraw-all-to-fleet', () => {
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
          props: { total_amount: 4_066_400, drivers_wallets: driversWallets },
        });
        individualEntrepreneurs.apply({ name: 'ok', props: { withdrawal_type: WithdrawalType.PAYMENT_CARD } });
        withdrawToCardSettings.apply({ name: 'ok' });
        fleetPaymentCard.apply({ name: 'ok' });
        cashLimitsSettings.apply({ name: 'ok', props: { noSettings: true } });

        cy.intercept('api/fleets/*/finance/wallet-transactions?*', { statusCode: 200 });
      }
      cy.clearLocalStorage();
      cy.loginWithSession('fleetWallet');
      cy.visit('/workspace/finance#wallets');
    });

    it('[C503969] withdraw all to fleet button should be enabled', () => {
      cy.getBySel('withdraw--all-to-fleet').should('be.visible');
    });

    it('[568067] should display tooltip', () => {
      cy.getBySel('withdraw-all-to-fleet-tooltip').click();
      cy.get('.tippy-content')
        .should('be.visible')
        .should('contain', 'Ця сума залишиться у кожного водія після виведення грошей');
    });

    describe('Try-withdraw-all-to-fleet', () => {
      beforeEach(() => {
        cy.get('.mdc-checkbox').click();
      });

      it('[C503970] withdraw all to fleet input should be enabled', () => {
        cy.getBySel('amount-control').should('be.enabled');
      });

      it('[C503971] should display withdraw amount', () => {
        cy.getBySel('amount-control').type('10');
        cy.getBySel('withdraw-to-fleet-sum').should('contain', '₴ 40 634.00');
      });

      it('[C568065] withdraw to drivers button should be disabled', () => {
        cy.getBySel('withdraw-to-drivers-button').should('be.disabled');
      });
    });
  });
}
