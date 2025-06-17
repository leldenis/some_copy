describe('Order details', () => {
  beforeEach(() => {
    cy.loginWithSession('orderDetails');
    cy.visit('/workspace/orders/details/e098876173964b118f7088bde518a668?driverId=1fad966ab2f4427ba0da4b04be5f871f');
  });

  describe('Map', () => {
    it.skip('[PF-1078] should display empty state while data is loading', () => {
      cy.intercept('api/fleets/orders/e098876173964b118f7088bde518a668', (req) => {
        cy.getBySel('trip-map').should('not.be.visible');
        cy.getBySel('no-data').should('be.visible');
        cy.getBySel('loading-indicator').should('be.visible');

        req.continue(() => {
          cy.getBySel('trip-map').should('be.visible');
          cy.getBySel('no-data').should('not.be.visible');
          cy.getBySel('loading-indicator').should('not.be.visible');
        });
      });
    });

    it.skip('[PF-1079] should display map when data finished loading', () => {
      cy.intercept('api/fleets/orders/e098876173964b118f7088bde518a668', (req) => {
        req.continue(() => {
          cy.getBySel('trip-map').should('be.visible');
        });
      });
    });

    it.skip('[PF-1080] should have route start and route end markers', () => {
      cy.getBySel('trip-map').should('exist');
      cy.getBySel('trip-map')
        .find('.leaflet-marker-icon')
        .eq(0)
        .should('have.attr', 'src')
        .should('include', 'icon_route_start.svg');
      cy.getBySel('trip-map')
        .find('.leaflet-marker-icon')
        .eq(1)
        .should('have.attr', 'src')
        .should('include', 'icon_route_end.svg');
    });
  });

  describe('Order details panel', () => {
    it.skip('[PF-1081] should have order details panel', () => {
      cy.getBySel('order-details-panel').should('exist');
    });

    it.skip('[PF-1082] should be opened by default', () => {
      cy.getBySel('order-details-panel').should('have.attr', 'data-opened').should('contain', 'true');
      cy.getBySel('order-details-panel-data').should('exist');
    });

    it.skip('[PF-1083] should toggle opened state on panel header click', () => {
      cy.getBySel('order-details-panel-toggle').should('exist').click({ force: true });
      cy.getBySel('order-details-panel').should('have.attr', 'data-opened').should('contain', 'false');
      cy.getBySel('order-details-panel-data').should('not.exist');

      cy.getBySel('order-details-panel-toggle').should('exist').click({ force: true });
      cy.getBySel('order-details-panel').should('have.attr', 'data-opened').should('contain', 'true');
      cy.getBySel('order-details-panel-data').should('exist');
    });

    describe('Order details panel header', () => {
      it.skip('[PF-1084] should have panel toggle', () => {
        cy.getBySel('order-details-panel-toggle').should('exist');
      });

      it.skip('[PF-1085] should have driver info', () => {
        cy.getBySel('driver-fullName').should('exist').should('contain', 'Aqaafeyh404 Aqadpilu404');
        cy.getBySel('driver-phone').should('exist').should('contain', '380506326599');
        cy.getBySel('driver-signal').should('exist').should('contain', '500265');
        cy.getBySel('driver-avatar').should('exist').get('img').should('have.attr', 'src').should('not.be.empty');
      });

      it.skip('[PF-1086] should have order statuts badge', () => {
        cy.getBySel('order-status').should('exist').should('contain', 'Виконано');
      });

      it.skip('[PF-1087] should have driver avatar and full name navigating to driver page', () => {
        const driverLink = '/workspace/drivers/details/1fad966a-b2f4-427b-a0da-4b04be5f871f';

        cy.getBySel('driver-avatar').should('exist').should('have.attr', 'href').should('contain', driverLink);
        cy.getBySel('driver-fullName').should('exist').should('have.attr', 'href').should('contain', driverLink);
      });
    });

    describe('Order details vehicle info', () => {
      it.skip('[PF-1088] should have vehicle info', () => {
        cy.getBySel('vehicle-licensePlate').should('exist').should('contain', 'AQA0001');
        cy.getBySel('vehicle-makeModel').should('exist').should('contain', 'Aston Martin Vulcan');
        cy.getBySel('vehicle-avatar').should('exist').get('img').should('have.attr', 'src').should('not.be.empty');
      });

      it.skip('[PF-1089] should have vehicle avatar and full name navigating to vehicle page', () => {
        const vehicleLink = '/workspace/vehicles/details/b5bbf6ca-dec6-4073-a1db-4b3bb4dd171c';

        cy.getBySel('vehicle-avatar').should('exist').should('have.attr', 'href').should('contain', vehicleLink);
        cy.getBySel('vehicle-licensePlate').should('exist').should('have.attr', 'href').should('contain', vehicleLink);
      });
    });

    describe('Order trip details', () => {
      it.skip('[PF-1090] should have route points displayed', () => {
        cy.getBySel('route-point-0').should('exist').should('contain', 'Гагарина улица, 33');
        cy.getBySel('route-point-1').should('exist').should('contain', 'Гагарина улица (Лебединское)');
      });

      it.skip('[PF-1091] should have trip time info', () => {
        cy.getBySel('trip-duration').should('exist').should('contain', '01 хв');

        cy.getBySel('trip-created-at').should('exist').find('.label').should('contain', 'Взяття');
        cy.getBySel('trip-created-at').should('exist').find(':nth-child(2)').should('contain', '12:45');

        cy.getBySel('trip-pickup-time').should('exist').find('.label').should('contain', 'Подача');
        cy.getBySel('trip-pickup-time').should('exist').find(':nth-child(2)').should('contain', '12:52');

        cy.getBySel('trip-completed-at').should('exist').find('.label').should('contain', 'Завершення');
        cy.getBySel('trip-completed-at').should('exist').find(':nth-child(2)').should('contain', '12:45');
      });

      it.skip('[PF-1092] should have trip info', () => {
        cy.getBySel('trip-info').should('exist').find(`:nth-child(1)`).should('exist').should('contain', 'Дата');
        cy.getBySel('trip-info').should('exist').find(`:nth-child(2)`).should('exist').should('contain', '17.08.2023');

        cy.getBySel('trip-info').should('exist').find(`:nth-child(3)`).should('exist').should('contain', 'Тип оплати');
        cy.getBySel('trip-info').should('exist').find(`:nth-child(4)`).should('exist').should('contain', 'На карту');

        cy.getBySel('trip-info').should('exist').find(`:nth-child(5)`).should('exist').should('contain', 'Вартість');
        cy.getBySel('trip-info').should('exist').find(`:nth-child(6)`).should('exist').should('contain', '₴ 194.00');

        cy.getBySel('trip-info')
          .should('exist')
          .find(`:nth-child(7)`)
          .should('exist')
          .should('contain', 'Довжина маршруту');
        cy.getBySel('trip-info').should('exist').find(`:nth-child(8)`).should('exist').should('contain', '24.97 км');

        cy.getBySel('trip-info')
          .should('exist')
          .find(`:nth-child(9)`)
          .should('exist')
          .should('contain', 'Оцінка водія');
        cy.getBySel('trip-info').should('exist').find(`:nth-child(10)`).should('exist').should('contain', '5.00');
      });

      it.skip('[PF-1093] should have product type badge', () => {
        cy.getBySel('product-type').should('exist').should('contain', 'Стандарт');
      });
    });
  });
});
