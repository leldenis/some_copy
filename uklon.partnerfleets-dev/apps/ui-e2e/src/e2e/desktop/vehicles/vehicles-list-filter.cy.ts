import { FleetVehiclesListIntercept } from '../../../support/interceptor/vehicles/list';
import { vehiclePhotoControlHasActiveTicketsIntercept } from '../../../support/interceptor/vehicles/photo-control-has-active-tickets';
import { isMockingData } from '../../../support/utils';

const fleetVehiclesList = new FleetVehiclesListIntercept('*', 'offset=0&limit=30');
const filteredByLicensePlateFleetVehiclesList = new FleetVehiclesListIntercept(
  '*',
  'offset=0&limit=30&licencePlate=AQA7297',
);
const filteredByBodyTypeFleetVehiclesList = new FleetVehiclesListIntercept('*', 'offset=0&limit=30&bodyType=Sedan');

if (isMockingData()) {
  describe('Vehicle list filter', () => {
    const paginationSize = Cypress.env('paginationSize');

    beforeEach(() => {
      cy.clearLocalStorage();
      if (isMockingData()) {
        fleetVehiclesList.apply({ name: 'ok', props: { count: 30, total: 40 } });
        vehiclePhotoControlHasActiveTicketsIntercept.apply({ name: 'ok' });
      }
      cy.loginWithSession('VehicleListFilter');
      cy.visit('/');
      cy.getBySel('menu-toggle-btn').as('menu');
      cy.getBySel('side-nav-menu-vehicles').as('link');
      cy.getBySel('logout').as('logout');
      cy.get('@menu').click();
      cy.get('@link').click();
    });

    describe('When search vehicles by', () => {
      beforeEach(() => {
        cy.get('[data-cy="vehicles-wrap"]').as('host');
        cy.get('@host').find('[data-cy="filter"]').as('filter');
        cy.get('@host').find('[data-cy="table"]').as('table');
        cy.get('@table').find('[data-cy^="row-"]').as('rows');
      });

      describe('when reset filter', () => {
        beforeEach(() => {
          if (isMockingData()) {
            filteredByLicensePlateFleetVehiclesList.apply({ name: 'ok', props: { count: 1, total: 1 } });
          }
          cy.get('@filter').find('[data-cy="filter-License-Plate"]').type('AQA7297');
        });

        it('should reset filter on clear button pressed', () => {
          cy.getBySel('filter-reset-btn').should('exist').click();
          cy.get('@rows').should('have.length', paginationSize);
        });
      });

      describe('Licence plate', () => {
        beforeEach(() => {
          cy.get('@filter').find('[data-cy="filter-License-Plate"]').as('license');
        });

        it('should have a placeholder', () => {
          const expected = 'Держ. номер';
          // eslint-disable-next-line cypress/unsafe-to-chain-command
          cy.get('@license').focus().invoke('attr', 'placeholder').should('contain', expected);
        });

        describe('when filtering', () => {
          beforeEach(() => {
            if (isMockingData()) {
              filteredByLicensePlateFleetVehiclesList.apply({ name: 'ok', props: { count: 1, total: 1 } });
            }
            cy.get('@license').type('AQA7297');
          });

          it('[5041] should find one vehicle', () => {
            cy.get('@rows').should('have.length', 1);
          });
        });
      });

      describe('Priority', () => {
        beforeEach(() => {
          cy.get('@filter').find('[data-cy="filter-Priority"]').as('priority');
          cy.get('@priority').click();
          cy.getBySel('filter-Priority-option').as('options');
        });

        describe('when active have been selected', () => {
          beforeEach(() => {
            cy.get('@options').eq(2).as('active');
            cy.get('@active').click();
          });

          it('should show no results', () => {
            cy.get('@host').find('[data-cy="no-data"]').should('exist');
          });
        });

        describe('filter options', () => {
          afterEach(() => {
            cy.get('@options').eq(0).click();
          });

          it('should have a 3 options', () => {
            cy.get('@options').should('have.length', 3);
          });

          [{ value: 'Усі' }, { value: 'Не активний' }, { value: 'Активний' }].forEach(({ value }, index) => {
            it(`option should be named as '${value}'`, () => {
              cy.get('@options').eq(index).as('option');
              cy.get('@option').should('contain.text', value);
            });
          });
        });
      });

      describe('Branding', () => {
        beforeEach(() => {
          cy.get('@filter').find('[data-cy="filter-has-Branding"]').as('priority');
          cy.get('@priority').click();
          cy.getBySel('filter-Branding-option').as('options');
        });

        describe('when with branding have been selected', () => {
          beforeEach(() => {
            cy.get('@options').eq(2).as('hasBranding');
            cy.get('@hasBranding').click();
          });

          it('should show no results', () => {
            cy.get('@host').find('[data-cy="no-data"]').should('exist');
          });
        });

        describe('filter options', () => {
          afterEach(() => {
            cy.get('@options').eq(0).click();
          });

          it('should have a 3 options', () => {
            cy.get('@options').should('have.length', 3);
          });

          [{ value: 'Усі авто' }, { value: 'Без брендування' }, { value: 'З брендуванням' }].forEach(
            ({ value }, index) => {
              it(`option should be named as '${value}'`, () => {
                cy.get('@options').eq(index).as('option');
                cy.get('@option').should('contain.text', value);
              });
            },
          );
        });
      });

      describe('Body type', () => {
        beforeEach(() => {
          if (isMockingData()) {
            filteredByBodyTypeFleetVehiclesList.apply({ name: 'ok', props: { count: 8, total: 8 } });
          }
          cy.get('@filter').find('[data-cy="filter-Body-type"]').as('priority');
          cy.get('@priority').click();
          cy.getBySel('filter-Body-type-option').as('options');
        });

        describe('when sedan have been selected', () => {
          beforeEach(() => {
            cy.get('@options').eq(0).as('sedan');
            cy.get('@sedan').click();
          });

          it('should show 8 results', () => {
            cy.get('@rows').should('have.length', 8);
          });
        });

        describe('filter options', () => {
          afterEach(() => {
            cy.get('@options').eq(0).click();
          });

          it('should have a 11 options', () => {
            cy.get('@options').should('have.length', 11);
          });

          [
            { value: 'Седан' },
            { value: 'Хетчбек' },
            { value: 'Мінівен' },
            { value: 'Кросовер' },
            { value: 'Фургон' },
            { value: 'Купе' },
            { value: 'Пікап' },
            { value: 'Універсал' },
            { value: 'Позашляховик' },
            { value: 'Вантажівка' },
            { value: 'Ліфтбек' },
          ].forEach(({ value }, index) => {
            it(`option should be named as '${value}'`, () => {
              cy.get('@options').eq(index).as('option');
              cy.get('@option').should('contain.text', value);
            });
          });
        });
      });
    });
  });
}
