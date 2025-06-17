import { defineConfig } from 'cypress';

import { fleetE2EPreset } from './cypress.config-builder';

export default defineConfig(
  fleetE2EPreset({
    supportFile: 'src/support/e2e.ts',
    specPattern: 'src/e2e/mobile/**/*.cy.{js,ts}',
    viewportHeight: 896,
    viewportWidth: 414,
  }),
);
