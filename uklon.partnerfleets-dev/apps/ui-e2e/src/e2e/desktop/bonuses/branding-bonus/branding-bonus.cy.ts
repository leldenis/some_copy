import { BrandingCalculationPeriodsInterceptor } from '../../../../support/interceptor/bonuses/branding-bonus/calculation-periods';
import { BrandingProgramsCalculationsListIntercept } from '../../../../support/interceptor/bonuses/branding-bonus/list';
import { BrandingProgramsDetailsInterceptor } from '../../../../support/interceptor/bonuses/branding-bonus/program-details';
import { BrandingProgramNamesInterceptor } from '../../../../support/interceptor/bonuses/branding-bonus/program-names';
import { FleetVehiclesListIntercept } from '../../../../support/interceptor/vehicles/list';
import { isMockingData } from '../../../../support/utils';

import {
  PERIODS_ACTIVE_PROGRAM_MOCK,
  PERIODS_DELETED_PROGRAM_MOCK,
  PROGRAM_DETAILS_ORDERS_MOCK,
  PROGRAM_NAMES_MOCK,
  PROGRAMS_CALCULATIONS_LIST_MOCK,
} from './branding-bonus.mock';

function selectProgramFilter(index = 0, optionCount = 2): void {
  cy.getBySel('program-name-filter').should('be.visible').click();
  cy.getBySel('program-name-filter-option').should('be.visible').should('have.length', optionCount);
  cy.getBySel('program-name-filter-option').eq(index).click();
}

function selectPeriodFilter(index = 1, optopnCount = 4): void {
  cy.getBySel('period-filter').should('be.visible').click();
  cy.getBySel('period-filter-option').should('be.visible').should('have.length', optopnCount);
  cy.getBySel('period-filter-option').eq(index).click();
}

