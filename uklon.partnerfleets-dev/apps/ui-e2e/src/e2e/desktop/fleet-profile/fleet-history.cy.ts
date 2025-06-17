import {
  FleetHistoryChangeItemDto,
  FleetHistoryType,
  FleetRole,
  FleetType,
  HistoryInitiatorType,
  WithdrawalType,
} from '@data-access';

import { MeIntercept } from '../../../support/interceptor';
import { IndividualEntrepreneursIntercept } from '../../../support/interceptor/finance/individual-entrepreneus';
import { FleetDetailsIntercept } from '../../../support/interceptor/fleet-profile/driver-details';
import { FleetHistoryIntercept } from '../../../support/interceptor/fleet-profile/fleet-history';
import { FleetHistoryDetailsIntercept } from '../../../support/interceptor/fleet-profile/fleet-history-details';
import { AccountKind, getAccountByKind, isMockingData } from '../../../support/utils';

const fleetId = '*';
const meData = new MeIntercept();
const individualEntrepreneurs = new IndividualEntrepreneursIntercept(fleetId, true);
const fleetDetailsIntercept = new FleetDetailsIntercept(fleetId);
const fleetHistoryIntercept = new FleetHistoryIntercept(fleetId);
const fleetHistoryDetailIntercept = new FleetHistoryDetailsIntercept(fleetId, FleetHistoryType.DRIVER_REMOVED);

const historyItems: FleetHistoryChangeItemDto[] = [
  {
    id: '5e2e26e5-30a9-45b7-9521-3112e5c21970',
    change_type: FleetHistoryType.DRIVER_REMOVED,
    occurred_at: 1_721_725_400,
    initiator: {
      display_name: 'System',
      type: HistoryInitiatorType.SYSTEM,
      account_id: '5e2e26e5-30a9-45b7-9521-3112e5c21970',
    },
    has_additional_data: true,
  },
  {
    id: 'a9ac8291-cf93-465f-84a3-912687200082',
    change_type: FleetHistoryType.MANAGER_ADDED,
    occurred_at: 1_721_725_314,
    initiator: {
      display_name: 'System',
      type: HistoryInitiatorType.SYSTEM,
      account_id: '5e2e26e5-30a9-45b7-9521-3112e5c21970',
    },
    has_additional_data: true,
  },
];

const b2bHistoryItems: FleetHistoryChangeItemDto[] = [
  {
    id: 'ce2b0067-e700-4de7-9b5f-74b7a73a8756',
    change_type: FleetHistoryType.B2B_SPLIT_DISTRIBUTION_CHANGED,
    occurred_at: 1_749_635_363,
    initiator: {
      display_name: 'Менеджер Уклон',
      type: HistoryInitiatorType.UKLON_MANAGER,
      account_id: '3a0f7220-97f0-45e7-9f01-6d0aa2320bae',
    },
    has_additional_data: true,
  },
];

const b2bHistoryDetails: FleetHistoryChangeItemDto = {
  id: 'ce2b0067-e700-4de7-9b5f-74b7a73a8756',
  change_type: FleetHistoryType.B2B_SPLIT_DISTRIBUTION_CHANGED,
  occurred_at: 1_749_635_363,
  initiator: {
    display_name: 'Менеджер Уклон',
    type: HistoryInitiatorType.SYSTEM,
    account_id: '3a0f7220-97f0-45e7-9f01-6d0aa2320bae',
  },
  has_additional_data: true,
  details: {
    old_value: 'BalanceDependent',
    current_value: 'BalanceDependent',
    old_split_distribution_strategy: {
      wallet_balance_greater_or_equal: {
        amount_cent: 100_030,
        partner_percentage: 3,
        uklon_percentage: 97,
      },
      wallet_balance_less_or_equal: {
        amount_cent: 50_000,
        partner_percentage: 90,
        uklon_percentage: 10,
      },
    },
    current_split_distribution_strategy: {
      wallet_balance_greater_or_equal: {
        amount_cent: 100_015,
        partner_percentage: 92,
        uklon_percentage: 8,
      },
      wallet_balance_less_or_equal: {
        amount_cent: 50_020,
        partner_percentage: 90,
        uklon_percentage: 10,
      },
    },
  },
};

