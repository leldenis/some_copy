describe('Live map', () => {
  beforeEach(() => {
    cy.loginWithSession('liveMap');
    cy.visit('/workspace/live-map');
  });

  it.skip('[PF-1272] should display map', () => {
    cy.getBySel('live-map').should('exist');
  });

  it.skip('[PF-1273] should display map panel', () => {
    cy.getBySel('map-home-panel').should('exist');
  });

  it.skip('[PF-1274] should have map disclaimer', () => {
    cy.getBySel('map-disclaimer')
      .should('exist')
      .should('contain', 'Геолокація може передаватися з похибкою і її не можна використовувати як GPS трекер');
  });

  it.skip('[PF-1275] should have zoom buttons', () => {
    cy.get('.leaflet-control-zoom-in').should('exist').should('contain', '+');
    cy.get('.leaflet-control-zoom-out').should('exist').should('contain', '−');
  });

  it.skip('[PF-1276] should toggle fullscreen mode', () => {
    cy.getBySel('map-header').should('be.visible');
    cy.getBySel('map-fullscreen-btn').should('exist').click({ force: true });
    cy.getBySel('map-header').should('not.be.visible');
    cy.getBySel('map-fullscreen-btn').should('exist').click({ force: true });
    cy.getBySel('map-header').should('be.visible');
  });

  describe('Live map filters', () => {
    beforeEach(() => cy.getBySel('filters-btn').should('exist').click());

    it.skip('[PF-1277] should toggle filters on filters button click', () => {
      cy.getBySel('filters-form').should('exist').should('be.visible');
      cy.getBySel('filters-btn').should('exist').click();
      cy.getBySel('filters-form').should('not.exist');
      cy.getBySel('filters-btn').should('exist').click();
      cy.getBySel('filters-form').should('exist').should('be.visible');
    });

    it.skip('[PF-1278] should have name and license plate filters', () => {
      cy.getBySel('map-filter-name').should('exist');
      cy.getBySel('map-filter-licensePlate').should('exist');
    });

    it.skip('[PF-1279] should have default filters value', () => {
      cy.getBySel('map-filter-name').should('contain', '');
      cy.getBySel('map-filter-licensePlate').should('contain', '');
    });

    it.skip('[PF-1280] should display Clear button if name filter changed', () => {
      cy.getBySel('filter-reset-btn').should('not.exist');
      cy.getBySel('map-filter-name').should('exist').type('test');
      cy.getBySel('filter-reset-btn').should('exist');
    });

    it.skip('[PF-1281] should display Clear button if license plate filter changed', () => {
      cy.getBySel('filter-reset-btn').should('not.exist');
      cy.getBySel('map-filter-licensePlate').should('exist').type('test');
      cy.getBySel('filter-reset-btn').should('exist');
    });

    it.skip('[PF-1282] should reset filters to default on Clear button click', () => {
      cy.getBySel('filter-reset-btn').should('not.exist');
      cy.getBySel('map-filter-name').should('exist').type('test');
      cy.getBySel('map-filter-licensePlate').should('exist').type('test');
      cy.getBySel('filter-reset-btn').should('exist');
      cy.getBySel('map-filter-name').should('contain', '');
      cy.getBySel('map-filter-licensePlate').should('contain', '');
    });

    describe('Name filter', () => {
      it.skip('[PF-1283] should have placeholder', () => {
        cy.getBySel('map-filter-name').find('input').invoke('attr', 'placeholder').should('contain', "Прізвище, Ім'я");
      });

      it.skip('[PF-1284] should have label', () => {
        cy.getBySel('map-filter-name').find('label').should('contain', 'Пошук водіїв');
      });

      it.skip('[PF-1285] should have search icon if no filter applied', () => {
        cy.getBySel('map-filter-name')
          .find('mat-icon')
          .should('exist')
          .should('have.attr', 'svgicon')
          .should('contain', 'search');
      });

      it.skip('[PF-1286] should have reset filter button if filter applied', () => {
        cy.getBySel('map-filter-name').type('test');
        cy.getBySel('map-filter-name').find('.mat-icon').should('exist').click({ force: true });
        cy.getBySel('map-filter-name').should('contain', '');
      });

      it.skip('[PF-1287] should trigger driver search by name', () => {
        cy.getBySel('map-search-panel').should('not.exist');
        cy.getBySel('map-filter-name').type('Aqadpilu404');
        cy.getBySel('map-search-panel').should('exist');
        cy.getBySel('map-driver').should('exist');
      });
    });

    describe('License plate filter', () => {
      it.skip('[PF-1288] should have placeholder', () => {
        cy.getBySel('map-filter-licensePlate')
          .find('input')
          .invoke('attr', 'placeholder')
          .should('contain', 'Держ. номер');
      });

      it.skip('[PF-1289] should have label', () => {
        cy.getBySel('map-filter-licensePlate').find('label').should('contain', 'Пошук авто');
      });

      it.skip('[PF-1290] should have search icon if no filter applied', () => {
        cy.getBySel('map-filter-licensePlate')
          .find('mat-icon')
          .should('exist')
          .should('have.attr', 'svgicon')
          .should('contain', 'search');
      });

      it.skip('[PF-1291] should have reset filter button if filter applied', () => {
        cy.getBySel('map-filter-licensePlate').type('test');
        cy.getBySel('map-filter-licensePlate').find('.mat-icon').should('exist').click({ force: true });
        cy.getBySel('map-filter-licensePlate').should('contain', '');
      });

      it.skip('[PF-1292] should trigger driver search by license plate', () => {
        cy.getBySel('map-search-panel').should('not.exist');
        cy.getBySel('map-filter-licensePlate').type('AQA0001');
        cy.getBySel('map-search-panel').should('exist');
        cy.getBySel('map-driver').should('exist');
      });
    });
  });

  describe('Live map panels', () => {
    describe('Home panel', () => {
      it.skip('[PF-1293] should display home panel', () => {
        cy.getBySel('map-home-panel').should('exist');
      });

      it.skip('[PF-1294] should have title and subtitle', () => {
        cy.getBySel('map-home-panel-title').should('exist').should('contain', 'Водіїв на авто (1)');
        cy.getBySel('map-home-panel-subtitle').should('exist').should('contain', 'Оновлено');
      });

      it.skip('[PF-1295] should have toggle button', () => {
        cy.getBySel('map-home-panel-toggle').should('exist').should('contain', 'expand_more');
      });

      it.skip('[PF-1296] should toggle panel body visibility', () => {
        cy.getBySel('map-home-panel-body').should('exist');
        cy.getBySel('map-home-panel-toggle').click({ force: true });
        cy.getBySel('map-home-panel-body').should('not.exist');
        cy.getBySel('map-home-panel-toggle').click({ force: true });
        cy.getBySel('map-home-panel-body').should('exist');
      });

      it.skip('[PF-1297] should have 4 driver groups', () => {
        cy.getBySel('map-home-panel-group-OrderExecution').should('exist');
        cy.getBySel('map-home-panel-group-Active').should('exist');
        cy.getBySel('map-home-panel-group-Inactive').should('exist');
        cy.getBySel('map-home-panel-group-Blocked').should('exist');
      });

      it.skip('[PF-1298] should open drivers panel on group click', () => {
        cy.getBySel('map-home-panel-group-Inactive').click({ force: true });
        cy.getBySel('map-drivers-panel').should('exist');
        cy.getBySel('map-home-panel').should('not.exist');
      });

      describe('Order execution group', () => {
        it.skip('[PF-1299] should have group icon', () => {
          cy.getBySel('group-icon-OrderExecution').should('exist').should('contain', 'route');
        });

        it.skip('[PF-1300] should have info icon', () => {
          cy.getBySel('info-icon-OrderExecution').should('exist').should('contain', 'info');
        });

        it.skip('[PF-1301] should have drivers count', () => {
          cy.getBySel('drivers-count-OrderExecution').should('exist').find('span').should('contain', '0');
          cy.getBySel('drivers-count-OrderExecution').should('exist').find('small').should('contain', 'На замовлені');
        });
      });

      describe('Active group', () => {
        it.skip('[PF-1302] should have group icon', () => {
          cy.getBySel('group-icon-Active').should('exist').should('contain', 'task_alt');
        });

        it.skip('[PF-1303] should have info icon', () => {
          cy.getBySel('info-icon-Active').should('exist').should('contain', 'info');
        });

        it.skip('[PF-1304] should have drivers count', () => {
          cy.getBySel('drivers-count-Active').should('exist').find('span').should('contain', '0');
          cy.getBySel('drivers-count-Active').should('exist').find('small').should('contain', 'Вільний');
        });
      });

      describe('Blocked group', () => {
        it.skip('[PF-1305] should have group icon', () => {
          cy.getBySel('group-icon-Blocked').should('exist').should('contain', 'lock');
        });

        it.skip('[PF-1306] should have info icon', () => {
          cy.getBySel('info-icon-Blocked').should('exist').should('contain', 'info');
        });

        it.skip('[PF-1307] should have drivers count', () => {
          cy.getBySel('drivers-count-Blocked').should('exist').find('span').should('contain', '0');
          cy.getBySel('drivers-count-Blocked').should('exist').find('small').should('contain', 'З обмеженнями');
        });
      });

      describe('Inactive group', () => {
        it.skip('[PF-1308] should have group icon', () => {
          cy.getBySel('group-icon-Inactive').should('exist').should('contain', 'not_listed_location');
        });

        it.skip('[PF-1309] should have info icon', () => {
          cy.getBySel('info-icon-Inactive').should('exist').should('contain', 'info');
        });

        it.skip('[PF-1310] should have drivers count', () => {
          cy.getBySel('drivers-count-Inactive').should('exist').find('span').should('contain', '1');
          cy.getBySel('drivers-count-Inactive').should('exist').find('small').should('contain', 'Не активний');
        });
      });
    });

    describe('Drivers list panel', () => {
      beforeEach(() => cy.getBySel('map-home-panel-group-Inactive').click({ force: true }));

      it.skip('[PF-1311] should display drivers panel', () => {
        cy.getBySel('map-drivers-panel').should('exist');
      });

      it.skip('[PF-1312] should have back button which leads to home panel', () => {
        cy.getBySel('map-home-panel').should('not.exist');
        cy.getBySel('map-drivers-panel-back-btn').should('exist').click({ force: true });
        cy.getBySel('map-home-panel').should('exist');
      });

      it.skip('[PF-1313] should have title', () => {
        cy.getBySel('map-drivers-panel-title').should('exist').should('contain', 'Не активних водіїв (1)');
      });

      it.skip('[PF-1314] should have toggle button', () => {
        cy.getBySel('map-drivers-panel-toggle').should('exist').should('contain', 'expand_more');
      });

      it.skip('[PF-1315] should toggle panel body visibility', () => {
        cy.getBySel('map-drivers-panel-body').should('exist');
        cy.getBySel('map-drivers-panel-toggle').click({ force: true });
        cy.getBySel('map-drivers-panel-body').should('not.exist');
        cy.getBySel('map-drivers-panel-toggle').click({ force: true });
        cy.getBySel('map-drivers-panel-body').should('exist');
      });

      it.skip('[PF-1316] should display driver info', () => {
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

      it.skip('[PF-1317] should display driver panel', () => {
        cy.getBySel('map-driver-panel').should('exist');
      });

      it.skip('[PF-1318] should have back button which leads to drivers panel', () => {
        cy.getBySel('map-home-panel').should('not.exist');
        cy.getBySel('map-driver-panel-back-btn').should('exist').click({ force: true });
        cy.getBySel('map-drivers-panel').should('exist');
      });

      it.skip('[PF-1319] should have toggle button', () => {
        cy.getBySel('map-driver-panel-toggle').should('exist').should('contain', 'expand_more');
      });

      it.skip('[PF-1320] should toggle panel body visibility', () => {
        cy.getBySel('map-driver-panel-body').should('exist');
        cy.getBySel('map-driver-panel-toggle').click({ force: true });
        cy.getBySel('map-driver-panel-body').should('not.exist');
        cy.getBySel('map-driver-panel-toggle').click({ force: true });
        cy.getBySel('map-driver-panel-body').should('exist');
      });

      it.skip('[PF-1321] should have driver location info', () => {
        cy.getBySel('map-driver-panel-location')
          .should('exist')
          .should('contain', 'Локація')
          .should('contain', 'Геолокація невідома');
      });

      describe('Driver info', () => {
        it.skip('[PF-1322] should display driver avatar', () => {
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

        it.skip('[PF-1323] should display driver info', () => {
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

        it.skip('[PF-1324] should display driver status', () => {
          cy.getBySel('map-driver-panel-status').should('exist').should('contain', 'Не активний');
        });
      });

      describe('Vehicle info', () => {
        it.skip('[PF-1325] should have title', () => {
          cy.getBySel('map-driver-panel-vehicle-title').should('exist').should('contain', 'Авто');
        });

        it.skip('[PF-1326] should have vehicle avatar', () => {
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

        it.skip('[PF-1327] should display vehicle info', () => {
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

        it.skip('[PF-1328] should display vehicle status', () => {
          cy.getBySel('map-driver-panel-vehicle-licensePlate').should('exist').should('contain', 'Стандарт');
        });
      });
    });
  });
});