if (isMockingData()) {
  describe('Branding bonuses page', () => {
    const fleetId = '*';

    const programNames = new BrandingProgramNamesInterceptor('*');
    const calculationPeriods = new BrandingCalculationPeriodsInterceptor(fleetId, '*');
    const programsCalculationsList = new BrandingProgramsCalculationsListIntercept('*', '*', '*');
    const brandingProgramsDetails = new BrandingProgramsDetailsInterceptor('*');

    const fleetVehiclesList = new FleetVehiclesListIntercept('*', 'licencePlate=&limit=30&offset=0');

    beforeEach(() => {
      programNames.apply({ name: 'ok', props: { items: PROGRAM_NAMES_MOCK } });
      calculationPeriods.apply({ name: 'ok', props: { items: PERIODS_ACTIVE_PROGRAM_MOCK } });
      programsCalculationsList.apply({ name: 'ok', props: { items: PROGRAMS_CALCULATIONS_LIST_MOCK } });
      brandingProgramsDetails.apply({ name: 'ok', props: { orders: PROGRAM_DETAILS_ORDERS_MOCK } });
      fleetVehiclesList.apply({ name: 'ok', props: { count: 3 } });

      cy.clearLocalStorage();
      cy.loginWithSession('brandingBonuses');
      cy.visit('workspace/bonuses#branding-bonus');
    });

    it('should open bonus page', () => {
      cy.url().should('includes', '/workspace/bonuses');
      cy.getBySel('branding-bonus-container').should('be.visible');
    });

    describe('should exist all elements on the page', () => {
      it('should display filters', () => {
        cy.getBySel('program-name-filter').should('be.visible');
        cy.getBySel('period-filter').should('be.visible').should('have.attr', 'aria-disabled');
        cy.getBySel('vehicle-control').should('be.exist');
        cy.getBySel('bonus-programs-export-button').should('be.visible').should('have.attr', 'disabled');
      });

      it('should display empty state', () => {
        cy.getBySel('branding-bonus-programs-list').should('not.exist');
        cy.getBySel('no-data').should('be.visible');
      });
    });

    describe('[8097] should display branding programs calculation of active/deleted programs', () => {
      it('should filter data by active program and corresponding period', () => {
        cy.getBySel('program-name-filter').should('be.visible').click();
        cy.getBySel('program-name-filter-option').should('be.visible').should('have.length', 2);
        cy.getBySel('program-name-filter-option').eq(0).click();
        cy.getBySel('period-filter').should('be.visible').click();
        cy.getBySel('period-filter-option').should('be.visible').should('have.length', 4);
        cy.getBySel('period-filter-option').eq(0).click();
        cy.getBySel('branding-bonus-programs-list').should('be.visible');
        cy.getBySel('bonus-program-details').should('be.visible');
      });

      it('should filter data by deleted program and corresponding period', () => {
        calculationPeriods.apply({ name: 'ok', props: { items: PERIODS_DELETED_PROGRAM_MOCK } });
        cy.reload();
        cy.getBySel('program-name-filter').should('be.visible').click();
        cy.getBySel('program-name-filter-option').should('be.visible').should('have.length', 2);
        cy.getBySel('program-name-filter-option').eq(1).click();
        cy.getBySel('period-filter').should('be.visible').click();

        cy.getBySel('period-filter-option').should('be.visible').should('have.length', 2);
        cy.getBySel('period-filter-option').eq(0).click();
        cy.getBySel('branding-bonus-programs-list').should('be.visible');
        cy.getBySel('bonus-program-details').should('be.visible');
      });
    });

    describe('[4776] should filter data by period', () => {
      it('should available program, period, license plate filters', () => {
        cy.getBySel('program-name-filter').should('be.visible');
        cy.getBySel('period-filter').should('be.visible').should('have.attr', 'aria-disabled');
        cy.getBySel('vehicle-control').should('be.exist');
      });

      it('should filter by program and period', () => {
        selectProgramFilter();
        selectPeriodFilter();
        cy.getBySel('branding-bonus-programs-list').should('be.visible');
        cy.getBySel('bonus-program-details').should('be.visible');
      });

      it('should filter by other program', () => {
        selectProgramFilter(1);
        selectPeriodFilter(3);
        cy.getBySel('branding-bonus-programs-list').should('be.visible');
        cy.getBySel('bonus-program-details').should('be.visible');
      });
    });

    describe('should display grid data by filtered other program', () => {
      beforeEach(() => {
        selectProgramFilter(1);
        selectPeriodFilter(3);
      });

      it('should display grid and program details', () => {
        cy.getBySel('branding-bonus-programs-list').should('be.visible');
        cy.getBySel('bonus-program-details').should('be.visible');
      });

      it('should display headers in grid', () => {
        cy.getBySel('bonus-programs-list-table-row').should('have.length', 1);
        cy.getBySel('program-list-licence-title').should('be.visible').should('have.text', 'Держ. номер');
        cy.getBySel('program-list-licence-subtitle').should('be.visible').should('contain.text', 'Авто');
        cy.getBySel('program-list-cancellation-percentage')
          .should('be.visible')
          .should('contain', 'Відсоток відмін по авто');
        cy.getBySel('program-list-cancellation-percentage-icon').should('be.visible').trigger('mouseenter');
        cy.get('.tippy-content')
          .should('be.visible')
          .should('contain', 'Підрахунок виконується у розрізі конкретного авто та періоду дії програми');
        cy.getBySel('program-list-orders-completed').should('be.visible').should('contain', 'Враховані замовлення');
        cy.getBySel('program-list-orders-completed-icon').should('be.visible').trigger('mouseenter');
        cy.get('.tippy-content')
          .should('be.visible')
          .should(
            'contain',
            'Враховані тільки ті замовлення, в яких параметри водія відповідали вимогам програми на момент виконання замовлення',
          );
        cy.getBySel('program-list-earn').should('be.visible').should('contain', 'Досягнуто');
        cy.getBySel('program-list-driver').should('be.visible').should('contain', 'Водій на авто');
        cy.getBySel('program-list-driver-rating').should('be.visible').should('contain', 'Поточний рейтинг водія');
      });

      it('should display valid data', () => {
        cy.getBySel('bonus-programs-list-table-row').should('have.length', 1);
        cy.getBySel('program-list-licence-link')
          .should('be.visible')
          .should('have.attr', 'href')
          .should('contain', '/workspace/vehicles/details/1d2905fe-ba16-4f8d-9f98-c5ad66903645');
        cy.getBySel('program-list-licence-link').should('contain', 'KA0000KA');
        cy.getBySel('program-list-vehicle-branded-icon').should('be.visible');
        cy.getBySel('program-list-vehicle-branded-icon-inactive').should('not.exist');
        cy.getBySel('program-list-vehicle-make-model').should('be.visible').should('contain', 'Aero 30');
        cy.getBySel('program-list-cancellation-percentage-value').should('be.visible').should('contain', '0.00%');
        cy.getBySel('program-list-orders-completed-progress-bar').should('be.exist');
        cy.getBySel('program-list-orders-completed-value').should('be.visible').should('contain', '0/3');
        cy.getBySel('program-list-earn-value').should('be.visible').should('contain', '₴ 0.00');
        cy.getBySel('program-list-driver-link').should('be.visible').should('contain', '-');
        cy.getBySel('program-list-driver-rating-value').should('be.visible').should('contain', '-');
      });
    });

    describe('[4778] Show display program rules', () => {
      beforeEach(() => {
        selectProgramFilter();
        selectPeriodFilter();
      });

      it('should display program details titles', () => {
        cy.getBySel('bonus-program-details-title').should('be.visible').contains('Поточні вимоги програми брендування');
        cy.getBySel('bonus-program-details-subtitle').should('be.visible').contains('Дані оновлюються 1 раз на добу');
        cy.getBySel('bonus-details-branding-type').should('be.visible').contains('Тип брендування');
        cy.getBySel('bonus-program-details-rating').should('be.visible').contains('Рейтинг');
        cy.getBySel('bonus-program-details-cancel-percentage').should('be.visible').contains('% відмін');
        cy.getBySel('bonus-program-details-max-value-title').should('be.visible').contains('Максимум');
        cy.getBySel('bonus-program-details-days').should('be.visible').contains('Дні тижня');
      });

      it('should display program details values', () => {
        cy.getBySel('bonus-program-details').should('be.visible');
        cy.getBySel('bonus-details-branding-type-value').should('be.visible').contains('Усі');
        cy.getBySel('bonus-program-details-rating-value').should('be.visible').contains('від 4');
        cy.getBySel('bonus-program-details-cancel-percentage-value').should('be.visible').contains('до 10.00%');
        cy.getBySel('bonus-program-details-max-value').should('be.visible').contains('₴ 50.00');
        cy.getBySel('bonus-program-details-days-value').should('be.visible').contains('Пн Пт');
      });
    });

    it('[5043] Should available export file button', () => {
      cy.getBySel('bonus-programs-export-button').should('be.visible').should('have.attr', 'disabled');
      selectProgramFilter();
      selectPeriodFilter();
      cy.getBySel('bonus-programs-export-button').should('be.visible');
      cy.getBySel('bonus-programs-export-button').should('not.be.disabled');
    });
  });
}
