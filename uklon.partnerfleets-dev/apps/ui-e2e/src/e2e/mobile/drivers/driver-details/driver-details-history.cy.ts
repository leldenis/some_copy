describe.skip('Driver details history tab', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.loginWithSession('driverDetailsTabs');
    cy.visit('/workspace/drivers/details/1fad966a-b2f4-427b-a0da-4b04be5f871f');
    cy.getBySel('mobile-menu-toggle-btn').as('menu').should('exist');
    cy.getBySel('logout').as('logout').should('exist');
  });

  after(() => {
    cy.get('@menu').click();
    cy.get('@logout').click();
  });

  it.skip('[PF-1168] should navigate to driver page', () => {
    cy.url().should('include', `/workspace/drivers/details/1fad966a-b2f4-427b-a0da-4b04be5f871f`);
  });

  describe('Driver history', () => {
    beforeEach(() => {
      cy.getBySel('driver-details-tabs-history').should('exist').click();
      cy.get('.mat-accordion').should('exist');
    });

    it.skip('[PF-1191] should should have active class for accessibility tab', () => {
      cy.get('.mdc-tab-indicator--active').getBySel('driver-details-tabs-history').should('contain', 'Історія змін');
    });

    it.skip('[PF-1192] should have Event type, Role/Author, Occurrence date column', () => {
      cy.getBySel('header-event-type').should('exist').should('contain', 'Тип події');
      cy.getBySel('header-role').should('exist').should('contain', 'Роль').should('contain', 'Автор');
      cy.getBySel('header-date').should('exist').should('contain', 'Дата зміни');
    });

    describe('Driver history filter', () => {
      it.skip('[PF-1193] should have driver history filter', () => {
        cy.getBySel('history-type-control').should('exist');
      });

      it.skip('[PF-1194] should have 17 options', () => {
        cy.getBySel('history-type-control').should('exist').click();
        cy.get('.mat-mdc-option').should('have.length', 17);
        cy.get('.mat-mdc-option').eq(0).click();
      });
    });

    describe('History events types', () => {
      beforeEach(() => {
        cy.getBySel('history-type-control').should('exist').click();
      });

      describe('PhoneChanged event', () => {
        beforeEach(() => {
          cy.getBySel('history-type-option-PhoneChanged').should('exist').click();
        });

        it.skip('[PF-1195] should have PhoneChanged event', () => {
          cy.getBySel('history-event-panel-PhoneChanged-0').should('exist').click();
          cy.getBySel('history-event-panel-PhoneChanged-0').should('not.have.class', 'mat-expanded');
        });

        it.skip('[PF-1196] should have Event type, Role and Occurrence date cell', () => {
          cy.getBySel('cell-PhoneChanged-0').should('exist').should('contain', 'Номер телефону змінено');

          cy.getBySel('cell-role-0').should('exist').should('contain', 'Менеджер Уклон');
          cy.getBySel('cell-email-0').should('not.exist');

          cy.getBySel('cell-date-0').should('exist').should('contain', '19.05.2023');
          cy.getBySel('cell-time-0').should('exist').should('contain', '10:30');
        });
      });

      describe('Registered event', () => {
        beforeEach(() => {
          cy.getBySel('history-type-option-Registered').should('exist').click();
        });

        it.skip('[PF-1197] should have Registered event', () => {
          cy.getBySel('history-event-panel-Registered-0').should('exist').click();
          cy.getBySel('history-event-panel-Registered-0').should('not.have.class', 'mat-expanded');
        });

        it.skip('[PF-1198] should have Event type, Role and Occurrence date cell', () => {
          cy.getBySel('cell-Registered-0').should('exist').should('contain', 'Реєстрація');

          cy.getBySel('cell-role-0').should('exist').should('contain', '-');
          cy.getBySel('cell-email-0').should('exist').should('contain', 'andrii.kucherov@uklon.com.ua');

          cy.getBySel('cell-date-0').should('exist').should('contain', '21.10.2022');
          cy.getBySel('cell-time-0').should('exist').should('contain', '13:36');
        });
      });

      describe.skip('ProfileChanged event', () => {
        beforeEach(() => {
          cy.getBySel('history-type-option-ProfileChanged').should('exist').click();
        });

        it.skip('[PF-1199] should have ProfileChanged event', () => {
          cy.getBySel('history-event-panel-ProfileChanged-0').should('exist').click();
          cy.getBySel('history-event-panel-ProfileChanged-0').should('have.class', 'mat-expanded');
        });

        it.skip('[PF-1200] should have Event type, Role, Occurrence date and toggle cell', () => {
          cy.getBySel('cell-ProfileChanged-0').should('exist').should('contain', 'Зміна даних водія');
          cy.getBySel('cell-no-data-ProfileChanged-0').should('not.exist');

          cy.getBySel('cell-role-0').should('exist').should('contain', '-');
          cy.getBySel('cell-email-0').should('exist').should('contain', '404afeyh@aqa.aqa');

          cy.getBySel('cell-date-0').should('exist').should('contain', '23.05.2023');
          cy.getBySel('cell-time-0').should('exist').should('contain', '08:10');

          cy.getBySel('cell-toggle-0').should('exist').should('be.visible');
        });

        it.skip('[PF-1201] should have additional data', () => {
          cy.getBySel('history-event-panel-ProfileChanged-0').should('exist').click();
          cy.getBySel('history-additional-info').should('exist');
        });

        it.skip('[PF-1202] should toggle additional info', () => {
          cy.getBySel('cell-toggle-0').should('be.visible').click();
          cy.getBySel('history-additional-info').should('be.visible');
          cy.getBySel('cell-toggle-0').should('be.visible').click();
          cy.getBySel('history-additional-info').should('not.be.visible');
        });

        it.skip('[PF-1203] should have changed Field name, Old value and New value label', () => {
          cy.getBySel('cell-toggle-0').should('be.visible').click();
          cy.getBySel('history-changed-field-label').should('exist').should('contain', 'Поле');

          cy.getBySel('cell-toggle-0').should('be.visible').click();
          cy.getBySel('history-old-value-label').should('exist').should('contain', 'Було');

          cy.getBySel('cell-toggle-0').should('be.visible').click();
          cy.getBySel('history-new-value-label').should('exist').should('contain', 'Стало');
        });
      });

      describe('ProductAvailabilityChanged event', () => {
        beforeEach(() => {
          cy.getBySel('history-type-option-ProductAvailabilityChanged').should('exist').click();
        });

        it.skip('[PF-1204] should have ProductAvailabilityChanged event', () => {
          cy.getBySel('history-event-panel-ProductAvailabilityChanged-0').should('exist').click();
          cy.getBySel('history-event-panel-ProductAvailabilityChanged-0').should('have.class', 'mat-expanded');
        });

        it.skip('[PF-1205] should have Event type, Role, Occurrence date and toggle cell', () => {
          cy.getBySel('cell-ProductAvailabilityChanged-0').should('exist').should('contain', 'Доступність продуктів');
          cy.getBySel('cell-no-data-ProductAvailabilityChanged-0').should('not.exist');

          cy.getBySel('cell-role-0').should('exist').should('contain', 'Менеджер Уклон');
          cy.getBySel('cell-email-0').should('not.exist');

          cy.getBySel('cell-date-0').should('exist').should('contain', '22.05.2023');
          cy.getBySel('cell-time-0').should('exist').should('contain', '14:00');

          cy.getBySel('cell-toggle-0').should('exist').should('be.visible');
        });

        it.skip('[PF-1206] should have enabled and disabled products label', () => {
          cy.getBySel('history-event-panel-ProductAvailabilityChanged-0').should('exist').click();
          cy.getBySel('history-additional-info').should('be.visible');
          cy.getBySel('history-product-enabled-label').should('exist').should('contain', 'Увімкнуті');

          cy.getBySel('history-event-panel-ProductAvailabilityChanged-1').should('exist').click();
          cy.getBySel('history-additional-info').should('be.visible');
          cy.getBySel('history-product-disabled-label').should('exist').should('contain', 'Вимкнуті');
        });
      });

      describe('PictureUploaded event', () => {
        beforeEach(() => {
          cy.getBySel('history-type-option-PictureUploaded').should('exist').click();
        });

        it.skip('[PF-1207] should have PictureUploaded event', () => {
          cy.getBySel('history-event-panel-PictureUploaded-0').should('exist').click();
          cy.getBySel('history-event-panel-PictureUploaded-0').should('not.have.class', 'mat-expanded');
        });

        it.skip('[PF-1208] should have Event type, Role and Occurrence date cell', () => {
          cy.getBySel('cell-PictureUploaded-0').should('exist').should('contain', 'Фото завантажено');
          cy.getBySel('cell-no-data-PictureUploaded-0').should('exist').should('contain', 'Додаткові дані відсутні');

          cy.getBySel('cell-role-0').should('exist').should('contain', '-');
          cy.getBySel('cell-email-0').should('exist').should('contain', 'andrii.kucherov@uklon.com.ua');

          cy.getBySel('cell-date-0').should('exist').should('contain', '01.11.2022');
          cy.getBySel('cell-time-0').should('exist').should('contain', '07:15');
        });
      });
    });
  });
});
