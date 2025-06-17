import { BrandingCalculationPeriodsOldInterceptor } from '../../../../support/interceptor/bonuses/branding-bonus-old/branding-calculation-periods-old';
import { BrandingCalculationsProgramOldInterceptor } from '../../../../support/interceptor/bonuses/branding-bonus-old/branding-calculations-program-old';
import { BrandingBonusProgramsListOldIntercept } from '../../../../support/interceptor/bonuses/branding-bonus-old/list';
import { FleetWalletIntercept } from '../../../../support/interceptor/finance/fleet-wallet';
import { FleetVehiclesListIntercept } from '../../../../support/interceptor/vehicles/list';
import { isMockingData } from '../../../../support/utils';

if (isMockingData()) {
  describe('Branding bonus old page', () => {
    const fleetId = '*';
    const walletId = '1393a938-3ca7-4da7-bc67-9570afd63422';
    const vehicleId = '98d37c9d-2579-4295-9dae-db2e8c90fd1d';
    const fleetWallet = new FleetWalletIntercept(fleetId);
    const brandingCalculationPeriods = new BrandingCalculationPeriodsOldInterceptor();
    const brandingCalculationProgram = new BrandingCalculationsProgramOldInterceptor();
    const fleetVehiclesList = new FleetVehiclesListIntercept('*', 'licencePlate=&limit=30&offset=0');
    const brandingBonusProgramsList = new BrandingBonusProgramsListOldIntercept('*');

    beforeEach(() => {
      fleetWallet.apply({ name: 'ok', props: { walletId } });
      brandingCalculationPeriods.apply({ name: 'ok' });
      brandingCalculationProgram.apply({ name: 'ok' });
      fleetVehiclesList.apply({ name: 'ok', props: { count: 3 } });
      brandingBonusProgramsList.apply({ name: 'ok' });

      cy.clearLocalStorage();
      cy.loginWithSession('brandingBonuses');
      cy.visit('workspace/bonuses#branding-bonus-old');
    });

    it('Should open bonus page', () => {
      cy.url().should('includes', '/workspace/bonuses');
    });

    describe('[4776] Should available filters by period and license plate', () => {
      it('Should available filters by period', () => {
        cy.getBySel('bonus-filter-by-period').should('be.visible').click();
        brandingBonusProgramsList.apply({ name: 'ok', props: { count: 1, vehicle_id: vehicleId } });
        cy.get('mat-option').eq(1).click();

        cy.intercept(
          `api/bonuses/c259fbce-bc09-4a8b-a2c7-40ef75b379c6/branding-programs?wallet_id=${walletId}&offset=0&limit=30&vehicle_id=`,
          (req) => {
            cy.getBySel('loading-indicator').should('be.visible');

            req.continue(() => {
              cy.getBySel('loading-indicator').should('not.be.visible');
              cy.getBySel('bonus-programs-list-table-row').should('have.length', 1);
            });
          },
        );
      });

      it.skip('Should available filters by license plate', () => {
        cy.getBySel('bonus-filter-by-vehicle').should('be.visible').click();
        cy.get('mat-option').eq(0).click();
        brandingBonusProgramsList.apply({ name: 'ok', props: { count: 1, vehicle_id: vehicleId } });
        cy.intercept(
          `api/bonuses/b76ed7fc-c931-43d9-9246-5f8bdcf0ecd8/branding-programs?wallet_id=${walletId}&offset=0&limit=30&vehicle_id=`,
          (req) => {
            cy.getBySel('loading-indicator').should('be.visible');

            req.continue(() => {
              cy.getBySel('loading-indicator').should('not.be.visible');
              cy.getBySel('bonus-programs-list-table-row').should('have.length', 1);
            });
          },
        );
      });
    });

    describe('[4778] Show display program rules', () => {
      it('Should display program rules', () => {
        cy.getBySel('bonus-program-rules').should('be.visible');
      });

      it('should include columns', () => {
        cy.getBySel('bonus-program-rules-title').should('be.visible').contains('Поточні вимоги програми брендування');
        cy.getBySel('bonus-program-rules-subtitle').should('be.visible').contains('Дані оновлюються 1 раз на добу');
        cy.getBySel('bonus-program-rules-rating').should('be.visible').contains('Рейтинг');
        cy.getBySel('bonus-program-rules-cancel-percentage').should('be.visible').contains('відмін');
        cy.getBySel('bonus-program-rules-max-value').should('be.visible').contains('Максимум');
        cy.getBySel('bonus-program-rules-period').should('be.visible').contains('Період');
        // cy.getBySel('bonus-program-rules-days').should('be.visible').contains('Дні тиждня');
        cy.getBySel('filters-form').should('exist').should('be.visible');
      });
    });

    it('[5043] Should available export file button', () => {
      cy.getBySel('bonus-programs-export').should('exist');
      cy.getBySel('bonus-programs-export').should('not.be.disabled');
    });
  });
}
