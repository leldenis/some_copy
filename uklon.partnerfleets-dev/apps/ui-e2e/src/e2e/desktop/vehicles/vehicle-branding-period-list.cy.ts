import { TicketStatus } from '@constant';
import { FleetRole, FleetType } from '@data-access';

import { MeIntercept } from '../../../support/interceptor';
import { vehiclePhotoControlHasActiveTicketsIntercept } from '../../../support/interceptor/vehicles/photo-control-has-active-tickets';
import { VehicleBrandingMonthlyCodeIntercept } from '../../../support/interceptor/vehicles/vehicle-branding-monthly-code';
import { VehicleBrandingPeriodListIntercept } from '../../../support/interceptor/vehicles/vehicle-branding-period-list';
import { isMockingData } from '../../../support/utils';

const threeDaysBeforeDeadline = Math.floor(Date.now() / 1000) + 3 * 24 * 60 * 60;
const daysFromNow = (addDays: number = 1): number => {
  const today = new Date();
  const future = new Date();
  future.setDate(today.getDate() + addDays);
  return Math.floor(future.getTime() / 1000);
};
const createFile = (fileName: string, mimeType: string, sizeMb: number = 10): any => {
  const size = sizeMb * 1024 * 1024;
  const bigFile = Cypress.Buffer.alloc(size);
  bigFile.write('X', size);

  return {
    contents: bigFile,
    fileName,
    mimeType,
    lastModified: Date.now(),
  };
};
const responseMock = [
  {
    id: '493034b7-3b41-45ed-b79a-ffb65c56236d',
    status: TicketStatus.DRAFT,
    created_at: 1_736_760_267,
    vehicle_id: '235fefc0-a50b-4e8a-b630-362f2e6ac5bc',
    deadline_to_send: daysFromNow(-2),
    monthly_code: '961848',
    model_id: '6d428b61-1a70-40da-8f43-6ea1e22c5f39',
    model: 'Continental GT V8 S',
    make_id: 'd772cab1-410a-4ae5-9b99-e3ff7c1093c0',
    make: 'Bentley',
    production_year: 2012,
    license_plate: 'CAR5059',
    color: 'White',
  },
  {
    id: '3f809168-2fc1-4ce8-9dd0-51f4387418b2',
    status: TicketStatus.CLARIFICATION,
    created_at: 1_736_760_267,
    vehicle_id: 'b03c2210-8a28-40c6-acbe-395e8c7ac014',
    deadline_to_send: daysFromNow(),
    monthly_code: '961848',
    model_id: '9b8347ee-c413-48e9-9648-3b389b1712cc',
    model: 'ILX',
    make_id: 'd4d408e2-e04d-48cf-9d34-69d2bfc88a2c',
    make: 'Acura',
    production_year: 2019,
    license_plate: 'UIOPDS',
    color: 'Black',
    reject_or_clarification_reason: 'incorrect_monthly_code',
  },
  {
    id: '2f1179ea-b924-4c38-b79f-78656fd2c732',
    status: TicketStatus.SENT,
    created_at: 1_736_760_267,
    vehicle_id: '6a08ee65-3d61-40f6-9357-d1f505952fc1',
    deadline_to_send: daysFromNow(),
    monthly_code: '961848',
    model_id: '56a894c6-1fcc-4b37-a29b-1f65637be4b8',
    model: 'Senator',
    make_id: '190cc7eb-0da3-4169-9421-f2d2692945b3',
    make: 'Opel',
    production_year: 1996,
    license_plate: 'PP4535AA',
    color: 'White',
  },
  {
    id: '73589693-9da1-4b19-a57d-66806eef35aa',
    status: TicketStatus.REJECTED,
    created_at: 1_736_760_267,
    vehicle_id: '75669d88-1a38-43c6-8c1e-c09a8f3f0d31',
    deadline_to_send: daysFromNow(),
    monthly_code: '961848',
    model_id: 'cfa281ef-a005-4e0b-bdf9-94be854eee4b',
    model: 'A 112',
    make_id: '14917bce-2af7-41c3-83f8-7b01cfb2f57a',
    make: 'Autobianchi',
    production_year: 2020,
    license_plate: 'KSHHS',
    color: 'Green',
    reject_or_clarification_reason: 'critical_car_damage',
  },
  {
    id: 'b747f779-a381-465f-9d1a-84d624528e75',
    status: TicketStatus.APPROVED,
    created_at: 1_736_760_267,
    vehicle_id: '777dc457-3f45-40df-ac79-741a946f85a8',
    deadline_to_send: daysFromNow(),
    monthly_code: '961848',
    model_id: 'd3efbcbc-4934-424f-bc8a-51d724e502e7',
    model: 'Stromform',
    make_id: '9da0115b-c316-4fec-b414-20ee284bfb82',
    make: 'Adler',
    production_year: 2021,
    license_plate: 'GJLNHGJKH',
    color: 'Red',
  },
  {
    id: 'b747f779-a381-465f-9d1a-84d624528e75',
    status: TicketStatus.DRAFT,
    created_at: 1_736_760_267,
    vehicle_id: '777dc457-3f45-40df-ac79-741a946f85a8',
    deadline_to_send: threeDaysBeforeDeadline,
    monthly_code: '961848',
    model_id: 'd3efbcbc-4934-424f-bc8a-51d724e502e7',
    model: 'Stromform',
    make_id: '9da0115b-c316-4fec-b414-20ee284bfb82',
    make: 'Adler',
    production_year: 2001,
    license_plate: 'BJLNHGJAA',
    color: 'Black',
  },
];

