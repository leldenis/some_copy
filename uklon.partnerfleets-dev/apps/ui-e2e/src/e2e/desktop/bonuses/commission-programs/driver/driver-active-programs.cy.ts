import { CommissionProgramType } from '@constant';

import { BrandingCalculationPeriodsOldInterceptor } from '../../../../../support/interceptor/bonuses/branding-bonus-old/branding-calculation-periods-old';
import { BrandingCalculationsProgramOldInterceptor } from '../../../../../support/interceptor/bonuses/branding-bonus-old/branding-calculations-program-old';
import { BrandingBonusProgramsListOldIntercept } from '../../../../../support/interceptor/bonuses/branding-bonus-old/list';
import { CommissionProgramsListIntercept } from '../../../../../support/interceptor/bonuses/commission-programs/list';
import { FleetDriverListIntercept } from '../../../../../support/interceptor/drivers';
import { FleetWalletIntercept } from '../../../../../support/interceptor/finance/fleet-wallet';
import { FleetVehiclesListIntercept } from '../../../../../support/interceptor/vehicles/list';
import { isMockingData } from '../../../../../support/utils';

if (isMockingData()) {
  describe('Driver commission programs - active programs', () => {
    const drivers = new FleetDriverListIntercept('*');
    const fleetVehiclesListIntercept = new FleetVehiclesListIntercept('*', '*');
    const fleetWalletIntercept = new FleetWalletIntercept();
    const activePrograms = new CommissionProgramsListIntercept('drivers', CommissionProgramType.ACTIVE);
    const brandingBonusProgramsListOldIntercept = new BrandingBonusProgramsListOldIntercept('*');
    const brandingCalculationsProgramOldInterceptor = new BrandingCalculationsProgramOldInterceptor();
    const brandingCalculationPeriodsOldInterceptor = new BrandingCalculationPeriodsOldInterceptor();

    beforeEach(() => {
      drivers.apply({ name: 'ok' });
      fleetVehiclesListIntercept.apply({ name: 'ok' });
      fleetWalletIntercept.apply({ name: 'ok' });
      activePrograms.apply({ name: 'ok' });
      brandingBonusProgramsListOldIntercept.apply({ name: 'ok' });
      brandingCalculationsProgramOldInterceptor.apply({ name: 'ok' });
      brandingCalculationPeriodsOldInterceptor.apply({ name: 'ok' });

      cy.clearLocalStorage();
      cy.loginWithSession('commissionPrograms');
      cy.visit('workspace/general');
      cy.getBySel('menu-toggle-btn').should('be.visible').as('menu');
      cy.getBySel('side-nav-menu-bonuses').click();
      cy.getBySel('commission-tab').click();
    });

    it('[5626] should exist commission programs tab with sub tabs: active, planned, archived', () => {
      cy.getBySel('commission-tab').should('be.visible');
      cy.getBySel('commission-tab-active').should('be.visible');
      cy.getBySel('commission-tab-planned').should('be.visible');
      cy.getBySel('commission-tab-archived').should('be.visible');
    });

    it('[5627] should display tooltip - what is commission programs?', () => {
      cy.getBySel('programs-tooltip').should('be.visible').click();
      cy.getBySel('programs-tooltip-content').should('exist');
      cy.getBySel('programs-tooltip-rule1')
        .should('exist')
        .should(
          'contain.text',
          'Комісійні програми - це програми для водіїв, які дозволяють отримати знижену комісію після виконання необхідної кількості замовлень',
        );
      cy.getBySel('programs-tooltip-rule2')
        .should('exist')
        .should(
          'contain.text',
          'Виконуючи замовлення під час дії програми, водій отримує менший відсоток комісії на всі поїздки до закінчення програми',
        );
    });

    it('[5628] should open active sub tab by default', () => {
      cy.getBySel('commission-tab-active').should('be.visible').should('have.class', 'active');
    });

    it('[5629] should display empty state if not any programs', () => {
      activePrograms.apply({ name: 'ok', props: { count: 0 } }).as('getPrograms');

      cy.wait('@getPrograms').then(() => {
        cy.getBySel('loading-indicator').should('not.exist');
        cy.getBySel('no-data').should('exist').should('be.visible');
      });
    });

    it('[5630] should display active programs list', () => {
      activePrograms.apply({ name: 'ok', props: { count: 2 } }).as('getPrograms');

      cy.wait('@getPrograms').then(() => {
        cy.get('@getPrograms').should('exist');
        cy.getBySel('full-name').should('be.visible').contains('Прізвище та імʼя');
        cy.getBySel('signal').should('be.visible').contains('Позивний');
        cy.getBySel('phone').should('be.visible').contains('Номер телефону');
        cy.getBySel('program').should('be.visible').contains('Назва програми');
        cy.getBySel('progress').should('be.visible').contains('Зарахування прогресу');
        cy.getBySel('period').should('be.visible').contains('Період');
        cy.getBySel('orders-completed').should('be.visible').contains('Виконано замовлень');
        cy.getBySel('rating').should('be.visible').contains('Рейтинг та вимоги');
        cy.getBySel('commission').should('be.visible').contains('Поточна комісія');
        cy.getBySel('used-profit-budget').should('be.visible').contains('Сума економії');
        cy.getBySel('profit-budget').should('be.visible').contains('Бюджет економії');
      });
    });

    it('[5632] should expanded view', () => {
      cy.getBySel('active-commission-programs-list').should('exist');
      cy.getBySel('expanded-icon').first().should('exist').click();
      cy.getBySel('expanded-view-desktop').should('exist').should('be.visible');
      cy.getBySel('current-completed-orders')
        .should('be.visible')
        .invoke('text')
        .then((text) => {
          const numberValue = Number.parseFloat(text);
          expect(numberValue).to.be.at.least(0);
        });
      cy.getBySel('progress-bar').should('exist');
      cy.getBySel('progress-bar-whole-range-value').should('be.visible');
      cy.getBySel('orders-progress-stepper').should('exist');
    });

    it('[5633] should filter active programs by driver filter', () => {
      cy.getBySel('drivers-control').should('exist');
      cy.getBySel('filter-reset-btn').should('not.exist');
      cy.useDriverFilter();
      activePrograms.apply({ name: 'ok', props: { count: 1 } });
      cy.getBySel('active-commission-programs-list').should('exist');
      cy.getBySel('filter-reset-btn').should('exist').click();
    });

    it('[5637] should display requirement panel', () => {
      activePrograms.apply({ name: 'ok', props: { count: 1, driver_rating: 300, min_rating: 4 } });
      cy.getBySel('expanded-icon').should('exist').click();
      cy.getBySel('expanded-view-desktop').should('exist').should('be.visible');
      cy.getBySel('requirement-panel').should('be.visible');
    });

    it('[5638] should driver rating is red if rating less than requirement', () => {
      activePrograms.apply({ name: 'ok', props: { count: 1, driver_rating: 300, min_rating: 4 } });
      cy.getBySel('driver-rating')
        .should('exist')
        .should('be.visible')
        .should('have.class', 'tw-text-accent-coral-light');
    });

    it('[5639] should show budget tooltip', () => {
      cy.getBySel('profit-budget-tooltip').should('be.visible').click();
      cy.getBySel('profit-budget-tooltip-rule1')
        .should('exist')
        .contains('Сума економії - фактична сума економії в рамках комісійної програми.');
      cy.getBySel('profit-budget-tooltip-rule2')
        .should('exist')
        .contains('Бюджет економії - загальна сума економії виділена в рамках комісійної програми');
    });

    it('[5640] should progress bar has green color', () => {
      activePrograms.apply({ name: 'ok', props: { count: 1, driver_rating: 500, min_rating: 4, completed_orders: 4 } });
      cy.getBySel('expanded-icon').should('exist').click();
      cy.getBySel('expanded-view-desktop').should('exist').should('be.visible');
      cy.getBySel('progress-bar').should('exist');
      cy.getBySel('progress-bar-leaner')
        .should('be.visible')
        .should('have.css', 'background-color', 'rgb(51, 204, 161)');
    });

    it('[5641] should redirect to driver details page by click to full name', () => {
      cy.getBySel('driver-full-name-link')
        .should('exist')
        .should('have.attr', 'href')
        .and('match', /\/workspace\/drivers\/details\/[\da-z-]+$/);
    });

    it('[5630] should display 2 programs for one driver', () => {
      activePrograms.apply({
        name: 'ok',
        props: { count: 2, driver_id: '2656c75a-a5ef-4c42-a71d-d0b18b6c1714', always_add_progress_if_satisfied: true },
      });
      cy.getBySel('active-commission-programs-list').should('exist');
      cy.getBySel('progress-value').should('exist').contains('Завжди');
    });

    it('[5722] should display tooltip about program progress', () => {
      activePrograms.apply({
        name: 'ok',
        props: { count: 1, driver_id: '2656c75a-a5ef-4c42-a71d-d0b18b6c1714', always_add_progress_if_satisfied: true },
      });
      cy.getBySel('progress-tooltip').should('exist').click();
      cy.getBySel('progress-tooltip-rule1')
        .should('exist')
        .contains(
          '“Коли програма активна” - виконані замовлення будуть додаватися до прогресу програми, якщо вона є найбільш вигідною для драйвера серед усіх програм.',
        );
      cy.getBySel('progress-tooltip-rule2')
        .should('exist')
        .contains(
          '“Завжди” - при умові, що програма співпадає по параметрам замовлення, вони будуть враховані, навіть якщо діє інша програма.',
        );
    });
  });
}
