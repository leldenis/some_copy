import { getAccountByKind } from '../../../support/utils';

function interceptConfirmationCode(): void {
  cy.intercept('POST', '/api/password-recovery', { statusCode: 204 });
  cy.intercept('POST', '/api/password-recovery/confirm/password-reset-code-verification', { statusCode: 201 });

  cy.getBySel('phone-number-control').type(getAccountByKind().username);
  cy.getBySel('receive-recovery-code-button').click();

  for (let i = 0; i < 4; i += 1) {
    cy.getBySel(`confirmation-digit-${i}`).should('be.enabled');
    cy.getBySel(`confirmation-digit-${i}`).type('1');
  }
}

function triggerError(inputValue: string, errorName: string): void {
  cy.getBySel('password-recovery-proceed-button').click();
  cy.getBySel('password-control').type(inputValue);
  cy.getBySel('password-control').blur();
  cy.getBySel(errorName).should('have.class', 'fac-error');
  cy.getBySel('password-confirmation-control').should('be.disabled');
  cy.getBySel('recover-password-button').should('be.disabled');
}

describe.skip('Forgot password page', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/auth/password-recovery');
  });

  describe('Confirmation code', () => {
    const defaultAccount = getAccountByKind();

    it.skip('[PF-1066] Should disable "Submit code" button if phone number is invalid', () => {
      cy.getBySel('phone-number-control').type('929232');
      cy.getBySel('receive-recovery-code-button').should('be.disabled');
    });

    it.skip('[PF-1067] Should enable "Submit code" button if phone number is valid', () => {
      cy.getBySel('phone-number-control').type(defaultAccount.username);
      cy.getBySel('receive-recovery-code-button').should('be.enabled');
    });

    it.skip('[PF-1068] Should enable "Proceed" button after confirmation code is typed in', () => {
      cy.intercept('POST', '/api/password-recovery', { statusCode: 204 });

      cy.getBySel('phone-number-control').type(defaultAccount.username);
      cy.getBySel('receive-recovery-code-button').click();

      for (let i = 0; i < 4; i += 1) {
        cy.getBySel(`confirmation-digit-${i}`).should('be.enabled');
        cy.getBySel(`confirmation-digit-${i}`).type('1');
      }

      cy.getBySel('password-recovery-proceed-button').should('be.enabled');
    });

    it.skip('[PF-1069] Should not allow to proceed if confirmation code is invalid', () => {
      cy.intercept('POST', '/api/password-recovery', { statusCode: 204 });
      cy.intercept('POST', '/api/password-recovery/confirm/password-reset-code-verification').as(
        'resetCodeVerification',
      );

      cy.getBySel('phone-number-control').type(defaultAccount.username);
      cy.getBySel('receive-recovery-code-button').click();

      for (let i = 0; i < 4; i += 1) {
        cy.getBySel(`confirmation-digit-${i}`).should('be.enabled');
        cy.getBySel(`confirmation-digit-${i}`).type('1');
      }

      cy.getBySel('password-recovery-proceed-button').should('be.enabled');
      cy.getBySel('password-recovery-proceed-button').click();

      cy.wait('@resetCodeVerification').its('response.statusCode').should('eq', 400);
    });

    it.skip('[PF-1070] Should proceed to the next step if confirmation code is valid', () => {
      interceptConfirmationCode();
      cy.getBySel('password-recovery-proceed-button').should('be.enabled');
      cy.getBySel('password-recovery-proceed-button').click();
    });
  });

  describe('New password validation', () => {
    it.skip('[PF-1071] Should highlight length error if password is too short', () => {
      interceptConfirmationCode();
      triggerError('1aA', 'error-length');
    });

    it.skip('[PF-1072] Should highlight lowercase error if password does not include lowercase letter', () => {
      interceptConfirmationCode();
      triggerError('AAA11111', 'error-lowercase');
    });

    it.skip('[PF-1073] Should highlight uppercase error if password does not include uppercase letter', () => {
      interceptConfirmationCode();
      triggerError('aaa11111', 'error-uppercase');
    });

    it.skip('[PF-1074] Should highlight digits error if password does not include digits', () => {
      interceptConfirmationCode();
      triggerError('aaaAAAAA', 'error-digits');
    });

    it.skip('[PF-1075] Should enable "Confirm password" input if password is valid', () => {
      interceptConfirmationCode();
      cy.getBySel('password-recovery-proceed-button').click();

      cy.getBySel('password-control').type('aaaAAAAA1');
      cy.getBySel('password-confirmation-control').should('be.enabled');
    });

    it.skip('[PF-1076] Should display error if New and Confirm passwords missmatch', () => {
      interceptConfirmationCode();
      cy.getBySel('password-recovery-proceed-button').click();

      cy.getBySel('password-control').type('aaaAAAAA1');
      cy.getBySel('password-confirmation-control').type('aaaAAAAA');
      cy.getBySel('password-confirmation-control').blur();
      cy.get('mat-error').should('contain', 'Паролі не співпадають');
    });

    it.skip('[PF-1077] Should enable "Change password" button if confirm password matches new password', () => {
      interceptConfirmationCode();
      cy.getBySel('password-recovery-proceed-button').click();

      cy.getBySel('password-control').type('aaaAAAAA1');
      cy.getBySel('password-confirmation-control').type('aaaAAAAA1');
      cy.getBySel('recover-password-button').should('be.enabled');
    });
  });
});
