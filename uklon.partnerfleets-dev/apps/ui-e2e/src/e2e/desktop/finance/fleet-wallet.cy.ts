import { FleetMerchant, FleetRole, FleetType, IndividualEntrepreneurDto, WithdrawalType } from '@data-access';

import { MeIntercept } from '../../../support/interceptor';
import { CashLimitsSettingsIntercept } from '../../../support/interceptor/finance/cash-limits';
import { FleetWalletIntercept } from '../../../support/interceptor/finance/fleet-wallet';
import { IndividualEntrepreneursIntercept } from '../../../support/interceptor/finance/individual-entrepreneus';
import { FleetPaymentCardIntercept } from '../../../support/interceptor/finance/payment-card';
import { withdrawToCardSettingsIncept } from '../../../support/interceptor/finance/withdraw-to-card-settings';
import { fleetsUnreadCountIntercept } from '../../../support/interceptor/unread-count/fleets';
import { AccountKind, getAccountByKind, isMockingData } from '../../../support/utils';

const entrepreneursItems: IndividualEntrepreneurDto[] = [
  {
    id: 'cf75cc2b-0c9a-4758-b9c7-d27c319743d8',
    name: 'entrepreneur1',
    is_selected: true,
    payment_providers: [
      {
        merchant_id: '123412124',
        merchant_binding_id: '5d46ec7f-3b81-4df9-b320-eb69da22d7c8',
        type: FleetMerchant.FONDY,
      },
      {
        merchant_id: '234234234',
        merchant_binding_id: 'ae74c5e7-a56c-4344-82c4-e0313b7acaa3',
        type: FleetMerchant.IPAY,
      },
    ],
  },
  {
    id: '66a947c2-e34d-479b-b83f-778a88c35c00',
    name: 'entrepreneur2',
    is_selected: false,
    payment_providers: [
      {
        merchant_id: '36342352',
        merchant_binding_id: '73a4ed8c-d561-424a-9a02-401bd56f2ee8',
        type: FleetMerchant.FONDY,
      },
    ],
  },
];
const fleetId = '*';
const meData = new MeIntercept();
const individualEntrepreneurs = new IndividualEntrepreneursIntercept(fleetId, true);
const fleetWallet = new FleetWalletIntercept(fleetId);
const fleetPaymentCard = new FleetPaymentCardIntercept(fleetId);
const cashLimitsSettings = new CashLimitsSettingsIntercept(fleetId);

function selectFleet(id: string): void {
  cy.getBySel('fleet-avatar-selected').click();
  cy.getBySel(`fleet-item-${id}`).click();
}

function selectMerchant(merchId: string): void {
  cy.getBySel('merchant-menu-button').click();
  cy.getBySel('merchant-settings-button').click();
  cy.getBySel('selector-merchant').click();
  cy.getBySel(`merchant-${merchId}`).click();
  cy.getBySel('confirm-button').click();
}

