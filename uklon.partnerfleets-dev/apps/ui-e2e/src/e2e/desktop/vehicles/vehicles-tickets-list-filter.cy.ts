import { TicketStatus, TicketType } from '@constant';

import { FleetVehiclesTicketsListIntercept } from '../../../support/interceptor/vehicles/tickets-list';
import { AccountKind, getAccountByKind, isMockingData } from '../../../support/utils';

const fleetId = '*';
const licensePlate = 'CIDCEWASJ';

const getFleetVehicleTickets = (licensePlateParam: string, statusParam: string): FleetVehiclesTicketsListIntercept => {
  return new FleetVehiclesTicketsListIntercept(
    fleetId,
    `license_plate=${licensePlateParam}&status=${statusParam}&offset=0&limit=30`,
  );
};

const allResponse = [
  {
    created_at: 1_727_691_852,
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

const filteredResponse = [
  {
    created_at: 1_727_691_852,
    id: 'fed49997-9d4f-4269-8bb3-b4d3f094dc0d',
    license_plate: 'CIDCEWASJ',
    status: TicketStatus.REVIEW,
    type: TicketType.VEHICLE_TO_FLEET_ADDITION,
    model_id: '93d1ae2a-17f0-4e29-842e-b866eddfd8ed',
    model: 'Audi',
    make: 'A8',
    make_id: '93d1ae2a-17f0-4e29-842e-b866eddfd8ed',
    production_year: 2024,
  },
];

describe.skip('Vehicles Tickets List Filter', () => {
  before(() => {
    if (isMockingData()) {
      return;
    }
    const notificationFleetAccount = getAccountByKind(AccountKind.NOTIFICATION_OWNER);
    cy.loginWithSession('fleetWallet', notificationFleetAccount.username, notificationFleetAccount.password);
    cy.visit('/workspace/vehicles/create');
    cy.getBySel('licenseplate-control').click();
    cy.getBySel('licenseplate-control').type('CIDCEWASJ');
    cy.getBySel('create-ticket-btn').then(($btn) => {
      if ($btn.is(':enabled')) {
        cy.getBySel('create-ticket-btn').click();
      }
    });
  });

  beforeEach(() => {
    if (isMockingData()) {
      const fleetVehicleTicketsAll = getFleetVehicleTickets('', 'All');
      fleetVehicleTicketsAll.apply({ name: 'ok', props: { items: allResponse } });

      const fleetVehicleTicketsByPlate = getFleetVehicleTickets(licensePlate, 'All');
      fleetVehicleTicketsByPlate.apply({ name: 'ok', props: { items: filteredResponse } });

      const fleetVehicleTicketsByStatus = getFleetVehicleTickets('', 'Review');
      fleetVehicleTicketsByStatus.apply({ name: 'ok', props: { items: filteredResponse } });
    }
    const notificationFleetAccount = getAccountByKind(AccountKind.NOTIFICATION_OWNER);
    cy.loginWithSession('fleetWallet', notificationFleetAccount.username, notificationFleetAccount.password);
    cy.visit('/workspace/vehicles#tickets');
  });

  it('[5541] should filter by license plate', () => {
    cy.getBySel('vehicles-ticket-autocomplete').type(licensePlate);
    cy.getBySel('td-license-plate').should('contain', licensePlate);
  });

  it.skip('[5541] should filter by status', () => {
    cy.getBySel('status-control').click();
    cy.getBySel('status-item-Draft').click();
    cy.getBySel('td-status').should('contain', 'Черновий');
  });

  after(() => {
    cy.visit('/workspace/vehicles#tickets');
    cy.getBySel('vehicles-ticket-autocomplete').type(licensePlate);
    cy.getBySel('vehicle-ticket-delete-btn').click();
    cy.getBySel('accept-btn').click();
  });
});
