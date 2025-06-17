import { AuthMethod } from '@data-access';

import { authIntercept, authSendOtcIntercept, authConfirmationMethodIntercept } from '../../support/interceptor';
import { AccountKind, getAccountByKind, isMockingData } from '../../support/utils';

const CODE_INPUT_LENGTH = 4;
const ONE_SECOND_MS = 1000;
const RESEND_INTERVAL_MS = 60_000;

describe('Login Page', () => {
  const defaultAccount = getAccountByKind();

  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/auth/login');
  });

  describe('When password and login are correct', () => {
    it('[3977] Should successfully auth to app as owner', () => {
      cy.login();

      cy.location('pathname').should('eq', '/workspace/general');
    });

    it('[3978] Should successfully auth to app as owner', () => {
      const notificationFleetAccount = getAccountByKind(AccountKind.NOTIFICATION_MANAGER);
      cy.login(notificationFleetAccount.username, notificationFleetAccount.password);
      cy.location('pathname').should('eq', '/workspace/general');
    });
  });

  if (isMockingData()) {
    describe('When user already has been logged in', () => {
      it('[8095] Should see the dashboard after page reload', () => {
        cy.login();

        cy.url().should('includes', 'workspace/general');
        cy.visit('/auth/login');
        cy.url().should('includes', 'workspace/general');
      });
    });
  }

  describe('When user has no access', () => {
    it('[5452] Should show credential error if user is private driver', () => {
      if (isMockingData()) {
        cy.intercept('POST', '/api/auth', { statusCode: 400, message: 'No fleets assigned', error: 'Bad request' });
      }

      const privateDriver = getAccountByKind(AccountKind.PRIVATE_DRIVER);
      cy.login(privateDriver.username, privateDriver.password);

      cy.getBySel('password').should('have.class', 'ng-invalid');
      cy.getBySel('credential-error').should('be.visible');
      cy.getBySel('login-btn').should('be.disabled');
    });
  });

  if (isMockingData()) {
    describe('When phone has wrong validation', () => {
      it('[8096] Continue button should be disabled', () => {
        cy.getBySel('contact').type('929232');
        cy.getBySel('continue-login-btn').should('be.disabled');
      });
    });

    describe('When remember me is true', () => {
      it('Should default status', () => {
        cy.getBySel('remember-me-control').should('be.visible').should('have.class', 'mat-mdc-checkbox-checked');
      });
    });

    describe('Password auth flow', () => {
      beforeEach(() => {
        cy.getBySel('contact').type(defaultAccount.username);
        cy.intercept('PUT', 'api/auth/confirmation-method', { fixture: 'auth/auth-method-password.json' });
        cy.getBySel('continue-login-btn').click();
      });

      it('[4747] Should display display password screen', () => {
        cy.getBySel('password').should('exist');
      });

      it('Should display correct title', () => {
        cy.getBySel('login-title').should('contain', 'Введіть пароль від вашого кабінету');
      });

      it('should have forgot password button', () => {
        cy.getBySel('password-recovery-link').should('exist');
      });

      it('should have disabled login button', () => {
        cy.getBySel('login-btn').should('be.disabled');
      });

      it('should have privacy policy info', () => {
        cy.getBySel('policy-info').should('exist');
      });

      it.skip('[8099] Should fail auth', () => {
        if (isMockingData()) {
          authIntercept.apply({ name: 'bad' });
        }

        cy.getBySel('password').type('badPassword123');
        cy.getBySel('login-btn').click();
        cy.getBySel('password').should('have.class', 'ng-invalid');
        cy.getBySel('credential-error').should('be.visible');
        cy.getBySel('login-btn').should('be.disabled');
      });
    });

    describe('OTC auth flow', () => {
      beforeEach(() => {
        if (isMockingData()) {
          authSendOtcIntercept.apply({ name: 'ok' });
        }

        authConfirmationMethodIntercept.apply({ name: 'ok', props: { method: AuthMethod.SMS } });

        cy.getBySel('contact').type(defaultAccount.username);
        cy.getBySel('continue-login-btn').click();
      });

      it('[4744] Should display display password screen', () => {
        cy.getBySel('code-input').should('exist');
      });

      it('Should display correct title', () => {
        cy.getBySel('login-title').should(
          'contain',
          `Введіть 4-х значний код, який було надіслано за номером +380${defaultAccount.username}`,
        );
      });

      it('should have privacy policy info', () => {
        cy.getBySel('policy-info').should('exist');
      });

      it('should have disabled login button', () => {
        cy.getBySel('login-btn').should('be.disabled');
      });

      it('should have resend code countdown', () => {
        const now = new Date();
        cy.clock(now);
        cy.getBySel('resend-countdown').should('exist');
        cy.getBySel('resend-countdown-static').should('contain', 'Код не прийшов?');
        cy.tick(RESEND_INTERVAL_MS - ONE_SECOND_MS);
        cy.getBySel('resend-countdown-dynamic').should('contain', 'Надіслати ще раз через 0:01');
        cy.tick(ONE_SECOND_MS);
        cy.getBySel('resend-countdown-dynamic').should('contain', 'Надіслати повторно');
      });

      it('should allow login after entering the code', () => {
        cy.getBySel('code-input').should('exist');
        cy.getBySel('code-input').find('input').as('inputs');

        for (let i = 0; i < CODE_INPUT_LENGTH; i += 1) {
          cy.get('@inputs').eq(i).should('exist').type('1');
        }

        cy.getBySel('login-btn').should('be.enabled');
      });

      it('Should fail auth', () => {
        if (isMockingData()) {
          authIntercept.apply({ name: 'bad' });
        }

        cy.getBySel('code-input').should('exist');
        cy.getBySel('code-input').find('input').as('inputs');

        for (let i = 0; i < CODE_INPUT_LENGTH; i += 1) {
          cy.get('@inputs').eq(i).should('exist').type('1');
        }

        cy.getBySel('login-btn').click();
        cy.getBySel('credential-error').should('be.visible');
        cy.getBySel('login-btn').should('be.disabled');
      });
    });
  }
});
