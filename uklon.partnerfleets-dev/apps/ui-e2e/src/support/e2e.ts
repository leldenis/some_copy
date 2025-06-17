import './commands';

import { Locale } from '@data-access';

import { AccountCountry } from '@uklon/types';

import {
  analyticIntercept,
  authIntercept,
  countryPhoneFormatsIntercept,
  dashboardStatisticsIntercept,
  dictionariesIntercept,
  meIntercept,
  topUnreadNotificationsIntercept,
  unreadCountIntercept,
  userCountryIntercept,
} from './interceptor';
import { fleetDetailsIntercept } from './interceptor/fleet-profile/driver-details';
import { isMockingData } from './utils';

beforeEach(() => {
  analyticIntercept.apply({ name: 'ok' });

  cy.intercept('GET', 'api/me/user-country', {
    body: { country: 'UA' },
  });

  cy.intercept('GET', 'api/me', (req) => {
    req.on('response', (res) => {
      res.body.locale = 'Uk';
    });
  });

  if (isMockingData()) {
    authIntercept.apply({ name: 'ok' });

    meIntercept.apply({ name: 'ok', props: { locale: Locale.UK } });

    dictionariesIntercept.apply({ name: 'ok' });

    countryPhoneFormatsIntercept.apply({ name: 'ok' });

    userCountryIntercept.apply({ name: 'ok', props: { country: AccountCountry.Ukraine } });

    unreadCountIntercept.apply({ name: 'ok' });

    dashboardStatisticsIntercept.apply({ name: 'ok' });

    topUnreadNotificationsIntercept.apply({ name: 'ok', props: { event_count: 0 } });

    fleetDetailsIntercept.apply({ name: 'ok' });

    cy.intercept('PUT', 'api/me/update-locale', { statusCode: 200 });

    cy.intercept('GET', 'api/dictionaries/regions', {
      statusCode: 200,
      body: {
        items: [
          {
            country_code: AccountCountry.Ukraine,
            locale_settings: {
              allowed: [Locale.UK, Locale.EN, Locale.UZ],
              default: Locale.UK,
            },
          },
        ],
      },
    });
  }
});
