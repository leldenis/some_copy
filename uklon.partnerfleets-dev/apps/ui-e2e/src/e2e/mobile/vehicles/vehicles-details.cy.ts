describe('Vehicles details', () => {
  beforeEach(() => {
    cy.loginWithSession('vehicleDetails');
    cy.visit('workspace/vehicles/details/ebe250ef-25fe-4c30-bb52-1a9bc495fca6');
  });

  describe('When navigate', () => {
    it.skip('[PF-1329] should open vehicle details page', () => {
      cy.url().should('include', 'workspace/vehicles/details/ebe250ef-25fe-4c30-bb52-1a9bc495fca6');
    });

    it.skip('[PF-1330] should open vehicle list page', () => {
      cy.visit('/workspace/vehicles');
      cy.visit('/workspace/vehicles/details/ebe250ef-25fe-4c30-bb52-1a9bc495fca6');
      cy.getBySel('shell-navigate-back-btn').click();
      cy.url().should('include', 'workspace/vehicles');
    });
  });

  describe('When open vehicle details page', () => {
    it.skip('[PF-1331] should have a comfort class', () => {
      cy.getBySel('comfort_level').should('exist').should('contain', 'Економ');
    });

    it.skip('[PF-1332] should have a license plate', () => {
      cy.getBySel('license-plate').should('exist').should('contain', 'AQA7297');
    });

    it.skip('[PF-1333] should have a make-model-year', () => {
      cy.getBySel('make-model-year').should('exist').should('contain', 'Cadillac XTS 2017');
    });

    it.skip('[PF-1334] should have a body type - passenger count', () => {
      cy.getBySel('body-type').should('exist').should('contain', 'Купе');
    });

    it.skip('[PF-1335] should have a passenger seats count', () => {
      cy.getBySel('passenger_seats_count').should('exist').should('contain', '4');
    });

    it.skip('[PF-1336] should have a VIN', () => {
      cy.getBySel('vin-code').should('exist').should('contain', 'BSAS4J648VFVC4VJ7');
    });

    it.skip('[PF-1337] should have a color', () => {
      cy.getBySel('vehicle_color').should('exist').should('contain', 'Білий');
    });

    it.skip('[PF-1338] should have a registration date', () => {
      cy.getBySel('added_to_fleet_date').should('exist').should('contain', '17.11.2022');
    });

    it.skip('[PF-1339] should have ride conditions', () => {
      cy.getBySel('vehicle-options').should('exist').should('contain', 'Кондиціонер');
    });
  });

  describe('When using tabs', () => {
    it.skip('[PF-1340] should have a photo tab', () => {
      cy.get('[data-cy="vehicle-details-tabs-photo"]').should('exist').should('contain', 'Фото');
    });

    it.skip('[PF-1341] should have a settings tab', () => {
      cy.get('[data-cy="vehicle-details-tabs-settings"]').should('exist').should('contain', 'Налаштування');
    });

    it.skip('[PF-1342] should have a products tab', () => {
      cy.get('[data-cy="vehicle-details-tabs-products"]').should('exist').should('contain', 'Продукти');
    });

    it.skip('[PF-1343] should have a drivers tab', () => {
      cy.get('[data-cy="vehicle-details-tabs-drivers"]').should('exist').should('contain', 'Водії');
    });

    it.skip('[PF-1344] should have a rating tab', () => {
      cy.get('[data-cy="vehicle-details-tabs-marks"]').should('exist').should('contain', 'Оцінки');
    });

    it.skip('[PF-1345] should have a history tab', () => {
      cy.get('[data-cy="vehicle-details-tabs-changeshistory"]').should('exist').should('contain', 'Історія змін');
    });
  });

  describe('When vehicle have photo', () => {
    beforeEach(() => {
      cy.get('[data-cy="vehicle-details-tabs-photo"]').click();
    });

    it.skip('[PF-1346] should have a driver vehicle registration front copy', () => {
      cy.get('[data-cy="vehicle-photo-driver_vehicle_registration_front_copy"]')
        .should('exist')
        .get('[data-cy="photo"]')
        .should('exist');
    });

    it.skip('[PF-1347] should have a driver vehicle registration reverse copy', () => {
      cy.get('[data-cy="vehicle-photo-driver_vehicle_registration_reverse_copy"]')
        .should('exist')
        .get('[data-cy="photo"]')
        .should('exist');
    });

    it.skip('[PF-1348] should have a driver insurance front copy', () => {
      cy.get('[data-cy="vehicle-photo-driver_insurance_front_copy"]')
        .should('exist')
        .get('[data-cy="photo"]')
        .should('exist');
    });

    it.skip('[PF-1349] should have a driver car front photo', () => {
      cy.get('[data-cy="vehicle-photo-driver_car_front_photo"]')
        .should('exist')
        .get('[data-cy="photo"]')
        .should('exist');
    });

    it.skip('[PF-1350] should have a driver car back photo', () => {
      cy.get('[data-cy="vehicle-photo-driver_car_back_photo"]')
        .should('exist')
        .get('[data-cy="photo"]')
        .should('exist');
    });

    it.skip('[PF-1351] should have a driver car sight photo', () => {
      cy.get('[data-cy="vehicle-photo-driver_car_sight_photo"]')
        .should('exist')
        .get('[data-cy="photo"]')
        .should('exist');
    });

    it.skip('[PF-1352] should have a driver car right sight photo', () => {
      cy.get('[data-cy="vehicle-photo-driver_car_right_sight_photo"]')
        .should('exist')
        .get('[data-cy="photo"]')
        .should('exist');
    });

    it.skip('[PF-1353] should have a vehicle interior front photo', () => {
      cy.get('[data-cy="vehicle-photo-vehicle_interior_front_photo"]')
        .should('exist')
        .get('[data-cy="photo"]')
        .should('exist');
    });

    it.skip('[PF-1354] should have a vehicle interior back photo', () => {
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

    it.skip('[PF-1355] should have a fullscreen driver vehicle registration front copy', () => {
      cy.get('[data-cy="vehicle-photo-driver_vehicle_registration_front_copy"]').find('[data-cy="photo"]').click();
      cy.get('[data-cy="photo-gallery-driver_vehicle_registration_front_copy"]').should('exist');
    });

    it.skip('[PF-1356] should have a fullscreen driver vehicle registration reverse copy', () => {
      cy.get('[data-cy="vehicle-photo-driver_vehicle_registration_reverse_copy"]').find('[data-cy="photo"]').click();
      cy.get('[data-cy="photo-gallery-driver_vehicle_registration_reverse_copy"]').should('exist');
    });

    it.skip('[PF-1357] should have a fullscreen driver insurance front copy', () => {
      cy.get('[data-cy="vehicle-photo-driver_insurance_front_copy"]').find('[data-cy="photo"]').click();
      cy.get('[data-cy="photo-gallery-driver_insurance_front_copy"]').should('exist');
    });

    it.skip('[PF-1358] should have a fullscreen driver car front photo', () => {
      cy.get('[data-cy="vehicle-photo-driver_car_front_photo"]').find('[data-cy="photo"]').click();
      cy.get('[data-cy="photo-gallery-driver_car_front_photo"]').should('exist');
    });

    it.skip('[PF-1359] should have a fullscreen driver car back photo', () => {
      cy.get('[data-cy="vehicle-photo-driver_car_back_photo"]').find('[data-cy="photo"]').click();
      cy.get('[data-cy="photo-gallery-driver_car_back_photo"]').should('exist');
    });

    it.skip('[PF-1360] should have a driver car sight photo', () => {
      cy.get('[data-cy="vehicle-photo-driver_car_sight_photo"]').find('[data-cy="photo"]').click();
      cy.get('[data-cy="photo-gallery-driver_car_sight_photo"]').should('exist');
    });

    it.skip('[PF-1361] should have a fullscreen driver car right sight photo', () => {
      cy.get('[data-cy="vehicle-photo-driver_car_right_sight_photo"]').find('[data-cy="photo"]').click();
      cy.get('[data-cy="photo-gallery-driver_car_right_sight_photo"]').should('exist');
    });

    it.skip('[PF-1362] should have a fullscreen vehicle interioro front photo', () => {
      cy.get('[data-cy="vehicle-photo-vehicle_interior_front_photo"]').find('[data-cy="photo"]').click();
      cy.get('[data-cy="photo-gallery-vehicle_interior_front_photo"]').should('exist');
    });

    it.skip('[PF-1363] should have a fullscreen vehicle interioro back photo', () => {
      cy.get('[data-cy="vehicle-photo-vehicle_interior_back_photo"]').find('[data-cy="photo"]').click();
      cy.get('[data-cy="photo-gallery-vehicle_interior_back_photo"]').should('exist');
    });
  });

  describe('When delete vehicle', () => {
    beforeEach(() => {
      cy.getBySel('delete-vehicle-menu-btn').should('exist').click();
      cy.getBySel('mobile-delete-vehicle-btn').should('exist').click();
    });

    it.skip('[PF-1364] should have a delete vehicle button', () => {
      cy.getBySel('delete-vehicle-menu-btn').should('exist');
    });

    it.skip('[PF-1365] should have a title', () => {
      cy.getBySel('remove-vehicle-from-fleet').should('exist').should('contain', 'Видалити AQA7297 з автопарку?');
    });

    it.skip('[PF-1366] should have a misregistration reason', () => {
      cy.get('.mat-mdc-select-arrow-wrapper').click();
      cy.get('[ng-reflect-value="misregistration"]').should('exist');
    });

    it.skip('[PF-1367] should have a car condition reason', () => {
      cy.get('.mat-mdc-select-arrow-wrapper').click();
      cy.get('[ng-reflect-value="car_condition"]').should('exist');
    });

    it.skip('[PF-1368] should have a car sold reason', () => {
      cy.get('.mat-mdc-select-arrow-wrapper').click();
      cy.get('[ng-reflect-value="car_sold"]').should('exist');
    });

    it.skip('[PF-1369] should have a car car accident reason', () => {
      cy.get('.mat-mdc-select-arrow-wrapper').click();
      cy.get('[ng-reflect-value="car_accident"]').should('exist');
    });

    it.skip('[PF-1370] should have a comment field', () => {
      cy.get('[data-cy="comment-control"]').should('exist');
    });

    it.skip('[PF-1371] should comment field be required for a reason Other', () => {
      cy.get('[data-cy="remove-btn"]').should('exist').should('be.disabled');
    });

    it.skip('[PF-1372] should comment field not required for car sold reason', () => {
      cy.get('.mat-mdc-select-arrow-wrapper').click();
      cy.get('[ng-reflect-value="car_sold"]').click();
      cy.get('[data-cy="remove-btn"]').should('exist').should('not.be.disabled');
    });
  });
});