describe('Fleet-wallet-page', () => {
  beforeEach(() => {
    if (isMockingData()) {
      meData.apply({
        name: 'ok',
        props: {
          fleets: [
            {
              id: '829492c9-29d5-41df-8e9b-14a407235ce1',
              name: 'AQANOMerchant',
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

      fleetWallet.apply({ name: 'ok', props: { amount: 890_000 } });
      fleetPaymentCard.apply({ name: 'ok' });
      cashLimitsSettings.apply({ name: 'ok', props: { noSettings: true } });
      individualEntrepreneurs.apply({ name: 'ok', props: { withdrawal_type: WithdrawalType.PAYMENT_CARD } });
      withdrawToCardSettingsIncept.apply({ name: 'ok' });

      cy.intercept('api/fleets/*/finance/wallet-transactions?*', { statusCode: 200 });
    }

    cy.clearLocalStorage();
    cy.loginWithSession('fleetWallet');
    cy.visit('/workspace/finance');
  });

  it('[4762] should open fleet wallet page', () => {
    cy.visit('/');
    cy.getBySel('side-nav-menu-finance').click();
    cy.url().should('includes', '/workspace/finance');
  });

  it('[4763] should have balance title', () => {
    cy.getBySel('fleet-balance-title').should('contain', 'На балансі парку');
  });

  it('[4762] should have actual fleet balance', () => {
    cy.getBySel('fleet-balance').should('contain', '₴ 8 900.00');
  });

  it('[3992] should display actual card when no payees', () => {
    cy.getBySel('fleet-card').should('be.visible');
  });

  after(() => {
    cy.clearAllSessionStorage();
  });
});

describe('Fleet-wallet-page-merchant', () => {
  beforeEach(() => {
    cy.clearAllSessionStorage();

    if (isMockingData()) {
      meData.apply({
        name: 'ok',
        props: {
          fleets: [
            {
              id: '818720da-9893-4f36-9e92-f249cf60839d',
              name: 'AQANOMerchant',
              region_id: 24,
              role: FleetRole.OWNER,
              fleet_type: FleetType.COMMERCIAL,
              tin_refused: false,
              is_fiscalization_enabled: false,
              wallet_transfers_allowed: true,
              email: 'test@mail.com',
            },
            {
              id: '10b2b7c2-d867-4c72-bc57-722dd94509fc',
              name: 'OneMerchant',
              region_id: 24,
              role: FleetRole.OWNER,
              fleet_type: FleetType.COMMERCIAL,
              tin_refused: false,
              is_fiscalization_enabled: false,
              wallet_transfers_allowed: true,
              email: 'test@mail.com',
            },
            {
              id: '9f7b55cf-7b26-4fc2-9b15-ac422f8023cb',
              name: 'TwoMerchant',
              region_id: 24,
              role: FleetRole.OWNER,
              fleet_type: FleetType.COMMERCIAL,
              tin_refused: false,
              is_fiscalization_enabled: false,
              wallet_transfers_allowed: true,
              email: 'test@mail.com',
            },
          ],
        },
      });

      fleetWallet.apply({ name: 'ok', props: { amount: 0 } });
      individualEntrepreneurs.apply({
        name: 'ok',
        props: { withdrawal_type: WithdrawalType.PAYMENT_CARD },
      });
      cashLimitsSettings.apply({ name: 'ok', props: { noSettings: true } });
      fleetPaymentCard.apply({ name: 'ok' });
      withdrawToCardSettingsIncept.apply({ name: 'ok' });
      fleetsUnreadCountIntercept.apply({ name: 'ok' });

      cy.intercept('api/fleets/*/finance/wallet-transactions?*', { statusCode: 200 });
      cy.intercept('api/fleets/*/finance/balance-split-model', { statusCode: 200 });
      cy.intercept('api/fleets/*/finance/individual-entrepreneurs/*/select', { statusCode: 200 });
    }

    const merchantFleetAccount = getAccountByKind(AccountKind.MERCHANT);

    cy.loginWithSession('fleetPayees', merchantFleetAccount.username, merchantFleetAccount.password);

    cy.visit('/workspace/finance');
  });

  it('[3991] should not display card when select merchant', () => {
    if (isMockingData()) {
      individualEntrepreneurs.apply({
        name: 'ok',
        props: { withdrawal_type: WithdrawalType.PAYMENT_CARD },
      });
    }

    selectFleet('10b2b7c2-d867-4c72-bc57-722dd94509fc');

    cy.getBySel('fleet-add-card').should('not.exist');
  });

  it('4761] should not display menu button for one merchant', () => {
    if (isMockingData()) {
      individualEntrepreneurs.apply({
        name: 'ok',
        props: { withdrawal_type: WithdrawalType.INDIVIDUAL_ENTREPRENEUR, entrepreneur_count: 1 },
      });
    }

    selectFleet('10b2b7c2-d867-4c72-bc57-722dd94509fc');

    cy.getBySel('merchant-menu-button').should('not.exist');
  });

  it('[3990] should change main merchant', () => {
    if (isMockingData()) {
      individualEntrepreneurs.apply({
        name: 'ok',
        props: { withdrawal_type: WithdrawalType.INDIVIDUAL_ENTREPRENEUR, entrepreneur: entrepreneursItems },
      });
      fleetWallet.apply({ name: 'ok', props: { amount: 0 } });
    }
    selectFleet('9f7b55cf-7b26-4fc2-9b15-ac422f8023cb');

    selectMerchant('66a947c2-e34d-479b-b83f-778a88c35c00');

    cy.getBySel('merchant-name').contains('entrepreneur2');
  });

  after(() => {
    cy.get('.toast.success').within(() => cy.get('.mat-mdc-icon-button').click());

    selectFleet('9f7b55cf-7b26-4fc2-9b15-ac422f8023cb');
    selectMerchant('cf75cc2b-0c9a-4758-b9c7-d27c319743d8');
    cy.getBySel('merchant-name').contains('entrepreneur1');
  });
});
