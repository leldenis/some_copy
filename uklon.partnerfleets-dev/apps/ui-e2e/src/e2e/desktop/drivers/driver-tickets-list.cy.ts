import { TicketStatus } from '@constant';

import { UklonGarageApplicationsIntercept } from '../../../support/interceptor';
import { fleetDriverListIntercept } from '../../../support/interceptor/drivers';
import { DriverPhotoControlHasActiveTicketsIntercept } from '../../../support/interceptor/drivers/photo-control/has-active-tickets';
import { FleetDriverTicketsListIntercept } from '../../../support/interceptor/drivers/tickets/list';
import { isMockingData } from '../../../support/utils';

const fleetId = '*';
const driverTicketsList = new FleetDriverTicketsListIntercept(fleetId, 'limit=30');
const driverTicketsListFilteredByPhone = new FleetDriverTicketsListIntercept(fleetId, 'limit=30&phone=576019222837');
const driverTicketsListFilteredByStatus = new FleetDriverTicketsListIntercept(fleetId, 'limit=30&status=Rejected');
const garageIntercept = new UklonGarageApplicationsIntercept('*');
const hasActiveTickets = new DriverPhotoControlHasActiveTicketsIntercept('*');

const filteredList = [
  {
    id: '594c820a-effe-4fb7-adf5-686a9ac39b3f',
    first_name: 'AQAFirst',
    last_name: 'AQALast',
    phone: '576019222837',
    created_at: 1_727_691_852,
    status: TicketStatus.DRAFT,
  },
];
describe('Driver-Tickets-List', () => {
  beforeEach(() => {
    if (isMockingData()) {
      driverTicketsList.apply({ name: 'ok', props: { count_items: 1 } });
      driverTicketsListFilteredByPhone.apply({ name: 'ok', props: { items: filteredList } });
      driverTicketsListFilteredByStatus.apply({ name: 'ok', props: { items: filteredList } });
      garageIntercept.apply({ name: 'ok' });
      hasActiveTickets.apply({ name: 'ok' });
      fleetDriverListIntercept.apply({ name: 'ok' });
    }
    cy.loginWithSession('driverTicketsList');
    cy.visit('/');
    cy.getBySel('menu-toggle-btn').should('exist').click();
    cy.getBySel('side-nav-menu-drivers').click();
  });

  it('[5527] should have a Tickets tab', () => {
    cy.getBySel('tab-label-DriversTickets').should('exist');
  });

  beforeEach(() => {
    cy.getBySel('tab-label-DriversTickets').click();
  });

  describe('When using tickets list', () => {
    it('[PF-314] should header exist', () => {
      cy.getBySel('header-row').should('exist');
    });

    it('[PF-315] should have a name column', () => {
      cy.getBySel('header-cell-Name').should('exist');
    });

    it('[PF-316] should have a phone column', () => {
      cy.getBySel('header-cell-Phone').should('exist');
    });

    it('[PF-317] should have a date column', () => {
      cy.getBySel('header-cell-Date').should('exist');
    });

    it('[PF-318] should have a status column', () => {
      cy.getBySel('header-cell-Status').should('exist');
    });
  });

  it('[5528] should filter by phone', () => {
    cy.getBySel('driver-ticket-filter-Phone').type('576019222837');
    cy.getBySel('cell-Phone').should('contain', '576019222837');
  });

  describe('When using status filter', () => {
    beforeEach(() => {
      cy.getBySel('drivers-ticket-filter-Status').click();
    });

    it('[5528] should open status selector', () => {
      cy.getBySel('drivers-tickets-Status').should('be.visible');
      cy.get('#mat-option-1').click();
    });

    it('[5528] should filter by status', () => {
      cy.get('#mat-option-1').click();
    });
  });

  if (isMockingData()) {
    describe('BlockedByManager ticket status', () => {
      beforeEach(() => {
        const [item] = filteredList;
        const tickets = [
          { ...item, status: TicketStatus.REVIEW },
          { ...item, status: TicketStatus.BLOCKED_BY_MANAGER },
        ];
        driverTicketsList.apply({ name: 'ok', props: { items: tickets } });
        cy.reload();
      });

      it('[7648] should display same status for Review and BlockedByManager statuses', () => {
        cy.getBySel('cell-Status').eq(0).should('be.visible').should('contain', 'На опрацюванні у менеджера');
        cy.getBySel('cell-Status').eq(1).should('be.visible').should('contain', 'На опрацюванні у менеджера');
      });
    });
  }
});
