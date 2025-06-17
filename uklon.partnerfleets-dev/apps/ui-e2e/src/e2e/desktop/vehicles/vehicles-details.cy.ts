import { IndividualEntrepreneursIntercept } from '../../../support/interceptor/finance/individual-entrepreneus';
import { FleetVehicleImagesIntercept } from '../../../support/interceptor/vehicles';
import { vehicleAccessToDriversIntercept } from '../../../support/interceptor/vehicles/access-to-drivers';
import { FleetVehicleDetailsIntercept } from '../../../support/interceptor/vehicles/details';
import { isMockingData } from '../../../support/utils';

const fleetId = '829492c9-29d5-41df-8e9b-14a407235ce1';
const vehicleId = 'ebe250ef-25fe-4c30-bb52-1a9bc495fca6';

const fleetVehicleDetails = new FleetVehicleDetailsIntercept(fleetId, vehicleId);
const fleetVehicleImage = new FleetVehicleImagesIntercept(fleetId, vehicleId);
const individualEntrepreneursIntercept = new IndividualEntrepreneursIntercept(fleetId, true);

describe('Vehicles details', () => {
  beforeEach(() => {
    if (isMockingData()) {
      fleetVehicleDetails.apply({ name: 'ok', props: { id: vehicleId, license_plate: 'AQA7297' } });
      fleetVehicleImage.apply({ name: 'ok' });
      individualEntrepreneursIntercept.apply({ name: 'ok', props: { entrepreneur: [] } });
      vehicleAccessToDriversIntercept.apply({ name: 'ok' });

      cy.intercept('GET', 'api/fleets/*/vehicles/*/product-configurations', { statusCode: 200, body: { items: [] } });
    }

    cy.loginWithSession('vehicleDetails');
    cy.visit('/workspace/vehicles/details/ebe250ef-25fe-4c30-bb52-1a9bc495fca6');
  });

  describe('When navigate', () => {
    it('[5042] should open vehicle details page', () => {
      cy.url().should('include', 'workspace/vehicles/details/ebe250ef-25fe-4c30-bb52-1a9bc495fca6');
    });

    it('[C386398] should open general page if user reload the page', () => {
      cy.visit('/workspace/vehicles/details/ebe250ef-25fe-4c30-bb52-1a9bc495fca6');
      cy.getBySel('shell-navigate-back-btn').click();
      cy.url().should('include', 'workspace/general');
    });
  });

  describe('When vehicle have photo', () => {
    beforeEach(() => {
      cy.get('[data-cy="vehicle-details-tabs-photo"]').click();
    });

    it('[5044] should have a driver vehicle registration front copy', () => {
      cy.get('[data-cy="vehicle-photo-driver_vehicle_registration_front_copy"]')
        .should('exist')
        .get('[data-cy="photo"]')
        .should('exist');
    });

    it('[5044] should have a driver vehicle registration reverse copy', () => {
      cy.get('[data-cy="vehicle-photo-driver_vehicle_registration_reverse_copy"]')
        .should('exist')
        .get('[data-cy="photo"]')
        .should('exist');
    });

    it('[5044] should have a driver insurance front copy', () => {
      cy.get('[data-cy="vehicle-photo-driver_insurance_front_copy"]')
        .should('exist')
        .get('[data-cy="photo"]')
        .should('exist');
    });

    it('[5044] should have a driver car front photo', () => {
      cy.get('[data-cy="vehicle-photo-driver_car_front_photo"]')
        .should('exist')
        .get('[data-cy="photo"]')
        .should('exist');
    });

    it('[5044] should have a driver car back photo', () => {
      cy.get('[data-cy="vehicle-photo-driver_car_back_photo"]')
        .should('exist')
        .get('[data-cy="photo"]')
        .should('exist');
    });

    it('[5044] should have a driver car sight photo', () => {
      cy.get('[data-cy="vehicle-photo-driver_car_sight_photo"]')
        .should('exist')
        .get('[data-cy="photo"]')
        .should('exist');
    });

    it('[5044] should have a driver car right sight photo', () => {
      cy.get('[data-cy="vehicle-photo-driver_car_right_sight_photo"]')
        .should('exist')
        .get('[data-cy="photo"]')
        .should('exist');
    });

    it('[5044] should have a vehicle interior front photo', () => {
      cy.get('[data-cy="vehicle-photo-vehicle_interior_front_photo"]')
        .should('exist')
        .get('[data-cy="photo"]')
        .should('exist');
    });

    it('[5044] should have a vehicle interior back photo', () => {
      cy.get('[data-cy="vehicle-photo-vehicle_interior_back_photo"]')
        .should('exist')
        .get('[data-cy="photo"]')
        .should('exist');
    });
  });

  describe('When click on photo', () => {
    beforeEach(() => {
      cy.get('[data-cy="vehicle-details-tabs-photo"]').click();
    });

    it('[5045] should have a fullscreen driver vehicle registration front copy', () => {
      cy.get('[data-cy="vehicle-photo-driver_vehicle_registration_front_copy"]').find('[data-cy="photo"]').click();
      cy.get('[data-cy="photo-gallery-driver_vehicle_registration_front_copy"]').should('exist');
    });

    it('[5045] should have a fullscreen driver vehicle registration reverse copy', () => {
      cy.get('[data-cy="vehicle-photo-driver_vehicle_registration_reverse_copy"]').find('[data-cy="photo"]').click();
      cy.get('[data-cy="photo-gallery-driver_vehicle_registration_reverse_copy"]').should('exist');
    });

    it('[5045] should have a fullscreen driver insurance front copy', () => {
      cy.get('[data-cy="vehicle-photo-driver_insurance_front_copy"]').find('[data-cy="photo"]').click();
      cy.get('[data-cy="photo-gallery-driver_insurance_front_copy"]').should('exist');
    });

    it('[5045] should have a fullscreen driver car front photo', () => {
      cy.get('[data-cy="vehicle-photo-driver_car_front_photo"]').find('[data-cy="photo"]').click();
      cy.get('[data-cy="photo-gallery-driver_car_front_photo"]').should('exist');
    });

    it('[5045] should have a fullscreen driver car back photo', () => {
      cy.get('[data-cy="vehicle-photo-driver_car_back_photo"]').find('[data-cy="photo"]').click();
      cy.get('[data-cy="photo-gallery-driver_car_back_photo"]').should('exist');
    });

    it('[5045] should have a driver car sight photo', () => {
      cy.get('[data-cy="vehicle-photo-driver_car_sight_photo"]').find('[data-cy="photo"]').click();
      cy.get('[data-cy="photo-gallery-driver_car_sight_photo"]').should('exist');
    });

    it('[5045] should have a fullscreen driver car right sight photo', () => {
      cy.get('[data-cy="vehicle-photo-driver_car_right_sight_photo"]').find('[data-cy="photo"]').click();
      cy.get('[data-cy="photo-gallery-driver_car_right_sight_photo"]').should('exist');
    });

    it('[5045] should have a fullscreen vehicle interioro front photo', () => {
      cy.get('[data-cy="vehicle-photo-vehicle_interior_front_photo"]').find('[data-cy="photo"]').click();
      cy.get('[data-cy="photo-gallery-vehicle_interior_front_photo"]').should('exist');
    });

    it('[5045] should have a fullscreen vehicle interioro back photo', () => {
      cy.get('[data-cy="vehicle-photo-vehicle_interior_back_photo"]').find('[data-cy="photo"]').click();
      cy.get('[data-cy="photo-gallery-vehicle_interior_back_photo"]').should('exist');
    });
  });

  if (isMockingData()) {
    describe('When open vehicle details page', () => {
      it('[C386399] should have a comfort class', () => {
        cy.getBySel('comfort_level').should('exist').should('contain', 'Лайт');
      });

      it('[C386399] should have a license plate', () => {
        cy.getBySel('license-plate').should('exist').should('contain', 'AQA7297');
      });

      it('[C386399] should have a make-model-year', () => {
        cy.getBySel('make-model-year').should('exist').should('contain', 'Cadillac XTS 2017');
      });

      it('[C386399] should have a body type - passenger count', () => {
        cy.getBySel('body-type').should('exist').should('contain', 'Купе');
      });

      it('[C386399] should have a passenger seats count', () => {
        cy.getBySel('passenger_seats_count').should('exist').should('contain', '4');
      });

      it('[C386399] should have a VIN', () => {
        cy.getBySel('vin-code').should('exist').should('contain', 'BSAS4J648VFVC4VJ7');
      });

      it('[C386399] should have a color', () => {
        cy.getBySel('vehicle_color').should('exist').should('contain', 'Білий');
      });

      it('[C386399] should have a registration date', () => {
        cy.getBySel('added_to_fleet_date').should('exist').should('contain', '17.11.2022');
      });

      it('[C386399] should have ride conditions', () => {
        cy.getBySel('vehicle-options').should('exist').should('contain', 'Кондиціонер');
      });
    });

    describe('When using tabs', () => {
      it('[C387830] should have a photo tab', () => {
        cy.get('[data-cy="vehicle-details-tabs-photo"]').should('exist').should('contain', 'Фото');
      });

      it.skip('[C387830] should have a settings tab', () => {
        cy.get('[data-cy="vehicle-details-tabs-settings"]').should('exist').should('contain', 'Налаштування');
      });

      it('[C387830] should have a products tab', () => {
        cy.get('[data-cy="vehicle-details-tabs-products"]').should('exist').should('contain', 'Продукти');
      });

      it.skip('[C387830] should have a drivers tab', () => {
        cy.get('[data-cy="vehicle-details-tabs-drivers"]').should('exist').should('contain', 'Водії');
      });

      it.skip('[C387830] should have a rating tab', () => {
        cy.get('[data-cy="vehicle-details-tabs-marks"]').should('exist').should('contain', 'Оцінки');
      });

      it('[C387830] should have a history tab', () => {
        cy.get('[data-cy="vehicle-details-tabs-changeshistory"]').should('exist').should('contain', 'Історія змін');
      });
    });

    describe('When delete vehicle', () => {
      beforeEach(() => {
        cy.get('[data-cy="delete-vehicle-btn"]').click();
      });

      it('[C458428] should have a delete vehicle button', () => {
        cy.getBySel('delete-vehicle-btn').should('exist');
      });

      it('[C504052] should have a title', () => {
        cy.getBySel('remove-vehicle-from-fleet').should('exist').should('contain', 'Видалити AQA7297 з автопарку?');
      });

      it.skip('[C504052] should have a misregistration reason', () => {
        cy.get('.mat-mdc-select-arrow-wrapper').click();
        cy.get('[ng-reflect-value="misregistration"]').should('exist');
      });

      it.skip('[C504052] should have a car condition reason', () => {
        cy.get('.mat-mdc-select-arrow-wrapper').click();
        cy.get('[ng-reflect-value="car_condition"]').should('exist');
      });

      it.skip('[C504052] should have a car sold reason', () => {
        cy.get('.mat-mdc-select-arrow-wrapper').click();
        cy.get('[ng-reflect-value="car_sold"]').should('exist');
      });

      it.skip('[C504052] should have a car car accident reason', () => {
        cy.get('.mat-mdc-select-arrow-wrapper').click();
        cy.get('[ng-reflect-value="car_accident"]').should('exist');
      });

      it('[C504052] should have a comment field', () => {
        cy.get('[data-cy="comment-control"]').should('exist');
      });

      it('[C458431] should comment field be required for a reason Other', () => {
        cy.get('[data-cy="remove-btn"]').should('exist').should('be.disabled');
      });

      it.skip('[C458431] should comment field not required for car sold reason', () => {
        cy.get('.mat-mdc-select-arrow-wrapper').click();
        cy.get('[ng-reflect-value="car_sold"]').click();
        cy.get('[data-cy="remove-btn"]').should('exist').should('not.be.disabled');
      });
    });
  }
});
