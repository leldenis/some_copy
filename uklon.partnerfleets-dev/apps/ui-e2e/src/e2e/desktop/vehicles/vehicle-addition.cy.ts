import { TicketStatus, TicketType, VehiclePhotosCategory } from '@constant';
import { FleetRole, FleetType, FleetVehicleOption } from '@data-access';

import { Region } from '@uklon/types';

import { MeIntercept } from '../../../support/interceptor';
import { DictionaryOptionsInterceptor } from '../../../support/interceptor/dictionaries/dictionary-options';
import { TicketConfigurationInterceptor } from '../../../support/interceptor/tickets/ticket-configuration';
import { VehicleCheckLicensePlateInterceptor } from '../../../support/interceptor/vehicles/vehicle-addition/vehicle-check-license-plate';
import { isMockingData } from '../../../support/utils';

const LICENSE_PLATE = 'KA1035BH';

function createVehicleTicket(regionId: Region): void {
  const VEHICLE_PHOTOS = [
    VehiclePhotosCategory.DRIVER_REGISTRATION_FRONT,
    VehiclePhotosCategory.DRIVER_REGISTRATION_BACK,
    VehiclePhotosCategory.VEHICLE_ANGLED_FRONT,
    VehiclePhotosCategory.VEHICLE_ANGLED_BACK,
    VehiclePhotosCategory.VEHICLE_INTERIOR_BACK,
  ];

  const uploadedImages = {};

  cy.intercept('PUT', `api/tickets/*/images?*`, (req) => {
    uploadedImages[req.query.category] = {
      url: 'assets/images/photo_control_success.svg',
      fallback_url: 'assets/images/photo_control_success.svg',
    };
    req.reply({
      getUrl: req.query.category,
      uploadUrl: req.query.category,
    });
  }).as('uploadImage');

  cy.intercept('GET', `api/tickets/*/images?*`, (req) => {
    req.reply({ ...uploadedImages });
  }).as('getImages');

  cy.intercept('POST', 'api/tickets/fleets/*/vehicles/*', { statusCode: 200 }).as('createTicket');
  cy.intercept('PUT', 'api/tickets/vehicle-additions/*', { statusCode: 200 }); // Update ticket
  cy.intercept('PUT', 'api/tickets/vehicle-additions/review-awaiters', { statusCode: 200 }); // Validate ticket
  cy.intercept('GET', 'api/tickets/vehicle-additions/*', { statusCode: 200 }); // Get ticket
  cy.intercept('GET', 'api/fleets/*/drivers-by-cash-limit', { body: { items: [] }, statusCode: 200 });
  cy.intercept('GET', 'api/tickets/fleets/*/vehicles/vehicle-photo-control/has-active-tickets', {
    body: { has_active_tickets: true },
    statusCode: 200,
  });

  cy.getBySel('vehicle-addition-container').should('be.visible');
  cy.getBySel('vehicle-addition-photos').should('not.exist');
  cy.getBySel('vehicle-addition-footer').should('be.exist');
  cy.getBySel('vehicle-addition-continue-btn').should('be.visible').should('have.attr', 'disabled');
  cy.getBySel('vehicle-addition-title').should('contain.text', 'Дані авто');

  cy.getBySel('license-plate-control').should('be.visible').focus();
  cy.getBySel('license-plate-control').type(LICENSE_PLATE);

  const ADVANCED_OPTIONS = [
    FleetVehicleOption.AIR_CONDITIONER,
    FleetVehicleOption.BABY_CHAIR,
    FleetVehicleOption.BOOSTER_CABLE,
    FleetVehicleOption.ELECTRIC_ENGINE,
  ];

  cy.getBySel('advanced-options-control').should('be.visible').click();
  cy.getBySel('advanced-options-control-item').should('have.length', ADVANCED_OPTIONS.length);
  cy.get('.cdk-overlay-backdrop').click(0, 0);

  cy.getBySel('vehicle-addition-continue-btn').should('be.visible').click();
  cy.getBySel('license-plate-control').should('be.visible').should('have.attr', 'disabled');
  cy.getBySel('vehicle-addition-photos').should('be.visible');

  if (regionId === Region.TASHKENT) {
    cy.getBySel('insurance-checkbox').should('not.exist');
  } else {
    cy.getBySel('insurance-checkbox')
      .should('be.visible')
      .should('contain.text', 'Я підтверджую, що маю чинне ОСЦПВ (автоцивілку)');
  }

  VEHICLE_PHOTOS.forEach((item: VehiclePhotosCategory) => cy.getBySel(`photo-category-${item}`).should('be.visible'));

  cy.getBySel('vehicle-addition-continue-btn').should('not.exist');
  cy.getBySel('vehicle-add-btn').should('exist').should('have.attr', 'disabled');

  if (regionId !== Region.TASHKENT) {
    // cy.get('.cdk-overlay-backdrop').should('not.exist');
    cy.getBySel('insurance-checkbox').find('input').check({ force: true });
  }

  VEHICLE_PHOTOS.forEach((item) => {
    cy.getBySel(`photo-category-${item}`)
      .find('[data-cy="photo-card-input"]')
      .should('exist')
      .selectFile(
        { contents: 'src/fixtures/images/fixture-image.png', fileName: 'fixture-image.png', mimeType: 'image/png' },
        { force: true },
      );
    cy.getBySel('photo-spinner').should('be.visible');
    cy.wait('@uploadImage');
    cy.wait('@getImages');

    cy.getBySel(`photo-category-${item}`)
      .find('[data-cy="photo"]')
      .should('have.attr', 'src')
      .and('include', 'assets/images/photo_control_success.svg');

    cy.getBySel(`photo-category-${item}`)
      .find('[data-cy="photo-upload-success"')
      .should('be.visible')
      .should('contain.text', 'Зображення успішно завантажено');

    cy.getBySel(`photo-category-${item}`).find('[data-cy="photo-spinner"').should('not.exist');
  });

  cy.getBySel('toast-component').should('not.exist');
  cy.getBySel('vehicle-add-btn').should('be.visible').click();

  cy.wait('@createTicket').then(({ request }) => {
    expect(request.body.license_plate).to.contain(LICENSE_PLATE);
  });
}

