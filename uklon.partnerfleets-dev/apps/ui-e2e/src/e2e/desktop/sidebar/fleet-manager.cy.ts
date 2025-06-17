import { FleetMaintainerDto } from '@data-access';

import { FleetDetailsIntercept } from '../../../support/interceptor/fleet-profile/driver-details';
import { isMockingData } from '../../../support/utils';

const MAINTAINER: FleetMaintainerDto = {
  email: 'main@maintainer.com',
  first_name: 'Maintainer',
  id: 'main_id',
  last_name: 'Main',
  phone: '380500000000',
  telegram_phone: '380500000000',
  viber_phone: '380500000000',
};
const RESERVE_MAINTAINER: FleetMaintainerDto = {
  email: 'reserve@maintainer.com',
  first_name: 'Maintainer',
  id: 'reserve_id',
  last_name: 'Reserve',
  phone: '380501111111',
  telegram_phone: '380501111111',
  viber_phone: '380501111111',
};
const SERVER_DATE = (date: Date): number => Math.round(date.getTime() / 1000);
const GET_VACATION_DAYS = (): { from: Date; to: Date; yesterday: number; tomorrow: number } => {
  const today = new Date();
  const from = new Date(today.setHours(0, 0, 0, 0));
  const to = new Date(today.setHours(23, 59, 59, 0));
  const yesterday = SERVER_DATE(new Date(from.setDate(from.getDate() - 1)));
  const tomorrow = SERVER_DATE(new Date(to.setDate(to.getDate() + 1)));

  return { from, to, yesterday, tomorrow };
};

if (isMockingData()) {
  describe('Fleet manager panel', () => {
    const fleetDetailsIntercept = new FleetDetailsIntercept('*');

    beforeEach(() => {
      fleetDetailsIntercept.apply({ name: 'ok', props: { maintainer: MAINTAINER } });

      cy.clearLocalStorage();
      cy.loginWithSession('fleetManagerPanel');
      cy.visit('workspace/general');
    });

    it('[6962] should display personal manager button if he was added', () => {
      cy.getBySel('fleet-manager-btn').should('be.visible');
    });

    it('[6963] should open manager panel', () => {
      cy.getBySel('fleet-manager-btn').click();
      cy.getBySel('fleet-manager-panel').should('be.visible');
      cy.getBySel('fleet-manager-panel')
        .should('exist')
        .should('contain', `${MAINTAINER.last_name} ${MAINTAINER.first_name}`);
      cy.getBySel('fleet-manager-phone').should('be.visible').should('contain', MAINTAINER.phone);
      cy.getBySel('fleet-manager-telegram-btn').should('be.visible');
      cy.getBySel('fleet-manager-viber-btn').should('not.exist');
      cy.getBySel('fleet-manager-email').should('be.visible').should('contain', MAINTAINER.email);
      cy.getBySel('fleet-manager-workHours')
        .should('be.visible')
        .should('contain', 'Робочі години менеджера: пн - пт 9:00 - 18:00');
    });

    it('[6964] should copy phone number', () => {
      cy.getBySel('fleet-manager-btn').click();
      cy.getBySel('fleet-manager-copy-phone').trigger('mouseenter');
      cy.get('.tippy-content').should('be.visible').should('contain', 'Скопіювати');
      cy.getBySel('fleet-manager-copy-phone').click();
      cy.getBySel('fleet-manager-copy-phone').trigger('mouseenter');
      cy.get('.tippy-content').should('be.visible').should('contain', 'Скопійовано');
    });

    it('[6965] should open telegram app', () => {
      cy.getBySel('fleet-manager-btn').click();
      cy.getBySel('fleet-manager-telegram-btn')
        .should('be.visible')
        .should('have.attr', 'href')
        .should('contain', `tg://resolve?phone=${MAINTAINER.telegram_phone}`);
    });

    it('[6968] should copy email', () => {
      cy.getBySel('fleet-manager-btn').click();
      cy.getBySel('fleet-manager-copy-email').trigger('mouseenter');
      cy.get('.tippy-content').should('be.visible').should('contain', 'Скопіювати');
      cy.getBySel('fleet-manager-copy-email').click();
      cy.getBySel('fleet-manager-copy-email').trigger('mouseenter');
      cy.get('.tippy-content').should('be.visible').should('contain', 'Скопійовано');
    });

    it('[6969] should open email app', () => {
      cy.getBySel('fleet-manager-btn').click();
      cy.getBySel('fleet-manager-email-btn')
        .should('be.visible')
        .should('have.attr', 'href')
        .should('contain', `mailto:${MAINTAINER.email}`);
    });

    it.skip('[6971] Should display reserve maintainer tooltip if main maintainer is on vacation', () => {
      const { to, yesterday, tomorrow } = GET_VACATION_DAYS();
      const expected = `Вам назначено тимчасового менеджера. Ваш персональний менеджер буде доступний з ${to.getDate() + 1}.${to.getMonth() + 1}.${to.getFullYear()}`;

      fleetDetailsIntercept.apply({
        name: 'ok',
        props: {
          maintainer: { ...MAINTAINER, absent_from: yesterday, absent_to: tomorrow },
          reserve_maintainer: RESERVE_MAINTAINER,
        },
      });
      cy.reload();

      cy.getBySel('fleet-manager-btn').click();
      cy.getBySel('fleet-manager-tooltip').should('be.visible').trigger('mouseenter');
      cy.get('.tippy-content').should('be.visible').should('contain', expected);
    });

    it('[6974] should not display messengers', () => {
      fleetDetailsIntercept.apply({
        name: 'ok',
        props: { maintainer: { ...MAINTAINER, telegram_phone: '' } },
      });
      cy.reload();

      cy.getBySel('fleet-manager-btn').click();
      cy.getBySel('fleet-manager-telegram-btn').should('not.exist');
    });

    it('[6975] should not display fleet manager button if main maintainer is on vacation and reserve manager is not added', () => {
      const { yesterday, tomorrow } = GET_VACATION_DAYS();
      fleetDetailsIntercept.apply({
        name: 'ok',
        props: { maintainer: { ...MAINTAINER, absent_from: yesterday, absent_to: tomorrow } },
      });
      cy.reload();

      cy.getBySel('fleet-manager-btn').should('not.exist');
    });
  });
}
