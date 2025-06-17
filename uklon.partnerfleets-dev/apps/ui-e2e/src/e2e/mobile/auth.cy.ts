import { getAccountByKind } from '../../support/utils';

const CODE_INPUT_LENGTH = 4;

describe('Login Page', () => {
  const defaultAccount = getAccountByKind();
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/auth/login');
  });

  describe('When password and login are correct', () => {
    it.skip('[PF-1039] Should successfully auth to app', () => {
      cy.login();

      cy.location('pathname').should('eq', '/workspace/general');
    });
  });

  describe('When user already has been logged in', () => {
    it.skip('[PF-1040] Should see the dashboard after page reload', () => {
      cy.login();

      cy.url().should('includes', 'workspace/general');
      cy.url().reload();
      cy.url().should('includes', 'workspace/general');
    });
  });

  describe('When user has no access', () => {
    it.skip('[PF-1041] Should redirect to forbidden page', () => {
      cy.intercept('GET', 'api/me', { statusCode: 404 });
      cy.login();

      cy.url().should('includes', 'auth/forbidden');
    });
  });

  describe('When phone has wrong validation', () => {
    it.skip('[PF-1042] Continue button should be disabled', () => {
      cy.getBySel('contact').type('929232');
      cy.getBySel('continue-login-btn').should('be.disabled');
    });
  });

  describe('When remember me is true', () => {
    it.skip('[PF-1044] Should default status', () => {
      cy.getBySel('remember-me-control').should('be.visible').should('have.class', 'mat-mdc-checkbox-checked');
    });
  });

  describe('Password auth flow', () => {
    beforeEach(() => {
      cy.getBySel('contact').type(defaultAccount.username);
      cy.intercept('PUT', 'api/auth/confirmation-method', { fixture: 'auth/auth-method-password.json' });
      cy.getBySel('continue-login-btn').click();
    });

    it('Should display display password screen', () => {
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

    it.skip('[PF-1043] Should fail auth', () => {
      cy.getBySel('password').type('badPassword123');
      cy.getBySel('login-btn').click();
      cy.getBySel('password').should('have.class', 'ng-invalid');
      cy.getBySel('credential-error').should('be.visible');
      cy.getBySel('login-btn').should('be.disabled');
    });
  });

  describe('OTC auth flow', () => {
    beforeEach(() => {
      cy.getBySel('contact').type(defaultAccount.username);
      cy.intercept('PUT', 'api/auth/confirmation-method', { fixture: 'auth/auth-method-sms.json' });
      cy.getBySel('continue-login-btn').click();
    });

    it('Should display display password screen', () => {
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

    it.skip('should have resend code countdown', () => {
      window.localStorage.setItem('resendAuthCodeInterval', '1');
      cy.getBySel('resend-countdown').should('exist');
      cy.getBySel('resend-countdown-static').should('contain', 'Код не прийшов?');
      cy.getBySel('resend-countdown-dynamic').should('contain', 'Надіслати ще раз через 0:01');
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(1000);
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

    it.skip('Should fail auth', () => {
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
});