if (isMockingData()) {
  describe('Vehicle addition', () => {
    const meData = new MeIntercept();

    describe('Vehicle addition UA', () => {
      const ticketConfig = new TicketConfigurationInterceptor();
      const dictionaryOptions = new DictionaryOptionsInterceptor();
      const licensePlateExist = new VehicleCheckLicensePlateInterceptor('*', '*');

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
        ticketConfig.apply({ name: 'ok' });
        dictionaryOptions.apply({ name: 'ok', props: { regionId: Region.KYIV } });
        licensePlateExist.apply({ name: 'ok', props: { items: [] } });

        cy.clearLocalStorage();
        cy.loginWithSession('VehicleCreate');
        cy.visit('/workspace/vehicles/create');
      });

      it('[5778] should create ticket in UA', () => {
        createVehicleTicket(Region.KYIV);
      });

      it('[8145] should disabled license plate after click to continue', () => {
        cy.getBySel('license-plate-control').should('be.visible').focus();
        cy.getBySel('license-plate-control').type(LICENSE_PLATE);
        cy.getBySel('advanced-options-control').should('be.visible').click();
        cy.getBySel('advanced-options-control-item').eq(0).click();
        cy.get('body').click(0, 0);
        cy.getBySel('vehicle-addition-continue-btn').should('be.visible').click();
        cy.getBySel('license-plate-control').should('be.visible').should('have.attr', 'disabled');
        cy.getBySel('vehicle-add-btn').should('be.visible').should('have.attr', 'disabled');
        cy.getBySel('insurance-checkbox').should('be.visible');
      });

      it('[8143] should display error if ticket already exist', () => {
        const vehicleExist = {
          created_at: 1_727_691_852,
          id: '004b1c29-4d0b-4bc2-92d4-8c5df701b73b',
          license_plate: LICENSE_PLATE,
          status: TicketStatus.DRAFT,
          type: TicketType.VEHICLE_TO_FLEET_ADDITION,
          model_id: '93d1ae2a-17f0-4e29-842e-b866eddfd8ed',
          model: 'Audi',
          make: 'A8',
          make_id: '93d1ae2a-17f0-4e29-842e-b866eddfd8ed',
          production_year: 2024,
        };

        licensePlateExist.apply({ name: 'ok', props: { items: [vehicleExist] } });
        cy.reload();

        cy.getBySel('license-plate-control').should('be.visible').focus();
        cy.getBySel('license-plate-control').type(LICENSE_PLATE);
        cy.getBySel('ticket-duplicate-error').should('be.visible');
        cy.getBySel('ticket-duplicate-error-title').should(
          'contain.text',
          'Заявка на додавання авто з таким держ. номером вже створена',
        );
        cy.getBySel('ticket-duplicate-error-link')
          .should('be.visible')
          .should('have.attr', 'href', '/workspace/vehicles/ticket/004b1c29-4d0b-4bc2-92d4-8c5df701b73b');
        cy.getBySel('ticket-duplicate-error-icon').should('be.visible');
        cy.getBySel('vehicle-addition-continue-btn').should('be.visible').should('have.attr', 'disabled');
      });
    });

    describe('Vehicle addition UZ', () => {
      const ticketConfig = new TicketConfigurationInterceptor();
      const dictionaryOptions = new DictionaryOptionsInterceptor();
      const licensePlateExist = new VehicleCheckLicensePlateInterceptor('*', '*');

      beforeEach(() => {
        meData.apply({
          name: 'ok',
          props: {
            fleets: [
              {
                id: '829492c9-29d5-41df-8e9b-14a407235ce1',
                name: 'AQA404TESTFLEET',
                region_id: Region.TASHKENT,
                email: 'aqa404fleet@uklon.com',
                role: FleetRole.MANAGER,
                fleet_type: FleetType.COMMERCIAL,
                tin_refused: false,
                is_fiscalization_enabled: false,
              },
            ],
          },
        });
        ticketConfig.apply({ name: 'ok' });
        licensePlateExist.apply({ name: 'ok', props: { items: [] } });
        dictionaryOptions.apply({ name: 'ok', props: { regionId: Region.TASHKENT } });

        cy.clearLocalStorage();
        cy.loginWithSession('VehicleCreateInUZ');
        cy.visit('/workspace/vehicles/create');
      });

      it('should create vehicle ticket in UZ', () => {
        createVehicleTicket(Region.TASHKENT);
      });
    });
  });
}
