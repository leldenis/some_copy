describe('Orders reports', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.loginWithSession('ordersReports');
    cy.visit('workspace/orders');
  });

  it.skip('[PF-1094] should display empty state', () => {
    cy.getBySel('no-data').should('exist').should('be.visible');
  });

  describe('Orders tabs', () => {
    it.skip('[PF-1095] should have orders reports tab active', () => {
      cy.get('.mdc-tab-indicator--active').should('exist').should('contain', 'Звіт про поїздки');
    });
  });

  describe('Orders reports filters', () => {
    it.skip('[PF-1096] should have date and drivers filters', () => {
      cy.getBySel('orders-reports-date-filter').should('exist');
      cy.getBySel('drivers-control').should('exist');
    });

    it.skip('[PF-1097] should have default filters values', () => {
      cy.getBySel('orders-reports-date-filter').should('contain', 'Поточний тиждень');
      cy.getBySel('drivers-control').should('contain', '');
    });

    it.skip('[PF-1098] should display applied filters count', () => {
      cy.getBySel('applied-filters-count').should('not.exist');
      cy.useDateRangeFilter('custom', '01.05.2023', '31.05.2023');
      cy.getBySel('applied-filters-count').should('exist').should('contain', '1');
      cy.useDriverFilter();
      cy.getBySel('applied-filters-count').should('exist').should('contain', '2');
      cy.useDriverFilter(null, 'all');
      cy.getBySel('applied-filters-count').should('exist').should('contain', '1');
      cy.useDateRangeFilter();
      cy.getBySel('applied-filters-count').should('not.exist');
    });

    it.skip('[PF-1099] should toggle filters on filters button click', () => {
      cy.getBySel('filters-form').should('exist').should('be.visible');
      cy.getBySel('filters-btn').should('exist').click();
      cy.getBySel('filters-form').should('not.exist');
      cy.getBySel('filters-btn').should('exist').click();
      cy.getBySel('filters-form').should('exist').should('be.visible');
    });

    it.skip('[PF-1100] should display Clear button if date filter changed', () => {
      cy.getBySel('filter-reset-btn').should('not.exist');
      cy.useDateRangeFilter('custom', '01.05.2023', '31.05.2023');
      cy.getBySel('filter-reset-btn').should('exist');
    });

    it.skip('[PF-1101] should display Clear button if driver filter changed', () => {
      cy.getBySel('filter-reset-btn').should('not.exist');
      cy.useDriverFilter();
      cy.getBySel('filter-reset-btn').should('exist');
    });

    it.skip('[PF-1102] should reset filters to default on Clear button click', () => {
      cy.getBySel('filter-reset-btn').should('not.exist');
      cy.useDriverFilter();
      cy.useDateRangeFilter('custom', '01.05.2023', '31.05.2023');
      cy.getBySel('filter-reset-btn').should('exist').click();
      cy.getBySel('orders-reports-date-filter').should('contain', 'Поточний тиждень');
      cy.getBySel('drivers-control').should('contain', '');
    });

    it.skip('[PF-1103] should not display Clear button if selected filters are the same as default', () => {
      cy.getBySel('filter-reset-btn').should('not.exist');
      cy.useDriverFilter();
      cy.useDateRangeFilter('custom', '01.05.2023', '31.05.2023');
      cy.getBySel('filter-reset-btn').should('exist').click();
      cy.useDateRangeFilter();
      cy.getBySel('filter-reset-btn').should('not.exist');
    });
  });

  describe('Export csv', () => {
    it.skip('[PF-1104] should have export csv button', () => {
      cy.getBySel('export-csv-btn-mobile').should('exist').should('be.visible');
    });

    // TODO: fix pipeline download
    it.skip('[PF-1105] should download csv file on button click', () => {
      cy.getBySel('export-csv-btn-mobile').should('be.visible').click();
      cy.readFile(`${Cypress.config('downloadsFolder')}/Звіт по поїздкам - 00.00.21.08.23 - 23.59.27.08.23.csv`);
    });
  });

  describe('Orders reports list', () => {
    beforeEach(() => cy.useDateRangeFilter('custom', '01.05.2023', '31.05.2023'));

    it.skip('[PF-1106] should display orders reports list', () => {
      cy.getBySel('orders-reports-list').should('exist').should('be.visible');
    });

    it.skip('[PF-1107] should not have header row', () => {
      cy.getBySel('orders-reports-header-row').should('exist').should('not.be.visible');
    });

    it.skip('[PF-1108] should have data row', () => {
      cy.getBySel('orders-reports-row').should('exist').should('be.visible');
    });

    describe('Data row', () => {
      it.skip('[PF-1109] should have driver/signal cell', () => {
        cy.getBySel('driver-cell')
          .should('be.visible')
          .should('contain', 'Aqaafeyh404 Aqadpilu404')
          .should('contain', '500265');

        cy.getBySel('driver-cell')
          .find('a')
          .should('exist')
          .should('have.attr', 'href', '/workspace/drivers/details/1fad966a-b2f4-427b-a0da-4b04be5f871f');
      });

      it.skip('[PF-1110] should have total price cell', () => {
        cy.getBySel('total-price-cell').should('be.visible').should('contain', '₴ 95.00');
      });

      it.skip('[PF-1111] should have expand cell', () => {
        cy.getBySel('expand-cell').should('be.visible');
      });

      it.skip('[PF-1112] should toggle expandable row visibility', () => {
        cy.getBySel('expandable-row').should('not.be.visible');
        cy.getBySel('expand-cell').find('button').click();
        cy.getBySel('expandable-row').should('be.visible');
        cy.getBySel('expand-cell').find('button').click();
        cy.getBySel('expandable-row').should('not.be.visible');
      });
    });

    describe('Expandable row', () => {
      beforeEach(() => {
        cy.getBySel('expandable-row').should('not.be.visible');
        cy.getBySel('expand-cell').find('button').click();
        cy.getBySel('expandable-row').should('be.visible');
      });

      it.skip('[PF-1113] should have total distance cell', () => {
        cy.getBySel('expanded-row-info-mobile')
          .find('li:nth-child(1)')
          .should('be.visible')
          .should('contain', 'Поїздки')
          .should('contain', '1');
      });

      it.skip('[PF-1114] should have total amount cell', () => {
        cy.getBySel('expanded-row-info-mobile')
          .find('li:nth-child(2)')
          .should('be.visible')
          .should('contain', 'Пробіг (під замовленням)')
          .should('contain', '11.00 км');
      });

      it.skip('[PF-1115] should have total amount, additional income and expenses sections', () => {
        cy.getBySel('total-amount-section').should('be.visible');
        cy.getBySel('additional-income-section').should('be.visible');
        cy.getBySel('expenses-section').should('be.visible');
      });

      describe('Total amount section', () => {
        it.skip('[PF-1116] should have title', () => {
          cy.getBySel('total-amount-section-title').should('exist').should('contain', 'Загальна вартість');
        });

        it.skip('[PF-1117] should disaply income source', () => {
          cy.getBySel('total-amount-section')
            .find('li:nth-child(1)')
            .should('exist')
            .should('contain', 'Готівка')
            .should('contain', '₴ 95.00');

          cy.getBySel('total-amount-section')
            .find('li:nth-child(2)')
            .should('exist')
            .should('contain', 'Гаманець')
            .should('contain', '0');

          cy.getBySel('total-amount-section')
            .find('li:nth-child(3)')
            .should('exist')
            .should('contain', 'На карту')
            .should('contain', '0');
        });
      });

      describe('Additional income section', () => {
        it.skip('[PF-1118] should have title', () => {
          cy.getBySel('additional-income-section-title').should('exist').should('contain', 'Додаткові надходження');
        });

        it.skip('[PF-1119] should display additional income info', () => {
          cy.getBySel('additional-income-section')
            .find('li:nth-child(1)')
            .should('exist')
            .should('contain', 'Компенсація')
            .should('contain', '0');

          cy.getBySel('additional-income-section')
            .find('li:nth-child(2)')
            .should('exist')
            .should('contain', 'Чайові')
            .should('contain', '0');
        });
      });

      describe('Expenses section', () => {
        it.skip('[PF-1120] should have title', () => {
          cy.getBySel('expenses-section-title').should('exist').should('contain', 'Витрати');
        });

        it.skip('[PF-1121] should display expenses info', () => {
          cy.getBySel('expenses-section')
            .find('li:nth-child(1)')
            .should('exist')
            .should('contain', 'Штраф')
            .should('contain', '0');

          cy.getBySel('expenses-section')
            .find('li:nth-child(2)')
            .should('exist')
            .should('contain', 'Комісія Uklon')
            .should('contain', '0');
        });
      });
    });
  });
});
