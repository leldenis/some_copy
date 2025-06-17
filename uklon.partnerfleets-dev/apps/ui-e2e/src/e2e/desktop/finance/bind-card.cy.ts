import { WithdrawalType } from '@data-access';

import { CashLimitsSettingsIntercept } from '../../../support/interceptor/finance/cash-limits';
import { FleetWalletIntercept } from '../../../support/interceptor/finance/fleet-wallet';
import { IndividualEntrepreneursIntercept } from '../../../support/interceptor/finance/individual-entrepreneus';
import { FleetPaymentCardIntercept } from '../../../support/interceptor/finance/payment-card';
import { withdrawToCardSettingsIncept } from '../../../support/interceptor/finance/withdraw-to-card-settings';
import { AccountKind, getAccountByKind, isMockingData } from '../../../support/utils';

const fleetId = '*';
const individualEntrepreneurs = new IndividualEntrepreneursIntercept(fleetId, true);
const fleetWallet = new FleetWalletIntercept(fleetId);
const fleetPaymentCard = new FleetPaymentCardIntercept(fleetId);
const cashLimitsSettings = new CashLimitsSettingsIntercept(fleetId);

if (isMockingData()) {
  describe('Fleet-bind-card', () => {
    const emptyAccount = getAccountByKind(AccountKind.EMPTY);
    beforeEach(() => {
      if (isMockingData()) {
        fleetWallet.apply({ name: 'ok', props: { amount: 0 } });
        individualEntrepreneurs.apply({
          name: 'ok',
          props: { withdrawal_type: WithdrawalType.PAYMENT_CARD },
        });
        fleetPaymentCard.apply({ name: 'ok', props: { is_empty: true } });
        cashLimitsSettings.apply({ name: 'ok', props: { noSettings: true } });
        withdrawToCardSettingsIncept.apply({ name: 'ok' });

        cy.intercept('api/fleets/*/finance/wallet-transactions?*', { statusCode: 200 });
        cy.intercept('PUT', 'api/me/send-verification-code', { statusCode: 200 });
      }

      cy.loginWithSession(emptyAccount.username, emptyAccount.username, emptyAccount.password);
      cy.visit('/');

      cy.getBySel('side-nav-menu-finance').click();
    });

    it('[C503972] should have bind button', () => {
      cy.getBySel('bind-card-button').should('contain', 'Додати');
    });

    describe('Bind-card-popup', () => {
      beforeEach(() => {
        cy.getBySel('bind-card-button').click();
      });

      it('[C503973] should open pop-up', () => {
        cy.get('[data-cy="bind-card-title"]').should('exist');
      });

      it('[C503974] should have card numder input', () => {
        cy.getBySel('card-number').type('4444555511116666');
      });

      it('[C503974] should have month valid to input', () => {
        cy.getBySel('card-month-valid-to').type('10');
      });

      it('[C503974] should have month valid to input', () => {
        cy.getBySel('card-year-valid-to').type('33');
      });

      it('[C503975] should be inactive', () => {
        cy.getBySel('card-add-button').should('be.disabled');
      });

      it('[C503975] should be active', () => {
        cy.getBySel('card-number').type('4444555511116666');
        cy.getBySel('card-month-valid-to').type('10');
        cy.getBySel('card-year-valid-to').type('33');

        cy.getBySel('card-add-button').should('not.be.disabled');
      });
    });

    describe('SMS', () => {
      beforeEach(() => {
        cy.getBySel('bind-card-button').click();
        cy.getBySel('card-number').type('4444555511116666');
        cy.getBySel('card-month-valid-to').type('10');
        cy.getBySel('card-year-valid-to').type('33');
        cy.getBySel('card-add-button').click();
      });

      it('[C503976] should have confiramtion code input', () => {
        cy.getBySel('confirmation-code-input').should('exist');
      });
    });
  });
}