if (isMockingData()) {
  describe('Vehicle branding period list', () => {
    const fleetId = '*';
    const meData = new MeIntercept();
    const vehicleBrandingPeriodList = new VehicleBrandingPeriodListIntercept(fleetId, '*');
    const monthlyCode = new VehicleBrandingMonthlyCodeIntercept();

    beforeEach(() => {
      meData.apply({
        name: 'ok',
        props: {
          fleets: [
            {
              id: '829492c9-29d5-41df-8e9b-14a407235ce1',
              name: 'AQA404TESTFLEET',
              region_id: 1,
              email: 'aqa404fleet@uklon.com',
              role: FleetRole.MANAGER,
              fleet_type: FleetType.COMMERCIAL,
              tin_refused: false,
              is_fiscalization_enabled: false,
            },
          ],
        },
      });
      vehicleBrandingPeriodList.apply({ name: 'ok', props: { items: responseMock } });
      monthlyCode.apply({ name: 'ok' });
      vehiclePhotoControlHasActiveTicketsIntercept.apply({ name: 'ok' });

      cy.loginWithSession('vehicleBrandingPeriod');
      cy.visit('/workspace/vehicles#vehicle-branding-tickets');
    });

    describe('7023 Should display vehicle branding period page', () => {
      it('should display vehicle branding period tab', () => {
        cy.getBySel('vehicle-branding-period-tab').should('be.visible');
      });

      it('should display vehicle branding container', () => {
        cy.getBySel('vehicle-branding-period-tickets-container').should('be.visible');
      });

      it('should display vehicle branding filters', () => {
        cy.getBySel('vehicle-branding-period-filters').should('be.visible');
      });

      it('should display period filter', () => {
        cy.getBySel('vehicle-branding-period-ticket-filter-period').should('be.visible');
      });

      it('should display license place filter', () => {
        cy.getBySel('vehicle-branding-period-ticket-license-plate').should('be.visible');
      });

      it('should display license place filter search icon', () => {
        cy.getBySel('vehicle-branding-period-ticket-license-search-icon').should('be.visible');
      });

      it('should display ticket status dropdown filter', () => {
        cy.getBySel('vehicle-branding-period-ticket-status').should('be.visible');
      });

      it('should display vehicle branding period monthly code', () => {
        cy.getBySel('vehicle-branding-period-monthly-code')
          .should('be.visible')
          .contains('Код поточного місяця: 983401');
      });

      it('should display vehicle branding period list', () => {
        cy.getBySel('vehicle-branding-period-list').should('be.visible');
      });
    });

    describe('should display data in grid', () => {
      it('should display header in grid', () => {
        cy.getBySel('header-vehicle-license-plate').should('be.visible');
        cy.getBySel('header-vehicle-model').should('be.visible');
        cy.getBySel('header-vehicle-deadline').should('be.visible');
        cy.getBySel('header-vehicle-ticket-status').should('be.visible');
        cy.getBySel('header-vehicle-upload-video').should('be.visible');
      });

      it('should display license plate link', () => {
        const licensePlates = [
          { panel: 'panel-item-0', plate: 'CAR5059' },
          { panel: 'panel-item-1', plate: 'UIOPDS' },
          { panel: 'panel-item-2', plate: 'PP4535AA' },
          { panel: 'panel-item-3', plate: 'KSHHS' },
          { panel: 'panel-item-4', plate: 'GJLNHGJKH' },
          { panel: 'panel-item-5', plate: 'BJLNHGJAA' },
        ];

        licensePlates.forEach(({ panel, plate }) => {
          cy.getBySel(panel).within(() => {
            cy.getBySel('item-vehicle-license-plate-link').should('be.visible').contains(plate);
          });
        });
      });

      it('should display make and model', () => {
        const vehicleMakeModels = [
          { panel: 'panel-item-0', make: 'Bentley', model: 'Continental GT V8 S' },
          { panel: 'panel-item-1', make: 'Acura', model: 'ILX' },
          { panel: 'panel-item-2', make: 'Opel', model: 'Senator' },
          { panel: 'panel-item-3', make: 'Autobianchi', model: 'A 112' },
          { panel: 'panel-item-4', make: 'Adler', model: 'Stromform' },
          { panel: 'panel-item-5', make: 'Adler', model: 'Stromform' },
        ];

        vehicleMakeModels.forEach(({ panel, make, model }) => {
          cy.getBySel(panel).within(() => {
            cy.getBySel('item-vehicle-make-model').should('be.visible').contains(`${make} ${model}`);
          });
        });
      });

      it('should display color and year', () => {
        const vehicleColorYears = [
          { panel: 'panel-item-0', color: 'White', year: 2012 },
          { panel: 'panel-item-1', color: 'Black', year: 2019 },
          { panel: 'panel-item-2', color: 'White', year: 1996 },
          { panel: 'panel-item-3', color: 'Green', year: 2020 },
          { panel: 'panel-item-4', color: 'Red', year: 2021 },
          { panel: 'panel-item-5', color: 'Black', year: 2001 },
        ];

        vehicleColorYears.forEach(({ panel, color, year }) => {
          cy.getBySel(panel).within(() => {
            cy.getBySel('item-vehicle-color-year').should('be.visible').contains(`${color} • ${year}`);
          });
        });
      });

      it('should display deadline time', () => {
        cy.getBySel('panel-item-0').within(() => {
          cy.getBySel('item-vehicle-deadline').should('be.visible');
        });

        cy.getBySel('panel-item-1').within(() => {
          cy.getBySel('item-vehicle-deadline').should('be.visible');
        });

        cy.getBySel('panel-item-2').within(() => {
          cy.getBySel('item-vehicle-deadline').should('be.visible');
        });

        cy.getBySel('panel-item-3').within(() => {
          cy.getBySel('item-vehicle-deadline').should('be.visible');
        });

        cy.getBySel('panel-item-4').within(() => {
          cy.getBySel('item-vehicle-deadline').should('be.visible');
        });

        cy.getBySel('panel-item-5').within(() => {
          cy.getBySel('item-vehicle-deadline').should('be.visible');
        });
      });

      it('should display vehicle ticket status', () => {
        const vehicleTicketStatus = [
          { panel: 'panel-item-0', statusValue: 'Очікує на огляд' },
          { panel: 'panel-item-1', statusValue: 'Уточніть дані' },
          { panel: 'panel-item-2', statusValue: 'Надіслано' },
          { panel: 'panel-item-3', statusValue: 'Відхилено' },
          { panel: 'panel-item-4', statusValue: 'Підтверджено' },
          { panel: 'panel-item-5', statusValue: 'Очікує на огляд' },
        ];

        vehicleTicketStatus.forEach(({ panel, statusValue }) => {
          cy.getBySel(panel).within(() => {
            cy.getBySel('item-vehicle-ticket-status').should('be.visible').contains(statusValue);
          });
        });
      });

      it('should display reason icon for ticket rejected or clarification', () => {
        cy.getBySel('panel-item-1').within(() => {
          cy.getBySel('item-vehicle-ticket-reason-icon').should('be.visible').click();
        });

        cy.getBySel('panel-item-3').within(() => {
          cy.getBySel('item-vehicle-ticket-reason-icon').should('be.visible').click();
        });
      });
    });

    describe('7025 should display empty state', () => {
      it('should display empty state', () => {
        vehicleBrandingPeriodList.apply({ name: 'ok', props: { count: 0 } });
        cy.reload();
        cy.getBySel('no-data').should('be.visible');
      });
    });

    describe('file upload', () => {
      it('should have empty column if ticket passed deadline and ticket status is no clarification or ticket was rejected', () => {
        cy.getBySel('item-vehicle-branding-upload').eq(0).should('exist').should('be.empty');
        cy.getBySel('item-vehicle-branding-upload').eq(3).should('exist').should('be.empty');
      });

      it('should have display file sent text in Sent and Approved statuses', () => {
        cy.getBySel('item-vehicle-branding-sent').eq(0).should('exist').should('contain', 'Надіслано');
        cy.getBySel('item-vehicle-branding-sent').eq(1).should('exist').should('contain', 'Надіслано');
      });

      it('should display upload button for tickets without passed deadline in Draft and Clarification statues', () => {
        cy.getBySel('item-vehicle-branding-upload-state')
          .eq(0)
          .find('[data-cy="vehicle-branding-upload-btn"]')
          .should('exist')
          .should('be.visible');

        cy.getBySel('item-vehicle-branding-upload-state')
          .eq(1)
          .find('[data-cy="vehicle-branding-upload-btn"]')
          .should('exist')
          .should('be.visible');
      });
    });

    describe('7322 file upload errors', () => {
      beforeEach(() => {
        cy.intercept('GET', 'api/tickets/*/video-upload-url?*', { statusCode: 400 });
      });

      it('should display extension error', () => {
        cy.getBySel('item-vehicle-branding-upload-state')
          .eq(0)
          .find('input[type=file]')
          .should('not.be.visible')
          .selectFile(createFile('file.txt', 'text/plain'), { force: true });
        cy.getBySel('item-vehicle-branding-upload-state')
          .eq(0)
          .find('[data-cy="vehicle-branding-upload-btn"]')
          .should('not.exist');
        cy.getBySel('item-vehicle-branding-upload-state')
          .eq(0)
          .find('[data-cy="vehicle-branding-re-upload-btn"]')
          .should('exist');
        cy.getBySel('item-vehicle-branding-upload-state')
          .eq(0)
          .find('[data-cy="vehicle-branding-upload-error"]')
          .should('exist')
          .should('contain', 'Помилка завантаження');

        cy.getBySel('item-vehicle-branding-upload-state')
          .eq(0)
          .find('[data-cy="vehicle-branding-upload-error"]')
          .find('.mat-icon')
          .should('exist')
          .trigger('mouseenter');
        cy.get('.tippy-content').should('be.visible').should('contain', 'Формат не підтримується');
      });

      it.skip('should display size error', () => {
        cy.getBySel('item-vehicle-branding-upload-state')
          .eq(0)
          .find('input[type=file]')
          .should('not.be.visible')
          .selectFile(createFile('file.mp4', 'video/mp4', 101), { force: true });
        cy.getBySel('item-vehicle-branding-upload-state')
          .eq(0)
          .find('[data-cy="vehicle-branding-upload-btn"]')
          .should('not.exist');
        cy.getBySel('item-vehicle-branding-upload-state')
          .eq(0)
          .find('[data-cy="vehicle-branding-re-upload-btn"]')
          .should('exist');
        cy.getBySel('item-vehicle-branding-upload-state')
          .eq(0)
          .find('[data-cy="vehicle-branding-upload-error"]')
          .should('exist')
          .should('contain', 'Помилка завантаження');

        cy.getBySel('item-vehicle-branding-upload-state')
          .eq(0)
          .find('[data-cy="vehicle-branding-upload-error"]')
          .find('.mat-icon')
          .should('exist')
          .trigger('mouseenter');
        cy.get('.tippy-content').should('be.visible').should('contain', 'Файл не має перевищувати 100 мб');
      });

      it('should display server error', () => {
        cy.getBySel('item-vehicle-branding-upload-state')
          .eq(0)
          .find('input[type=file]')
          .should('not.be.visible')
          .selectFile(createFile('file.mp4', 'video/mp4', 1), { force: true });
        cy.getBySel('item-vehicle-branding-upload-state')
          .eq(0)
          .find('[data-cy="vehicle-branding-upload-btn"]')
          .should('not.exist');
        cy.getBySel('item-vehicle-branding-upload-state')
          .eq(0)
          .find('[data-cy="vehicle-branding-re-upload-btn"]')
          .should('exist');
        cy.getBySel('item-vehicle-branding-upload-state')
          .eq(0)
          .find('[data-cy="vehicle-branding-upload-error"]')
          .should('exist')
          .should('contain', 'Помилка завантаження');

        cy.getBySel('item-vehicle-branding-upload-state')
          .eq(0)
          .find('[data-cy="vehicle-branding-upload-error"]')
          .find('.mat-icon')
          .should('exist')
          .trigger('mouseenter');
        cy.get('.tippy-content').should('be.visible').should('contain', 'Помилка завантаження');
      });
    });
  });
}
