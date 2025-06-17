import { BlockedListStatusValue } from '@constant';
import { FleetRole, FleetType, WithdrawalType } from '@data-access';

import { MeIntercept } from '../../../support/interceptor';
import { IndividualEntrepreneursIntercept } from '../../../support/interceptor/finance/individual-entrepreneus';
import { FleetDetailsIntercept } from '../../../support/interceptor/fleet-profile/driver-details';
import { fleetHistoryIntercept } from '../../../support/interceptor/fleet-profile/fleet-history';
import { isMockingData } from '../../../support/utils';

if (isMockingData()) {
  describe('Fleet Contacts', () => {
    const fleetId = '*';
    const meData = new MeIntercept();
    const fleetDetailsIntercept = new FleetDetailsIntercept(fleetId);
    const individualEntrepreneurs = new IndividualEntrepreneursIntercept(fleetId, true);

    const usersList = [
      {
        email: 'aqa404@uklon.com',
        first_name: 'Aqa404',
        last_name: 'Aqa404',
        mfa_enabled: false,
        phone: '380669243644',
        role: FleetRole.OWNER,
        status: {
          value: BlockedListStatusValue.ACTIVE,
        },
        user_id: 'f6ab19f5-3f27-4128-8eff-95ef6cc096a1',
      },
      {
        email: 'aqa404new@uklon.com',
        first_name: 'Aqa404new',
        last_name: 'Aqa404new',
        mfa_enabled: false,
        phone: '380662526001',
        role: FleetRole.OWNER,
        status: {
          value: BlockedListStatusValue.ACTIVE,
        },
        user_id: '5a7051c5-25ca-411b-a9cf-cf89b8520d28',
      },
      {
        email: 'aqa404Manager@uklon.com',
        first_name: 'Aqa404Manager',
        last_name: 'Aqa404Manager',
        mfa_enabled: false,
        phone: '380662526002',
        role: FleetRole.MANAGER,
        status: {
          value: BlockedListStatusValue.ACTIVE,
        },
        user_id: 'a3f88d28-6f27-4191-991a-305ab06f2731',
      },
    ];

    describe('When no managers in fleet', () => {
      beforeEach(() => {
        cy.loginWithSession('fleetRROManager');
        meData.apply({
          name: 'ok',
          props: {
            fleets: [
              {
                id: '829492c9-29d5-41df-8e9b-14a407235ce1',
                name: 'AQA404TESTFLEET',
                region_id: 1,
                email: 'aqa404fleet@uklon.com',
                role: FleetRole.OWNER,
                fleet_type: FleetType.COMMERCIAL,
                tin_refused: false,
                is_fiscalization_enabled: false,
              },
            ],
          },
        });
        fleetDetailsIntercept.apply({
          name: 'ok',
          props: { is_fiscalization_enabled: false, users: usersList.slice(0, 2) },
        });
        individualEntrepreneurs.apply({ name: 'ok', props: { withdrawal_type: WithdrawalType.PAYMENT_CARD } });

        cy.visit('workspace/fleet-profile#contacts');
      });

      it('[7860] should display empty state', () => {
        cy.getBySel('no-data').should('be.visible');
      });

      it('[7858] should display owner card', () => {
        cy.getBySel('owners-cards-container').within(() => {
          cy.getBySel('card-f6ab19f5-3f27-4128-8eff-95ef6cc096a1').should('be.visible');
        });
      });

      it('[7858] should display owner`s name on card', () => {
        cy.getBySel('card-name-f6ab19f5-3f27-4128-8eff-95ef6cc096a1')
          .should('be.visible')
          .contains('Aqa404 Aqa404 (я)');
      });

      it('[7858] should display another owner`s name on card', () => {
        cy.getBySel('card-name-5a7051c5-25ca-411b-a9cf-cf89b8520d28')
          .should('be.visible')
          .contains('Aqa404new Aqa404new');
      });

      it('[7858] should display owner`s phone on card', () => {
        cy.getBySel('card-phone-f6ab19f5-3f27-4128-8eff-95ef6cc096a1').should('be.visible').contains('380669243644');
      });

      it('[7858] should display owner`s email on card', () => {
        cy.getBySel('card-email-f6ab19f5-3f27-4128-8eff-95ef6cc096a1')
          .should('be.visible')
          .contains('aqa404@uklon.com');
      });
    });

    describe('When there is manager in fleet', () => {
      beforeEach(() => {
        cy.loginWithSession('fleetRROManager');
        meData.apply({
          name: 'ok',
          props: {
            fleets: [
              {
                id: '829492c9-29d5-41df-8e9b-14a407235ce1',
                name: 'AQA404TESTFLEET',
                region_id: 1,
                email: 'aqa404fleet@uklon.com',
                role: FleetRole.OWNER,
                fleet_type: FleetType.COMMERCIAL,
                tin_refused: false,
                is_fiscalization_enabled: false,
              },
            ],
          },
        });
        fleetDetailsIntercept.apply({
          name: 'ok',
          props: { is_fiscalization_enabled: false, users: usersList },
        });
        individualEntrepreneurs.apply({ name: 'ok', props: { withdrawal_type: WithdrawalType.PAYMENT_CARD } });
        fleetHistoryIntercept.apply({ name: 'ok' });

        cy.visit('workspace/fleet-profile#contacts');
      });

      it('[7858] should display manager`s card', () => {
        cy.getBySel('managers-cards-container').within(() => {
          cy.getBySel('card-a3f88d28-6f27-4191-991a-305ab06f2731').should('be.visible');
        });
      });

      it('[7858] should display manager`s name on card', () => {
        cy.getBySel('card-name-a3f88d28-6f27-4191-991a-305ab06f2731')
          .should('be.visible')
          .contains('Aqa404Manager Aqa404Manager');
      });

      it('[7858] should display manager`s phone on card', () => {
        cy.getBySel('card-phone-a3f88d28-6f27-4191-991a-305ab06f2731').should('be.visible').contains('380662526002');
      });

      it('[7858] should display manager`s email on card', () => {
        cy.getBySel('card-email-a3f88d28-6f27-4191-991a-305ab06f2731')
          .should('be.visible')
          .contains('aqa404Manager@uklon.com');
      });
    });
  });
}
