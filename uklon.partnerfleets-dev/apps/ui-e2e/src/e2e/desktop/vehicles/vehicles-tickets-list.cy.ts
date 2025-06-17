import { TicketStatus, TicketType } from '@constant';

import { FleetVehiclesListIntercept } from '../../../support/interceptor/vehicles/list';
import { vehiclePhotoControlHasActiveTicketsIntercept } from '../../../support/interceptor/vehicles/photo-control-has-active-tickets';
import { FleetVehiclesTicketsListIntercept } from '../../../support/interceptor/vehicles/tickets-list';
import { AccountKind, getAccountByKind, isMockingData } from '../../../support/utils';

const fleetId = '*';

const fleetVehicleTicketsAll = new FleetVehiclesTicketsListIntercept(fleetId, `*`);
const vehicleList = new FleetVehiclesListIntercept('*', '*');

const response = [
  {
    created_at: 1_724_161_521,
    id: '95a18719-6ead-4bd9-88f4-f1ffc442508e',
    license_plate: 'AQA12441',
    status: TicketStatus.REVIEW,
    type: TicketType.VEHICLE_TO_FLEET_ADDITION,
    model_id: '93d1ae2a-17f0-4e29-842e-b866eddfd8ed',
    model: 'Audi',
    make: 'A8',
    make_id: '93d1ae2a-17f0-4e29-842e-b866eddfd8ed',
    production_year: 2024,
  },
  {
    created_at: 1_727_691_852,
    id: 'fed49997-9d4f-4269-8bb3-b4d3f094dc0d',
    license_plate: 'CIDCEWASJ',
    status: TicketStatus.DRAFT,
    type: TicketType.VEHICLE_TO_FLEET_ADDITION,
    model_id: '93d1ae2a-17f0-4e29-842e-b866eddfd8ed',
    model: 'Audi',
    make: 'A8',
    make_id: '93d1ae2a-17f0-4e29-842e-b866eddfd8ed',
    production_year: 2024,
  },
];

describe('Vehicle tickets list', () => {
  beforeEach(() => {
    if (isMockingData()) {
      fleetVehicleTicketsAll.apply({ name: 'ok', props: { items: response } });
      vehiclePhotoControlHasActiveTicketsIntercept.apply({ name: 'ok' });
      vehicleList.apply({ name: 'ok' });
    }
    const notificationFleetAccount = getAccountByKind(AccountKind.NOTIFICATION_OWNER);
    cy.loginWithSession('fleetWallet', notificationFleetAccount.username, notificationFleetAccount.password);
    cy.visit('/');
    cy.getBySel('menu-toggle-btn').should('exist').click();
    cy.getBySel('side-nav-menu-vehicles').click();
  });

  it('should have a tickets tab', () => {
    cy.getBySel('vehicle-tabs-tickets').should('exist');
  });

  beforeEach(() => {
    cy.getBySel('vehicle-tabs-tickets').click();
  });

  describe('Vehicle tickets list', () => {
    it('[5540] should display vehicle ticket list', () => {
      cy.getBySel('vehicle-tickets-list').should('exist').should('be.visible');
    });

    if (isMockingData()) {
      it('should have header row', () => {
        cy.getBySel('vehicle-tickets-header-row').should('exist').should('be.visible');
      });

      it('should have data row', () => {
        cy.getBySel('vehicle-tickets-item-row').should('exist').should('be.visible');
      });

      describe('Header row', () => {
        it('should have a license plate column', () => {
          cy.getBySel('th-license-plate').should('be.visible').should('contain', 'Держ. номер');
        });

        it('should have a create at column', () => {
          cy.getBySel('th-created-at').should('be.visible').should('contain', 'Дата подання');
        });

        it('should have a status column', () => {
          cy.getBySel('th-status').should('be.visible').should('contain', 'Статус');
        });

        it('should have a deletion column', () => {
          cy.getBySel('th-deletion').should('be.visible');
        });
      });

      describe('Data row', () => {
        it('should have a license plate cell', () => {
          cy.getBySel('td-license-plate').should('be.visible').should('contain', 'CIDCEWASJ');

          cy.getBySel('td-license-plate')
            .find('a')
            .should('exist')
            .should('have.attr', 'href', '/workspace/vehicles/ticket/95a18719-6ead-4bd9-88f4-f1ffc442508e');
        });

        it('should have a create at cell', () => {
          cy.getBySel('td-created-at').should('be.visible').should('contain', '20.08.2024');
        });

        it('should have a status cell', () => {
          cy.getBySel('td-status').should('be.visible').should('contain', 'Черновий');
        });

        describe('deletion cell', () => {
          it('should have a deletion cell', () => {
            cy.getBySel('td-deletion').should('be.visible');
          });

          describe('if ticket has the status is draft', () => {
            it('should have a status is draft', () => {
              cy.getBySel('td-status').should('be.visible').should('contain', 'Черновий');
            });

            it('should display delete button', () => {
              cy.getBySel('vehicle-ticket-delete-btn').should('exist').should('be.visible');
            });

            describe('should display confirmation dialog if user click to delete btn', () => {
              beforeEach(() => {
                cy.getBySel('vehicle-ticket-delete-btn').should('exist').click();
              });

              it('should display confirmation dialog after click', () => {
                cy.getBySel('confirmation-modal').should('be.visible');
              });

              it('should have a close button', () => {
                cy.getBySel('close-modal').should('be.visible');
              });

              it('should have a title', () => {
                cy.getBySel('confirmation-title').should('be.visible').should('contain', 'Вашу заявку буде видалено');
              });

              it('should have an accept button', () => {
                cy.getBySel('accept-btn').should('be.visible').should('not.be.disabled').should('contain', 'Видалити');
              });

              it('should have a decline button', () => {
                cy.getBySel('decline-btn')
                  .should('be.visible')
                  .should('not.be.disabled')
                  .should('contain', 'Скасувати');
              });
            });
          });
        });
      });

      describe('BlockedByManager ticket status', () => {
        beforeEach(() => {
          const blockedByManagerResponse = [response[0], { ...response[1], status: TicketStatus.BLOCKED_BY_MANAGER }];
          fleetVehicleTicketsAll.apply({ name: 'ok', props: { items: blockedByManagerResponse } });
          cy.reload();
        });

        it('[7649] should display same status for Review and BlockedByManager statuses', () => {
          cy.getBySel('td-status').eq(0).should('be.visible').should('contain', 'На опрацюванні у менеджера');
          cy.getBySel('td-status').eq(1).should('be.visible').should('contain', 'На опрацюванні у менеджера');
        });
      });
    }
  });
});
