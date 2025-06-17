import { defineConfig } from 'cypress';

import { fleetE2EPreset } from './cypress.config-builder';

export default defineConfig(
  fleetE2EPreset({
    supportFile: 'src/support/e2e.ts',
    specPattern: 'src/e2e/desktop/**/*.cy.{js,ts}',
    viewportHeight: 1080,
    viewportWidth: 1920,
    experimentalMemoryManagement: true,
  }),
);
