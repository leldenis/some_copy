import {
  BlockedListStatusValue,
  TicketStatus,
  VehiclePhotoControlCreatingReason,
  VehiclePhotosCategory,
} from '@constant';

import { vehiclePhotoControlHasActiveTicketsIntercept } from '../../../support/interceptor/vehicles/photo-control-has-active-tickets';
import { FleetPhotoControlListIntercept } from '../../../support/interceptor/vehicles/photo-control-list';
import { AccountKind, getAccountByKind, isMockingData } from '../../../support/utils';

const fleetId = '*';
const licensePlate = 'AQA12443';

const fleetPhotoControl = new FleetPhotoControlListIntercept(fleetId, '*');

const response = [
  {
    created_at: 1_728_375_954,
    id: '1deb4ea2-802c-4882-8e9c-3d06b4ef8ca5',
    license_plate: 'AQA12444',
    status: TicketStatus.APPROVED,
    model_id: '93d1ae2a-17f0-4e29-842e-b866eddfd8ed',
    model: 'Audi',
    make: 'A8',
    make_id: '93d1ae2a-17f0-4e29-842e-b866eddfd8ed',
    production_year: 2024,
    color: 'White',
    deadline_to_send: 1_729_375_954,
    picture_types: VehiclePhotosCategory['driver_car_front_photo'],
    vehicle_status: {
      value: BlockedListStatusValue.BLOCKED,
    },
    reasons: [VehiclePhotoControlCreatingReason.OTHER],
  },
  {
    created_at: 1_728_375_954,
    id: '52a6cf23-a2b4-4ea7-ae62-3e8e431e1fd4',
    license_plate: licensePlate,
    status: TicketStatus.DRAFT,
    model_id: '93d1ae2a-17f0-4e29-842e-b866eddfd8ed',
    model: 'Audi',
    make: 'A8',
    make_id: '93d1ae2a-17f0-4e29-842e-b866eddfd8ed',
    production_year: 2024,
    color: 'White',
    deadline_to_send: 1_729_375_954,
    picture_types: VehiclePhotosCategory['driver_car_front_photo'],
    vehicle_status: {
      value: BlockedListStatusValue.BLOCKED,
    },
    reasons: [VehiclePhotoControlCreatingReason.OTHER],
  },
];

describe('Vehicle Photocontrol List', () => {
  beforeEach(() => {
    if (isMockingData()) {
      fleetPhotoControl.apply({ name: 'ok', props: { items: response } });
      vehiclePhotoControlHasActiveTicketsIntercept.apply({ name: 'ok' });
    }
    const notificationFleetAccount = getAccountByKind(AccountKind.NOTIFICATION_OWNER);
    cy.loginWithSession('fleetWallet', notificationFleetAccount.username, notificationFleetAccount.password);
    cy.visit('/workspace/vehicles#photo-control');
    cy.useDateRangeFilter('custom', '01.10.2024', '08.10.2024');
  });

  it('[5542] should display table', () => {
    cy.getBySel('photo-control-list').should('exist');
  });

  it('[5552] should display reason in table', () => {
    cy.getBySel('photo-control-plate-filter').type(licensePlate);
    cy.getBySel('AQA12443-reasons-cell').should('contain', 'Актуалізація фото авто');
  });

  it('[5543] should filter by license plate', () => {
    cy.getBySel('photo-control-plate-filter').type(licensePlate);
    cy.getBySel('AQA12443-license-plate-cell').should('exist');
  });

  it('[5543] should filter by status', () => {
    cy.getBySel('photo-control-status-filter').click();
    cy.getBySel('status-Approved').click();
    cy.getBySel('AQA12444-status-cell').should('contain', 'Підтверджено');
  });

  if (isMockingData()) {
    describe('BlockedByManager ticket status', () => {
      beforeEach(() => {
        const [first, second] = response;
        const tickets = [
          { ...first, status: TicketStatus.REVIEW },
          { ...second, status: TicketStatus.BLOCKED_BY_MANAGER },
        ];
        fleetPhotoControl.apply({ name: 'ok', props: { items: tickets } });
        cy.reload();
      });

      it('[7651] should display same status for Review and BlockedByManager statuses', () => {
        cy.getBySel('AQA12444-status-cell').eq(0).should('be.visible').should('contain', 'На перевірці');
        cy.getBySel(`${licensePlate}-status-cell`).eq(0).should('be.visible').should('contain', 'На перевірці');
      });
    });
  }
});
