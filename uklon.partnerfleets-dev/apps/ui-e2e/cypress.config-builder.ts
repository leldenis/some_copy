import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';

import { addQasePlugin } from '@uklon/cypress-qase';

export const fleetE2EPreset = (props: Partial<Cypress.ResolvedConfigOptions>): Cypress.ConfigOptions => ({
  env: {
    mock: process.env['UseMockData'],
    fleetId: '829492c9-29d5-41df-8e9b-14a407235ce1',
    paginationSize: 30,
  },
  e2e: {
    // eslint-disable-next-line unicorn/prefer-module
    ...nxE2EPreset(__dirname),
    baseUrl: 'http://localhost:4200',
    modifyObstructiveCode: false,
    defaultCommandTimeout: 15_000,
    retries: { runMode: 3, openMode: 1 },
    ...props,
    video: false,
    screenshotOnRunFailure: true,
    setupNodeEvents: (on, config) => {
      if (process.env.E2E_ADD_QASE_PLUGIN) {
        addQasePlugin(on, config);
      }

      return config;
    },
  },
});