describe('Fleet History', () => {
  beforeEach(() => {
    if (isMockingData()) {
      meData
        .apply({
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
                is_fiscalization_enabled: true,
              },
            ],
          },
        })
        .as('getMe');
      individualEntrepreneurs.apply({
        name: 'ok',
        props: { withdrawal_type: WithdrawalType.PAYMENT_CARD, entrepreneur: [] },
      });
      fleetDetailsIntercept.apply({ name: 'ok' });
      fleetHistoryIntercept.apply({ name: 'ok', props: { items: historyItems } });
      fleetHistoryDetailIntercept.apply({ name: 'ok' });
    }
    const notificationFleetAccount = getAccountByKind(AccountKind.NOTIFICATION_OWNER);
    cy.loginWithSession('fleetWallet', notificationFleetAccount.username, notificationFleetAccount.password);
    cy.visit('/workspace/fleet-profile');
  });

  it('[5498] history should display', () => {
    cy.getBySel('fleet-history-list').should('exist');
  });

  it('[5499] should be filtered', () => {
    cy.getBySel('history-select').click();
    cy.getBySel('history-select-item-ManagerAdded').click();
    cy.getBySel('history-event-panel-ManagerAdded-1').should('exist');
  });

  it('[5500] should open details', () => {
    cy.get('[data-cy*="cell-DriverRemoved-"]').eq(0).click();
    cy.getBySel('history-additional-info').should('exist');
  });

  if (isMockingData()) {
    describe('[8304] B2B split balance distribution', () => {
      beforeEach(() => {
        fleetHistoryIntercept.apply({ name: 'ok', props: { items: b2bHistoryItems } });
        const fleetHistoryDetailB2BIntercept = new FleetHistoryDetailsIntercept(
          fleetId,
          FleetHistoryType.B2B_SPLIT_DISTRIBUTION_CHANGED,
        );
        fleetHistoryDetailB2BIntercept.apply({ name: 'ok', props: { item: b2bHistoryDetails } });
        cy.reload();
      });

      it('should filtered by B2BSplitDistributionChanged type and display row content', () => {
        cy.getBySel('history-select').click();
        cy.getBySel('history-select-item-B2BSplitDistributionChanged').click();
        cy.getBySel('cell-B2BSplitDistributionChanged-0').should('contain.text', 'Зміна методу сплітування');
        cy.getBySel('cell-role-0').should('contain.text', 'Менеджер Уклон');
        cy.getBySel('cell-date-0').should('contain.text', '11.06.2025');
        cy.getBySel('cell-time-0').should('contain.text', '09:49');
        cy.getBySel('cell-toggle-0').should('be.visible');
      });

      it('should display additional data about old b2b split balance', () => {
        cy.getBySel('cell-toggle-0').should('be.visible').click();
        cy.getBySel('history-additional-info').should('exist');
        cy.getBySel('old-value-title').should('contain.text', 'Було');
        cy.getBySel('b2b-split-type-old-value').should('contain.text', 'Згідно зі значенням балансу');
        cy.getBySel('b2b-split-balance-greater-old').should('exist');

        cy.getBySel('b2b-split-balance-amount-title').should('contain.text', 'Баланс, більше ніж:');
        cy.getBySel('b2b-split-balance-amount-value').should('contain.text', '1 000.30');
        cy.getBySel('b2b-split-distribution-uklon-percentage-title').should('contain.text', 'Відсоток на Uklon:');
        cy.getBySel('b2b-split-distribution-uklon-percentage-value').should('contain.text', '97%');
        cy.getBySel('b2b-split-distribution-partner-percentage-title').should('contain.text', 'Відсоток на парк:');
        cy.getBySel('b2b-split-distribution-partner-percentage-value').should('contain.text', '3%');

        cy.getBySel('b2b-split-balance-less-old').should('exist');
        cy.getBySel('b2b-split-balance-amount-title').should('contain.text', 'Баланс, менше ніж:');
        cy.getBySel('b2b-split-balance-amount-value').should('contain.text', '500.00');
        cy.getBySel('b2b-split-distribution-uklon-percentage-title').should('contain.text', 'Відсоток на Uklon:');
        cy.getBySel('b2b-split-distribution-uklon-percentage-value').should('contain.text', '10%');
        cy.getBySel('b2b-split-distribution-partner-percentage-title').should('contain.text', 'Відсоток на парк:');
        cy.getBySel('b2b-split-distribution-partner-percentage-value').should('contain.text', '90%');
      });

      it('should display additional data about current b2b split balance', () => {
        cy.getBySel('cell-toggle-0').should('be.visible').click();
        cy.getBySel('history-additional-info').should('exist');
        cy.getBySel('current-value-title').should('contain.text', 'Стало');
        cy.getBySel('b2b-split-type-current-value').should('contain.text', 'Згідно зі значенням балансу');
        cy.getBySel('b2b-split-balance-less-old').should('exist');

        cy.getBySel('b2b-split-balance-amount-title').should('contain.text', 'Баланс, більше ніж:');
        cy.getBySel('b2b-split-balance-amount-value').should('contain.text', '1 000.15');
        cy.getBySel('b2b-split-distribution-uklon-percentage-title').should('contain.text', 'Відсоток на Uklon:');
        cy.getBySel('b2b-split-distribution-uklon-percentage-value').should('contain.text', '8%');
        cy.getBySel('b2b-split-distribution-partner-percentage-title').should('contain.text', 'Відсоток на парк:');
        cy.getBySel('b2b-split-distribution-partner-percentage-value').should('contain.text', '92%');

        cy.getBySel('b2b-split-balance-less-current').should('exist');
        cy.getBySel('b2b-split-balance-amount-title').should('contain.text', 'Баланс, менше ніж:');
        cy.getBySel('b2b-split-balance-amount-value').should('contain.text', '500.20');
        cy.getBySel('b2b-split-distribution-uklon-percentage-title').should('contain.text', 'Відсоток на Uklon:');
        cy.getBySel('b2b-split-distribution-uklon-percentage-value').should('contain.text', '10%');
        cy.getBySel('b2b-split-distribution-partner-percentage-title').should('contain.text', 'Відсоток на парк:');
        cy.getBySel('b2b-split-distribution-partner-percentage-value').should('contain.text', '90%');
      });
    });
  }
});
