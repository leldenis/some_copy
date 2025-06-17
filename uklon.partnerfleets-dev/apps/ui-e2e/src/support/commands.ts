// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

import { getAccountByKind } from './utils';

const UNAUTHORIZED_ERROR = 401;

Cypress.Commands.add('setLocalStorage', (key, value) => {
  return cy.window().its('localStorage').invoke('setItem', key, value);
});

Cypress.Commands.add('getBySel', (selector, ...args) => cy.get(`[data-cy=${selector}]`, ...args));

Cypress.Commands.add('getBySelLike', (selector, ...args) => cy.get(`[data-cy*=${selector}]`, ...args));

Cypress.Commands.add(
  'login',
  (
    username = getAccountByKind()?.username,
    password = getAccountByKind()?.password,
    authMethod: 'password' | 'sms' = 'password',
    { rememberUser = true } = {},
  ) => {
    const signingPath = '/auth/login';
    const log = Cypress.log({
      name: 'login',
      displayName: 'LOGIN',
      message: [`🔐 Authenticating | ${username}`],
      autoEnd: false,
    });

    window.localStorage.setItem('device', 'accaa560-9689-462c-ab19-24edef52248e');
    cy.intercept('POST', '/api/auth').as('loginUser');
    cy.intercept('PUT', 'api/auth/confirmation-method', {
      fixture: authMethod === 'password' ? 'auth/auth-method-password.json' : 'auth/auth-method-sms.json',
    }).as('confirmationMethod');

    cy.location('pathname', { log: false }).then((currentPath) => {
      if (currentPath !== signingPath) {
        cy.visit(signingPath);
      }
    });

    log.snapshot('before');

    cy.getBySel('contact').type(username);
    if (rememberUser) {
      cy.getBySel('remember-me-control').find('input').check();
    }
    cy.getBySel('continue-login-btn').click();

    cy.wait('@confirmationMethod');
    cy.getBySel('password').type(password);

    cy.getBySel('login-btn').click();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cy.wait('@loginUser').then((loginUser: any) => {
      log.set({
        consoleProps() {
          return {
            username,
            password,
            rememberUser,
            accessToken: loginUser.response.statusCode !== UNAUTHORIZED_ERROR && loginUser.response.body.access_token,
          };
        },
      });

      log.snapshot('after');
      log.end();
    });
  },
);

Cypress.Commands.add('loginWithSession', (name: string, username, password) => {
  cy.session(name, () => {
    cy.login(username, password);
  });
});

Cypress.Commands.add('getToken', (login: string, pass: string) => {
  const requestBody = {
    contact: login,
    password: pass,
    grant_type: 'password',
    client_id: 'df465fda-2347-4b2b-9ddb-e8d6030d7643',
    client_secret: 'secret',
    device_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  };
  cy.request({
    method: 'POST',
    url: 'https://identity2.staging.uklon.net/api/v1/auth',
    body: requestBody,
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then((response) => {
    expect(response.status).to.eq(200);
    return response.body.access_token;
  });
});

Cypress.Commands.add('logout', () => {
  cy.getBySel('logout-btn').should('exist');
  cy.getBySel('logout-btn').click();
  cy.url().should('includes', 'auth/login');
});

Cypress.Commands.add('setLocale', (idx: number) => {
  cy.getBySel('lang-control-select').click();
  cy.getBySel('lang-control-option').eq(idx).click();
});

Cypress.Commands.add('useDateRangeFilter', (option = 'current-week', from = null, to = null) => {
  cy.getBySel('date-range-control').first().click();
  cy.getBySel(`date-range-option-${option}`).should('exist').click();

  if (option === 'custom') {
    cy.getBySel('input-container').should('exist').click();
    cy.getBySel('custom-date-range-input-start').type(from);
    cy.getBySel('custom-date-range-input-end').type(to);
    cy.getBySel('accept-date-range-btn').should('be.enabled').click();
  }
});

Cypress.Commands.add('useDriverFilter', (index: number = 1, fullName?: string | 'all') => {
  cy.getBySel('drivers-control').should('exist').click();

  if (fullName === 'all') {
    cy.getBySel('drivers-control').find('.mat-icon').click();
    return;
  }

  if (fullName) {
    cy.getBySel(`driver-option-${fullName.split(' ').join('-')}`)
      .should('exist')
      .click();
  } else {
    cy.getBySelLike('driver-option').eq(index).should('exist').click();
  }
});

Cypress.Commands.add('useVehicleFilter', (index: number = 1, licencePlate?: string | 'all') => {
  cy.getBySel('vehicle-control').should('exist').click();

  if (licencePlate === 'all') {
    cy.getBySel('vehicle-control').find('.mat-icon').click();
    return;
  }

  if (licencePlate) {
    cy.getBySel(`vehicle-option-${licencePlate.split(' ').join('-')}`)
      .should('exist')
      .click();
  } else {
    cy.getBySelLike('vehicle-option').eq(index).should('exist').click();
  }
});
