import { EmployeeWalletItemDto, FleetRole, FleetType, WithdrawalType } from '@data-access';

import { Currency } from '@uklon/types';

import { CashLimitsSettingsIntercept } from '../../../support/interceptor/finance/cash-limits';
import { FleetDriversWalletsIntercept } from '../../../support/interceptor/finance/drivers-wallets';
import { fleetWalletIntercept } from '../../../support/interceptor/finance/fleet-wallet';
import { IndividualEntrepreneursIntercept } from '../../../support/interceptor/finance/individual-entrepreneus';
import { fleetPaymentCardIntercept } from '../../../support/interceptor/finance/payment-card';
import { withdrawToCardSettingsIncept } from '../../../support/interceptor/finance/withdraw-to-card-settings';
import { MeIntercept } from '../../../support/interceptor/me';
import { isMockingData } from '../../../support/utils';

const fleetId = '*';
const meData = new MeIntercept();
const fleetDriversWallets = new FleetDriversWalletsIntercept(fleetId);
const individualEntrepreneurs = new IndividualEntrepreneursIntercept(fleetId, true);
const cashLimitsSettings = new CashLimitsSettingsIntercept(fleetId);
const driversWallets: EmployeeWalletItemDto[] = [
  {
    driver_id: '1fad966a-b2f4-427b-a0da-4b04be5f871f',
    first_name: 'Aqadpilu404',
    last_name: 'Aqaafeyh404',
    phone: '380506326599',
    signal: 500_265,
    wallet: {
      id: '35554482-8b4f-4c80-ba71-18137a633f32',
      balance: {
        amount: 1_056_400,
        currency: Currency.UAH,
      },
    },
  },
  {
    driver_id: 'c19c7e33-7da7-400a-b64a-967ae4f532a5',
    first_name: 'Aqasczqp',
    last_name: 'Aqaanmxf',
    phone: '576019807038',
    signal: 500_270,
    wallet: {
      id: 'ebe5c49b-c675-4331-b8c2-c0e417146aaa',
      balance: {
        amount: 2_010_000,
        currency: Currency.UAH,
      },
    },
  },
  {
    driver_id: '8110174c-c9ee-4ccb-8746-d72c234b7f5b',
    first_name: 'Aqaxhjae404',
    last_name: 'Aqaauucb404',
    phone: '576017922661',
    signal: 500_236,
    wallet: {
      id: '35226d76-f347-468c-bc39-866f3d106841',
      balance: {
        amount: 1_000_000,
        currency: Currency.UAH,
      },
    },
  },
  {
    driver_id: '8737e3fa-4f40-4d8e-a333-69fbb0cdefec',
    first_name: 'Aqakfpzc404',
    last_name: 'Aqabyddd404',
    phone: '576017817620',
    signal: 500_271,
    wallet: {
      id: '954a2cde-ac34-47df-9786-faf30fc56909',
      balance: {
        amount: 0,
        currency: Currency.UAH,
      },
    },
  },
  {
    driver_id: 'a3a30e05-5f92-4e05-ad1d-ee7ce9553605c',
    first_name: 'Aqarchwu404',
    last_name: 'Aqabeahd404',
    phone: '576019711870',
    signal: 500_272,
    wallet: {
      id: '73d2f261-8d5a-462f-8453-c7cebd7d813f',
      balance: {
        amount: -10_000,
        currency: Currency.UAH,
      },
    },
  },
];

if (isMockingData()) {
  describe('Fleet-drivers-balances', () => {
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

        fleetDriversWallets.apply({ name: 'ok', props: { total_amount: 4_066_400, drivers_wallets: driversWallets } });
        individualEntrepreneurs.apply({ name: 'ok', props: { withdrawal_type: WithdrawalType.PAYMENT_CARD } });
        cashLimitsSettings.apply({ name: 'ok', props: { noSettings: true } });
        fleetWalletIntercept.apply({ name: 'ok' });
        withdrawToCardSettingsIncept.apply({ name: 'ok' });
        fleetPaymentCardIntercept.apply({ name: 'ok' });

        cy.intercept('api/fleets/*/finance/wallet-transactions?*', { statusCode: 200 });
      }
      cy.clearLocalStorage();
      cy.loginWithSession('fleetWallet');
      cy.visit('/');
      cy.getBySel('side-nav-menu-finance').click();
    });

    it('[C503987] should have driver balances tab', () => {
      cy.getBySel('finance-tabs-drivers-balances').should('be.visible');
    });

    describe('Fleet-drivers-balances-content', () => {
      beforeEach(() => {
        cy.getBySel('finance-tabs-drivers-balances').click();
      });

      it('[C503988] should have general balance', () => {
        cy.getBySel('sum-drivers-balances').should('contain', '₴ 40 664.00');
      });

      it('[C503989] negative balance should be red', () => {
        cy.getBySel('input-driver-phone').type('576019711870');
        cy.getBySel('driver-balance-negative')
          .should('contain', '- ₴ 100.00')
          .should('have.css', 'Color', 'rgb(233, 114, 114)');
      });

      it('[C503989] positive balance should be black', () => {
        cy.getBySel('input-driver-phone').type('576017922661');
        cy.getBySel('driver-balance-positive')
          .should('contain', '₴ 10 000.00')
          .should('have.css', 'Color', 'rgb(69, 71, 84)');
      });

      it('[C503989] neutral balance should be black', () => {
        cy.getBySel('input-driver-phone').type('576017817620');
        cy.getBySel('driver-balance-positive')
          .should('contain', '₴ 0.00')
          .should('have.css', 'Color', 'rgb(69, 71, 84)');
      });

      it('[	C503990] should have driver cell', () => {
        cy.getBySel('header-cell-driver').should('contain', 'Водій');
      });

      it('[	C503990] should have signal cell', () => {
        cy.getBySel('header-cell-signal').should('contain', 'Позивний');
      });

      it('[	C503990] should have balance cell', () => {
        cy.getBySel('header-cell-balance').should('contain', 'Поточний баланс');
      });

      it('[	C503990] should have enter amount cell', () => {
        cy.getBySel('header-cell-sum').should('contain', 'Введіть суму');
      });
    });
  });
}
