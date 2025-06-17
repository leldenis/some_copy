describe('Drivers feedbacks', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.loginWithSession('driversFeedbacks');
    cy.visit('workspace/feedbacks');
    cy.getBySel('filters-btn').should('exist').click();
  });

  it.skip('[PF-1252] should display empty state', () => {
    cy.useDateRangeFilter('custom', '22.08.2023', '23.08.2023');
    cy.getBySel('no-data').should('exist').should('be.visible');
  });

  describe('Orders reports filters', () => {
    it.skip('[PF-1253] should have date and drivers filters', () => {
      cy.getBySel('date-range-control').should('exist');
      cy.getBySel('drivers-control').should('exist');
    });

    it.skip('[PF-1254] should have default filters values', () => {
      cy.getBySel('date-range-control').should('contain', 'Поточний тиждень');
      cy.getBySel('drivers-control').should('contain', '');
    });

    it.skip('[PF-1255] should display applied filters count', () => {
      cy.getBySel('applied-filters-count').should('not.exist');
      cy.useDateRangeFilter('today');
      cy.getBySel('applied-filters-count').should('exist').should('contain', '1');
      cy.useDriverFilter();
      cy.getBySel('applied-filters-count').should('exist').should('contain', '2');
      cy.useDriverFilter(null, 'all');
      cy.getBySel('applied-filters-count').should('exist').should('contain', '1');
      cy.useDateRangeFilter();
      cy.getBySel('applied-filters-count').should('not.exist');
    });

    it.skip('[PF-1256] should toggle filters on filters button click', () => {
      cy.getBySel('filters-form').should('exist').should('be.visible');
      cy.getBySel('filters-btn').should('exist').click();
      cy.getBySel('filters-form').should('not.exist');
      cy.getBySel('filters-btn').should('exist').click();
      cy.getBySel('filters-form').should('exist').should('be.visible');
    });

    it.skip('[PF-1257] should display Clear button if date filter changed', () => {
      cy.getBySel('filter-reset-btn').should('not.exist');
      cy.useDateRangeFilter('today');
      cy.getBySel('filter-reset-btn').should('exist');
    });

    it.skip('[PF-1258] should display Clear button if driver filter changed', () => {
      cy.getBySel('filter-reset-btn').should('not.exist');
      cy.useDriverFilter();
      cy.getBySel('filter-reset-btn').should('exist');
    });

    it.skip('[PF-1259] should reset filters to default on Clear button click', () => {
      cy.getBySel('filter-reset-btn').should('not.exist');
      cy.useDriverFilter();
      cy.useDateRangeFilter('today');
      cy.getBySel('filter-reset-btn').should('exist').click();
      cy.getBySel('date-range-control').should('contain', 'Поточний тиждень');
      cy.getBySel('drivers-control').should('contain', '');
    });

    it.skip('[PF-1260] should not display Clear button if selected filters are the same as default', () => {
      cy.getBySel('filter-reset-btn').should('not.exist');
      cy.useDriverFilter();
      cy.useDateRangeFilter('today');
      cy.getBySel('filter-reset-btn').should('exist').click();
      cy.useDateRangeFilter();
      cy.getBySel('filter-reset-btn').should('not.exist');
    });
  });

  describe('Feedbacks list', () => {
    beforeEach(() => cy.useDateRangeFilter('custom', '01.08.2023', '20.08.2023'));

    it.skip('[PF-1261] should display feedbacks list', () => {
      cy.getBySel('drivers-feedbacks-list').should('exist').should('be.visible');
    });

    it.skip('[PF-1262] should not have header row', () => {
      cy.getBySel('drivers-feedbacks-header-row').should('not.exist');
    });

    it.skip('[PF-1263] should have data row', () => {
      cy.getBySel('drivers-feedbacks-row').should('exist').should('be.visible');
    });

    describe('Data row', () => {
      it.skip('[PF-1264] should have date/time cell', () => {
        cy.getBySel('date-time-cell')
          .eq(0)
          .should('be.visible')
          .should('contain', '17.08.2023')
          .should('contain', '12:45');
      });

      it.skip('[PF-1265] should have driver cell', () => {
        cy.getBySel('driver-cell')
          .eq(0)
          .find('a')
          .should('exist')
          .should('have.attr', 'href', '/workspace/drivers/details/1fad966a-b2f4-427b-a0da-4b04be5f871f');
      });

      it.skip('[PF-1266] should have rating cell', () => {
        cy.getBySel('rating-cell').eq(0).should('be.visible').should('contain', '5');
        cy.get('.mark-icon').eq(0).should('be.visible').should('contain', 'grade');
      });

      it.skip('[PF-1267] should have expand cell', () => {
        cy.getBySel('expand-cell').eq(0).should('be.visible');
      });

      it.skip('[PF-1268] should toggle expandable row visibility', () => {
        cy.getBySel('expandable-row').eq(0).should('not.be.visible');
        cy.getBySel('expand-cell').eq(0).click();
        cy.getBySel('expandable-row').eq(0).should('be.visible');
        cy.getBySel('expand-cell').eq(0).click();
        cy.getBySel('expandable-row').eq(0).should('not.be.visible');
      });
    });

    describe('Expandable row', () => {
      beforeEach(() => {
        cy.getBySel('expandable-row').eq(0).should('not.be.visible');
        cy.getBySel('expand-cell').eq(0).click();
        cy.getBySel('expandable-row').eq(0).should('be.visible');
      });

      it.skip('[PF-1269] should have feedback and coment sections', () => {
        cy.getBySel('feedback-section').should('be.visible');
        cy.getBySel('comment-section').should('be.visible');
      });

      describe('Feedback section', () => {
        it.skip('[PF-1270] should disaply feedback info', () => {
          cy.getBySel('feedback-section').find(':nth-child(1)').should('exist').should('contain', 'Шаблонний відгук');
          cy.getBySel('feedback-section').find(':nth-child(2)').should('exist').should('contain', 'Хороше авто');
        });
      });

      describe('Feedback section', () => {
        it.skip('[PF-1271] should disaply comment info', () => {
          cy.getBySel('comment-section')
            .find(':nth-child(1)')
            .should('exist')
            .should('contain', 'Індивідуальний відгук');
          cy.getBySel('comment-section').find(':nth-child(2)').should('exist').should('contain', '-');
        });
      });
    });
  });
});
