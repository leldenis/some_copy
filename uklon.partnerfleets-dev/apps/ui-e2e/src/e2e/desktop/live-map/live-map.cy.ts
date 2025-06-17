import { DriverFilter, EmployeeLocationStatus, LiveMapEmployeeDto } from '@data-access';

import { driverActiveFiltersIntercept } from '../../../support/interceptor/drivers/active-filters';
import { DriverGeolocationIntercept } from '../../../support/interceptor/geolocation/drivers';
import { isMockingData } from '../../../support/utils';

const fleetId = '*';
const fleetDriverIntercept = new DriverGeolocationIntercept(fleetId);

function checkFiltersDialog(): void {
  cy.getBySel('driver-filters-details-dialog').should('exist');
  cy.getBySel('driver-filters-details-dialog-close-btn').should('exist').click();
  cy.getBySel('driver-filters-details-dialog').should('not.exist');
}

if (isMockingData()) {
  describe('Live map', () => {
    beforeEach(() => {
      if (isMockingData()) {
        fleetDriverIntercept.apply({ name: 'ok' });
        cy.intercept('GET', 'api/geolocation/by-region-id?*', {
          statusCode: 200,
          body: { latitude: 50.449_84, longitude: 30.523_16 },
        });
        cy.intercept('GET', 'api/geolocation/address?*', { statusCode: 200, body: [{ street: 'Центр' }] });
      }

      cy.loginWithSession('liveMap');
      cy.visit('/workspace/live-map');
    });

    it('should display map', () => {
      cy.getBySel('live-map').should('exist');
    });

    it('should display map panel', () => {
      cy.getBySel('map-home-panel').should('exist');
    });

    it('should have map disclaimer', () => {
      cy.getBySel('map-disclaimer')
        .should('exist')
        .should('contain', 'Геолокація може передаватися з похибкою і її не можна використовувати як GPS трекер');
    });

    it('should have zoom buttons', () => {
      cy.get('.leaflet-control-zoom-in').should('exist').should('contain', '+');
      cy.get('.leaflet-control-zoom-out').should('exist').should('contain', '−');
    });

    describe('Live map filters', () => {
      it('should have name and license plate filters', () => {
        cy.getBySel('map-filter-name').should('exist');
        cy.getBySel('map-filter-licensePlate').should('exist');
      });

      it('should have default filters value', () => {
        cy.getBySel('map-filter-name').should('contain', '');
        cy.getBySel('map-filter-licensePlate').should('contain', '');
      });

      it('should display Clear button if name filter changed', () => {
        cy.getBySel('filter-reset-btn').should('not.exist');
        cy.getBySel('map-filter-name').should('exist').type('test');
        cy.getBySel('filter-reset-btn').should('exist');
      });

      it('should display Clear button if license plate filter changed', () => {
        cy.getBySel('filter-reset-btn').should('not.exist');
        cy.getBySel('map-filter-licensePlate').should('exist').type('test');
        cy.getBySel('filter-reset-btn').should('exist');
      });

      it.skip('should reset filters to default on Clear button click', () => {
        cy.getBySel('filter-reset-btn').should('not.exist');
        cy.getBySel('map-filter-name').should('exist').type('test');
        cy.getBySel('map-filter-licensePlate').should('exist').type('test');
        cy.getBySel('filter-reset-btn').should('exist');
        cy.getBySel('map-filter-name').should('contain', '');
        cy.getBySel('map-filter-licensePlate').should('contain', '');
      });

      describe.skip('Name filter', () => {
        it('should have placeholder', () => {
          cy.getBySel('map-filter-name')
            .find('input')
            .invoke('attr', 'placeholder')
            .should('contain', "Прізвище, Ім'я");
        });

        it.skip('should have label', () => {
          cy.getBySel('map-filter-name').find('label').should('contain', 'Пошук водіїв');
        });

        it('should have search icon if no filter applied', () => {
          cy.getBySel('map-filter-name')
            .find('mat-icon')
            .should('exist')
            .should('have.attr', 'data-mat-icon-name')
            .should('contain', 'i-search');
        });

        it('should have reset filter button if filter applied', () => {
          cy.getBySel('map-filter-name').type('test');
          cy.getBySel('map-filter-name').find('.mat-icon').should('exist').click({ force: true });
          cy.getBySel('map-filter-name').should('contain', '');
        });

        it('should trigger driver search by name', () => {
          cy.getBySel('map-search-panel').should('not.exist');
          cy.getBySel('map-filter-name').type('Aqadpilu404');
          cy.getBySel('map-search-panel').should('exist');
          cy.getBySel('map-driver').should('exist');
        });
      });

      describe('License plate filter', () => {
        it('should have placeholder', () => {
          cy.getBySel('map-filter-licensePlate')
            .find('input')
            .invoke('attr', 'placeholder')
            .should('contain', 'Держ. номер');
        });

        it.skip('should have label', () => {
          cy.getBySel('map-filter-licensePlate').find('label').should('contain', 'Пошук авто');
        });

        it('should have search icon if no filter applied', () => {
          cy.getBySel('map-filter-licensePlate')
            .find('mat-icon')
            .should('exist')
            .should('have.attr', 'data-mat-icon-name')
            .should('contain', 'i-search');
        });

        it.skip('should have reset filter button if filter applied', () => {
          cy.getBySel('map-filter-licensePlate').type('test');
          cy.getBySel('map-filter-licensePlate').find('.mat-icon').should('exist').click({ force: true });
          cy.getBySel('map-filter-licensePlate').should('contain', '');
        });

        it('should trigger driver search by license plate', () => {
          cy.getBySel('map-search-panel').should('not.exist');
          cy.getBySel('map-filter-licensePlate').type('AQA0001');
          cy.getBySel('map-search-panel').should('exist');
          cy.getBySel('map-driver').should('exist');
        });
      });
    });

    describe('Live map panels', () => {
      describe('Home panel', () => {
        it('should display home panel', () => {
          cy.getBySel('map-home-panel').should('exist');
        });

        it.skip('should have title and subtitle', () => {
          cy.getBySel('map-home-panel-title').should('exist').should('contain', 'Водіїв на авто (1)');
          cy.getBySel('map-home-panel-subtitle').should('exist').should('contain', 'Оновлено');
        });

        it('should have toggle button', () => {
          cy.getBySel('map-home-panel-toggle').should('exist').should('contain', 'expand_more');
        });

        it('should toggle panel body visibility', () => {
          cy.getBySel('map-home-panel-body').should('exist');
          cy.getBySel('map-home-panel-toggle').click({ force: true });
          cy.getBySel('map-home-panel-body').should('not.exist');
          cy.getBySel('map-home-panel-toggle').click({ force: true });
          cy.getBySel('map-home-panel-body').should('exist');
        });

        it('should have 4 driver groups', () => {
          cy.getBySel('map-home-panel-group-OrderExecution').should('exist');
          cy.getBySel('map-home-panel-group-Active').should('exist');
          cy.getBySel('map-home-panel-group-Inactive').should('exist');
          cy.getBySel('map-home-panel-group-Blocked').should('exist');
        });

        it('should open drivers panel on group click', () => {
          cy.getBySel('map-home-panel-group-Inactive').click({ force: true });
          cy.getBySel('map-drivers-panel').should('exist');
          cy.getBySel('map-home-panel').should('not.exist');
        });

        describe('Order execution group', () => {
          it('should have group icon', () => {
            cy.getBySel('group-icon-OrderExecution').should('exist').should('contain', 'route');
          });

          it('should have info icon', () => {
            cy.getBySel('info-icon-OrderExecution').should('exist').should('contain', 'info');
          });

          it('should have drivers count', () => {
            cy.getBySel('drivers-count-OrderExecution').should('exist').find('span').should('contain', '0');
            cy.getBySel('drivers-count-OrderExecution').should('exist').find('small').should('contain', 'На замовлені');
          });
        });

        describe('Active group', () => {
          it('should have group icon', () => {
            cy.getBySel('group-icon-Active').should('exist').should('contain', 'task_alt');
          });

          it('should have info icon', () => {
            cy.getBySel('info-icon-Active').should('exist').should('contain', 'info');
          });

          it('should have drivers count', () => {
            cy.getBySel('drivers-count-Active').should('exist').find('span').should('contain', '0');
            cy.getBySel('drivers-count-Active').should('exist').find('small').should('contain', 'Вільний');
          });
        });

        describe('Blocked group', () => {
          it('should have group icon', () => {
            cy.getBySel('group-icon-Blocked').should('exist').should('contain', 'lock');
          });

          it('should have info icon', () => {
            cy.getBySel('info-icon-Blocked').should('exist').should('contain', 'info');
          });

          it('should have drivers count', () => {
            cy.getBySel('drivers-count-Blocked').should('exist').find('span').should('contain', '0');
            cy.getBySel('drivers-count-Blocked').should('exist').find('small').should('contain', 'З обмеженнями');
          });
        });

        describe('Inactive group', () => {
          it('should have group icon', () => {
            cy.getBySel('group-icon-Inactive').should('exist').should('contain', 'not_listed_location');
          });

          it('should have info icon', () => {
            cy.getBySel('info-icon-Inactive').should('exist').should('contain', 'info');
          });

          it('should have drivers count', () => {
            cy.getBySel('drivers-count-Inactive').should('exist').find('span').should('contain', '1');
            cy.getBySel('drivers-count-Inactive').should('exist').find('small').should('contain', 'Не активний');
          });
        });
      });

      describe('Drivers list panel', () => {
        beforeEach(() => cy.getBySel('map-home-panel-group-Inactive').click({ force: true }));

        it('should display drivers panel', () => {
          cy.getBySel('map-drivers-panel').should('exist');
        });

        it('should have back button which leads to home panel', () => {
          cy.getBySel('map-home-panel').should('not.exist');
          cy.getBySel('map-drivers-panel-back-btn').should('exist').click({ force: true });
          cy.getBySel('map-home-panel').should('exist');
        });

        it.skip('should have title', () => {
          cy.getBySel('map-drivers-panel-title').should('exist').should('contain', 'Не активних водіїв (1)');
        });

        it('should have toggle button', () => {
          cy.getBySel('map-drivers-panel-toggle').should('exist').should('contain', 'expand_more');
        });

        it('should toggle panel body visibility', () => {
          cy.getBySel('map-drivers-panel-body').should('exist');
          cy.getBySel('map-drivers-panel-toggle').click({ force: true });
          cy.getBySel('map-drivers-panel-body').should('not.exist');
          cy.getBySel('map-drivers-panel-toggle').click({ force: true });
          cy.getBySel('map-drivers-panel-body').should('exist');
        });

        it.skip('should display driver info', () => {
          cy.getBySel('driver-avatar').should('exist').should('have.attr', 'src').should('not.be.empty');
          cy.getBySel('driver-info')
            .should('exist')
            .should('contain', 'Aqaafeyh404 Aqadpilu404')
            .should('contain', '380506326599');
          cy.getBySel('driver-location-icon').should('exist').should('contain', 'location_off');
          cy.getBySel('driver-licensePlate').should('exist').should('contain', 'AQA0001');
        });
      });

      describe('Driver panel', () => {
        beforeEach(() => {
          cy.getBySel('map-home-panel-group-Inactive').click({ force: true });
          cy.getBySel('map-driver').click({ force: true });
        });

        it('should display driver panel', () => {
          cy.getBySel('map-driver-panel').should('exist');
        });

        it('should have back button which leads to drivers panel', () => {
          cy.getBySel('map-home-panel').should('not.exist');
          cy.getBySel('map-driver-panel-back-btn').should('exist').click({ force: true });
          cy.getBySel('map-drivers-panel').should('exist');
        });

        it('should have toggle button', () => {
          cy.getBySel('map-driver-panel-toggle').should('exist').should('contain', 'expand_more');
        });

        it('should toggle panel body visibility', () => {
          cy.getBySel('map-driver-panel-body').should('exist');
          cy.getBySel('map-driver-panel-toggle').click({ force: true });
          cy.getBySel('map-driver-panel-body').should('not.exist');
          cy.getBySel('map-driver-panel-toggle').click({ force: true });
          cy.getBySel('map-driver-panel-body').should('exist');
        });

        it('should have driver location info', () => {
          cy.getBySel('map-driver-panel-location').should('exist').should('contain', 'Локація');
          cy.getBySel('map-driver-panel-location-value').should('exist').should('contain', 'Центр');
        });

        describe('Driver info', () => {
          it.skip('should display driver avatar', () => {
            cy.getBySel('map-driver-panel-avatar')
              .should('exist')
              .find('img')
              .should('have.attr', 'src')
              .should('not.be.empty');

            cy.getBySel('map-driver-panel-avatar')
              .should('exist')
              .should('have.attr', 'href')
              .should('contain', '/workspace/drivers/details/1fad966a-b2f4-427b-a0da-4b04be5f871f');
          });

          it.skip('should display driver info', () => {
            cy.getBySel('map-driver-panel-info')
              .should('exist')
              .should('contain', 'Aqaafeyh404 Aqadpilu404')
              .should('contain', '380506326599');

            cy.getBySel('map-driver-panel-info')
              .find('a')
              .should('exist')
              .should('have.attr', 'href')
              .should('contain', '/workspace/drivers/details/1fad966a-b2f4-427b-a0da-4b04be5f871f');
          });

          it('should display driver status', () => {
            cy.getBySel('map-driver-panel-status').should('exist').should('contain', 'Не активний');
          });
        });

        describe('Vehicle info', () => {
          it('should have title', () => {
            cy.getBySel('map-driver-panel-vehicle-title').should('exist').should('contain', 'Авто');
          });

          it.skip('should have vehicle avatar', () => {
            cy.getBySel('map-driver-panel-vehicle-avatar')
              .should('exist')
              .find('img')
              .should('have.attr', 'src')
              .should('not.be.empty');

            cy.getBySel('map-driver-panel-vehicle-avatar')
              .should('exist')
              .should('have.attr', 'href')
              .should('contain', '/workspace/vehicles/details/b5bbf6ca-dec6-4073-a1db-4b3bb4dd171c');
          });

          it('should display vehicle info', () => {
            cy.getBySel('map-driver-panel-vehicle-info')
              .should('exist')
              .should('contain', 'AQA0001')
              .should('contain', 'Aston Martin Vulcan');

            cy.getBySel('map-driver-panel-vehicle-info')
              .find('a')
              .should('exist')
              .should('have.attr', 'href')
              .should('contain', '/workspace/vehicles/details/b5bbf6ca-dec6-4073-a1db-4b3bb4dd171c');
          });

          it('should display vehicle status', () => {
            cy.getBySel('map-driver-panel-vehicle-licensePlate').should('exist').should('contain', 'Стандарт');
          });
        });
      });
    });

    describe('Driver active filters', () => {
      const cases = [
        {
          order_accepting_methods: [DriverFilter.OFFER],
          status: EmployeeLocationStatus.Active,
          is_device_online: true,
          is_driver_in_idle: false,
        },
        {
          order_accepting_methods: [],
          status: EmployeeLocationStatus.Active,
          is_device_online: false,
          is_driver_in_idle: true,
        },
        {
          order_accepting_methods: [DriverFilter.BROADCAST, DriverFilter.LOOP_FILTER],
          status: EmployeeLocationStatus.OrderExecution,
          is_device_online: true,
          is_driver_in_idle: false,
        },
        {
          order_accepting_methods: [DriverFilter.BROADCAST, DriverFilter.LOOP_FILTER, DriverFilter.OFFER],
          status: EmployeeLocationStatus.Blocked,
          is_device_online: true,
          is_driver_in_idle: false,
        },
        {
          order_accepting_methods: [],
          status: EmployeeLocationStatus.Inactive,
          is_device_online: false,
          is_driver_in_idle: true,
        },
      ];
      const driver = {
        first_name: 'Hello',
        id: '1',
        last_name: 'World',
        phone: '380500000000',
        photos: { driver_avatar_photo: { url: '../../src/fixtures/images/driver-avatar.png' } },
        status: EmployeeLocationStatus.Active,
        vehicle: {
          comfort_level: 'Standard',
          id: '2',
          license_plate: 'AQA0001',
          make: 'Aston Martin',
          model: 'Vulcan',
          photos: { driver_car_front_photo: { url: '../../src/fixtures/images/driver-avatar.png' } },
        },
        location: { latitude: 50.449_84, longitude: 30.523_16 },
        order_accepting_methods: [DriverFilter.OFFER],
        is_device_online: true,
        is_driver_in_idle: false,
      } as LiveMapEmployeeDto;

      const drivers = cases.map(({ order_accepting_methods, status, is_device_online, is_driver_in_idle }, index) => {
        return {
          ...driver,
          id: `${index}`,
          order_accepting_methods,
          status,
          is_device_online,
          is_driver_in_idle,
          first_name: `Name${index}`,
          last_name: `LastName${index}`,
          location: status === EmployeeLocationStatus.Inactive ? null : driver.location,
        };
      });

      it('[8218, 8221, 8222, 8226, 8227, 8228] should display driver active filters', () => {
        fleetDriverIntercept.apply({ name: 'ok', props: { drivers } });
        driverActiveFiltersIntercept.apply({ name: 'ok', props: { count: 1, filters: [DriverFilter.OFFER] } });
        cy.reload();

        // Active drivers
        cy.getBySel('map-home-panel-group-Active').click();

        // list
        cy.getBySel('map-driver')
          .eq(0)
          .within(() => {
            cy.getBySel('active-filter').should('exist').should('contain', 'ефір');
            cy.getBySel('active-filter-link').should('exist').should('contain', 'Фільтр (авто)').click();
          });
        checkFiltersDialog();

        // details
        cy.getBySel('map-driver').eq(0).click();
        cy.getBySel('active-filter').should('exist').should('contain', 'ефір');
        cy.getBySel('active-filter-link').should('exist').should('contain', 'Фільтр (авто)').click();
        checkFiltersDialog();

        // popover
        cy.get('.leaflet-marker-icon').should('exist').click();
        cy.getBySel('live-map-employee-popup')
          .should('exist')
          .within(() => {
            cy.getBySel('active-filter').should('exist').should('contain', 'ефір');
            cy.getBySel('active-filter-link').should('exist').should('contain', 'Фільтр (авто)').click();
          });
        checkFiltersDialog();
        cy.getBySel('map-driver-panel-back-btn').should('exist').click();

        // list
        cy.getBySel('map-driver')
          .eq(1)
          .within(() => {
            cy.getBySel('active-filter-link').should('not.exist');
            cy.getBySel('active-filter').should('exist').should('contain', 'Неактивний').click();
          });
        cy.getBySel('driver-filters-details-dialog').should('not.exist');

        // details
        cy.getBySel('map-driver').eq(1).click();
        cy.getBySel('active-filter-link').should('not.exist');
        cy.getBySel('active-filter').should('exist').should('contain', 'Неактивний').click();
        cy.getBySel('driver-filters-details-dialog').should('not.exist');

        // popover
        cy.get('.leaflet-marker-icon').should('exist').click();
        cy.getBySel('live-map-employee-popup')
          .should('exist')
          .within(() => {
            cy.getBySel('active-filter-link').should('not.exist');
            cy.getBySel('active-filter').should('exist').should('contain', 'Неактивний').click();
          });
        cy.getBySel('driver-filters-details-dialog').should('not.exist');

        cy.getBySel('map-driver-panel-back-btn').should('exist').click();
        cy.getBySel('map-drivers-panel-back-btn').should('exist').click();

        // --------------------------------------------------------------------------------------

        // OrderExecution drivers
        cy.getBySel('map-home-panel-group-OrderExecution').click();

        // list
        cy.getBySel('map-driver').within(() => {
          cy.getBySel('active-filter').should('exist').should('contain', 'ефір');
          cy.getBySel('active-filter-link').should('exist').should('contain', 'Фільтри (ефір, цикл)').click();
        });
        checkFiltersDialog();

        // details
        cy.getBySel('map-driver').click();
        cy.getBySel('active-filter').should('exist').should('contain', 'ефір');
        cy.getBySel('active-filter-link').should('exist').should('contain', 'Фільтри (ефір, цикл)').click();
        checkFiltersDialog();

        // popover
        cy.get('.leaflet-marker-icon').should('exist').click();
        cy.getBySel('live-map-employee-popup')
          .should('exist')
          .within(() => {
            cy.getBySel('active-filter').should('exist').should('contain', 'ефір');
            cy.getBySel('active-filter-link').should('exist').should('contain', 'Фільтри (ефір, цикл)').click();
          });
        checkFiltersDialog();

        cy.getBySel('map-driver-panel-back-btn').should('exist').click();
        cy.getBySel('map-drivers-panel-back-btn').should('exist').click();

        // --------------------------------------------------------------------------------------

        // Blocked drivers
        cy.getBySel('map-home-panel-group-Blocked').click();

        // list
        cy.getBySel('map-driver').within(() => {
          cy.getBySel('active-filter').should('exist').should('contain', 'ефір');
          cy.getBySel('active-filter-link').should('exist').should('contain', 'Фільтри (ефір, цикл, авто)').click();
        });
        checkFiltersDialog();

        // details
        cy.getBySel('map-driver').click();
        cy.getBySel('active-filter').should('exist').should('contain', 'ефір');
        cy.getBySel('active-filter-link').should('exist').should('contain', 'Фільтри (ефір, цикл, авто)').click();
        checkFiltersDialog();

        // popover
        cy.get('.leaflet-marker-icon').should('exist').click();
        cy.getBySel('live-map-employee-popup')
          .should('exist')
          .within(() => {
            cy.getBySel('active-filter').should('exist').should('contain', 'ефір');
            cy.getBySel('active-filter-link').should('exist').should('contain', 'Фільтри (ефір, цикл, авто)').click();
          });
        checkFiltersDialog();

        cy.getBySel('map-driver-panel-back-btn').should('exist').click();
        cy.getBySel('map-drivers-panel-back-btn').should('exist').click();

        // --------------------------------------------------------------------------------------

        // Inactive drivers
        cy.getBySel('map-home-panel-group-Inactive').click();

        // list
        cy.getBySel('map-driver').within(() => {
          cy.getBySel('active-filter-link').should('not.exist');
          cy.getBySel('active-filter').should('exist').should('contain', 'Неактивний').click();
        });
        cy.getBySel('driver-filters-details-dialog').should('not.exist');

        // details
        cy.getBySel('map-driver').click();
        cy.getBySel('active-filter-link').should('not.exist');
        cy.getBySel('active-filter').should('exist').should('contain', 'Неактивний').click();
        cy.getBySel('driver-filters-details-dialog').should('not.exist');

        // popover
        cy.get('.leaflet-marker-icon').should('not.exist');
        cy.getBySel('map-driver-panel-back-btn').should('exist').click();
      });
    });
  });
}
