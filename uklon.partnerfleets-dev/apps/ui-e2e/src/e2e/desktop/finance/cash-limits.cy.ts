import {
  BlockedListStatusValue,
  DriverPhotoControlCreatingReason,
  DriverStatus,
  KarmaGroup,
  Restriction,
  RestrictionReason,
  TicketStatus,
} from '@constant';
import {
  CashLimitsSettingsPeriod,
  CashLimitType,
  FleetDriversItemDto,
  FleetRole,
  FleetType,
  WithdrawalType,
} from '@data-access';

import { Currency } from '@uklon/types';

import { MeIntercept } from '../../../support/interceptor';
import { FleetDriverListIntercept } from '../../../support/interceptor/drivers';
import { CashLimitsSettingsIntercept } from '../../../support/interceptor/finance/cash-limits';
import { FleetWalletIntercept } from '../../../support/interceptor/finance/fleet-wallet';
import { IndividualEntrepreneursIntercept } from '../../../support/interceptor/finance/individual-entrepreneus';
import { FleetPaymentCardIntercept } from '../../../support/interceptor/finance/payment-card';
import { WithdrawToCardSettingsIncept } from '../../../support/interceptor/finance/withdraw-to-card-settings';
import { isMockingData } from '../../../support/utils';

const MANAGER_ROLE = [
  {
    id: '829492c9-29d5-41df-8e9b-14a407235ce1',
    name: 'AQA404TESTFLEET',
    region_id: 26,
    role: FleetRole.MANAGER,
    fleet_type: FleetType.COMMERCIAL,
    tin_refused: false,
    is_fiscalization_enabled: false,
    wallet_transfers_allowed: true,
    email: 'aqa404fleet@uklon.com',
  },
];
const DRIVER = ({
  firstName,
  lastName,
  limitAmount,
  usedAmount,
  limitType,
  id,
}: {
  firstName?: string;
  lastName?: string;
  limitAmount?: number;
  usedAmount?: number;
  limitType?: CashLimitType;
  id?: string;
} = {}): FleetDriversItemDto => ({
  id: id ?? 'test-id',
  block_status: {
    value: BlockedListStatusValue.ACTIVE,
  },
  first_name: firstName ?? 'Hello',
  last_name: lastName ?? 'World',
  phone: '576016567751',
  signal: 500_273,
  rating: 500,
  karma: {
    group: KarmaGroup.FIRST_PRIORITY,
    value: 100,
  },
  status: DriverStatus.WORKING,
  photo_control: {
    ticket_id: 'adbc420f-af9c-4ddc-8cf3-1aefe0c2d251',
    deadline_to_send: 1_735_793_865,
    block_immediately: false,
    status: TicketStatus.DRAFT,
    reasons: [DriverPhotoControlCreatingReason.DOCUMENTS_ACTUALIZATION],
    reason_comment: 'some photo missed',
  },
  cash_limit: {
    limit: { amount: limitAmount ?? 0, currency: Currency.UAH },
    used_amount: { amount: usedAmount ?? 50_000, currency: Currency.UAH },
    type: limitType ?? CashLimitType.FLEET,
  },
});
const DRIVERS_COUNT = 4;
const FLEET_ID = '*';

if (isMockingData()) {
  describe('Cash limits', () => {
    const cashLimitsSettings = new CashLimitsSettingsIntercept(FLEET_ID);
    const meData = new MeIntercept();
    const fleetPaymentCard = new FleetPaymentCardIntercept(FLEET_ID);
    const individualEntrepreneurs = new IndividualEntrepreneursIntercept(FLEET_ID, true);
    const fleetWallet = new FleetWalletIntercept(FLEET_ID);
    const driversIntercept = new FleetDriverListIntercept(FLEET_ID);
    const withdrawIntercept = new WithdrawToCardSettingsIncept(FLEET_ID);

    beforeEach(() => {
      cashLimitsSettings.apply({ name: 'ok' });
      fleetPaymentCard.apply({ name: 'ok' });
      fleetWallet.apply({ name: 'ok' });
      withdrawIntercept.apply({ name: 'ok' });
      individualEntrepreneurs.apply({
        name: 'ok',
        props: { withdrawal_type: WithdrawalType.INDIVIDUAL_ENTREPRENEUR, entrepreneur_count: 1 },
      });
      driversIntercept.apply({ name: 'ok', props: { count: DRIVERS_COUNT } });
      cy.intercept('/api/fleets/*/finance/wallet-transactions?date_from=*&date_to=*&offset=*&limit=*', {
        statusCode: 200,
      });
      cy.intercept('GET', 'api/fleets/*/drivers-by-cash-limit', { body: { items: [] }, statusCode: 200 });

      cy.clearLocalStorage();
      cy.loginWithSession('cashLimits');
      cy.setLocalStorage('cashLimitsDialog', JSON.stringify({ [MANAGER_ROLE[0].id]: true }));
      cy.visit('/workspace/finance#cash-limits');
    });

    describe('Cash limits tab access', () => {
      it('[7852] should display cash limits tab', () => {
        cy.getBySel('finance-tabs-cash-limits')
          .should('exist')
          .should('be.visible')
          .should('contain.text', 'Готівкові ліміти');
      });

      it('should display tab for Manager role', () => {
        meData.apply({ name: 'ok', props: { fleets: MANAGER_ROLE } });
        cy.reload();
        cy.getBySel('finance-tabs-cash-limits')
          .should('exist')
          .should('be.visible')
          .should('contain.text', 'Готівкові ліміти');
      });

      it('should open settings dialog on first tab visit', () => {
        cy.setLocalStorage('cashLimitsDialog', JSON.stringify({ [MANAGER_ROLE[0].id]: false }));
        cashLimitsSettings.apply({ name: 'ok', props: { noSettings: true } });
        cy.reload();
        cy.getBySel('cash-limits-settings-dialog').should('exist');
      });

      it('should not open dialog if settings are already applied', () => {
        cy.getBySel('cash-limits-settings-dialog').should('not.exist');
      });
    });

    describe('Fleet cash limits settings dialog', () => {
      it('should display empty state if there are no settings', () => {
        cashLimitsSettings.apply({ name: 'ok', props: { noSettings: true } });
        cy.reload();
        cy.getBySel('no-data').should('exist');
        cy.getBySel('cash-limits-setup-btn').should('exist');
      });

      it('[7855] should save limits without amount settings', () => {
        cashLimitsSettings.apply({ name: 'ok', props: { noSettings: true } });
        cy.intercept('PUT', 'api/fleets/*/finance/cash-limits').as('saveSettings');

        cy.reload();
        cy.getBySel('cash-limits-panel').should('not.exist');
        cy.getBySel('cash-limits-setup-btn').should('exist').click();
        cy.getBySel('cash-limits-settings-dialog').should('exist');
        cy.getBySel('cash-limits-dialog-amount-input').should('not.exist');
        cy.getBySel('cash-limits-dialog-limit-radio-true').should('exist').click();
        cy.getBySel('cash-limits-dialog-save-btn').should('have.attr', 'disabled');
        cy.getBySel('cash-limits-dialog-limit-radio-false').should('exist').click();
        cy.getBySel('cash-limits-dialog-save-btn').should('not.have.attr', 'disabled');
        cy.getBySel('cash-limits-dialog-save-btn').click();

        cy.wait('@saveSettings').then(({ request }) => {
          expect(request.body.amount).to.eq(null);
          expect(request.body.period).to.eql(CashLimitsSettingsPeriod.WEEK);
          expect(request.body.enabled).to.eql(false);

          cy.getBySel('cash-limits-panel').should('exist');
        });
      });

      it('[7856] should save limits with amount settings', () => {
        cashLimitsSettings.apply({ name: 'ok', props: { noSettings: true } });
        cy.intercept('PUT', 'api/fleets/*/finance/cash-limits').as('saveSettings');

        cy.reload();
        cy.getBySel('cash-limits-panel').should('not.exist');
        cy.getBySel('cash-limits-setup-btn').should('exist').click();
        cy.getBySel('cash-limits-settings-dialog').should('exist');
        cy.getBySel('cash-limits-dialog-amount-input').should('not.exist');
        cy.getBySel('cash-limits-dialog-limit-radio-true').should('exist').click();
        cy.getBySel('cash-limits-dialog-save-btn').should('have.attr', 'disabled');
        cy.getBySel('cash-limits-dialog-amount-input').should('exist').type('100');
        cy.getBySel('cash-limits-dialog-save-btn').should('not.have.attr', 'disabled');
        cy.getBySel('cash-limits-dialog-save-btn').click();

        cy.wait('@saveSettings').then(({ request }) => {
          expect(request.body.amount).to.eql(10_000);
          expect(request.body.period).to.eql(CashLimitsSettingsPeriod.WEEK);
          expect(request.body.enabled).to.eql(true);

          cy.getBySel('cash-limits-panel').should('exist');
        });
      });

      it('[7857, 7974] should display error if save failed', () => {
        cy.intercept('PUT', 'api/fleets/*/finance/cash-limits', { statusCode: 400 }).as('error');

        cy.getBySel('cash-limits-panel-edit-btn').should('exist').click();
        cy.getBySel('cash-limits-dialog-save-btn').click();
        cy.wait('@error').then(() => {
          cy.get('.toast.error')
            .should('exist')
            .should('contain.text', 'Щось пішло не так, спробуйте будь-ласка пізніше');
        });
      });

      it('[7972] should set limit type to no limits', () => {
        const drivers = [
          DRIVER({ id: '1', lastName: '1', usedAmount: 20_000, limitType: CashLimitType.FLEET }),
          DRIVER({ id: '2', lastName: '2', usedAmount: 20_000, limitType: CashLimitType.INDIVIDUAL }),
          DRIVER({ id: '3', lastName: '3', usedAmount: 20_000, limitType: CashLimitType.NO_LIMITS }),
        ];
        const blockedDrivers = drivers.slice(0, 2);

        cashLimitsSettings.apply({ name: 'ok', props: { enabled: true } });
        driversIntercept.apply({ name: 'ok', props: { drivers, total_count: drivers.length } }).as('getDrivers');
        cy.intercept('GET', 'api/fleets/*/drivers-by-cash-limit?*', {
          body: { items: blockedDrivers },
          statusCode: 200,
        });

        cy.wait('@getDrivers').then(() => {
          cy.getBySel('cash-limits-panel-edit-btn').should('exist').click();
          cy.getBySel('cash-limits-settings-dialog').should('exist');
          cy.getBySel('cash-limits-dialog-title').should('contain', 'Налаштування роботи розділу');
          cy.getBySel('cash-limits-dialog-limit-radio-true').should('exist').click();
          cy.getBySel('cash-limits-dialog-amount-input').type('300');
          cy.getBySel('cash-limits-dialog-save-btn').click();

          cy.getBySel('cash-limits-dialog-title').should('contain', 'Зберегти нові налаштування?');
          cy.getBySel('cash-limits-dialog-driver-chip').should('exist').should('have.length', blockedDrivers.length);

          blockedDrivers.forEach(({ first_name, last_name }, index) => {
            cy.getBySel('cash-limits-dialog-driver-chip').eq(index).should('contain', `${last_name} ${first_name}`);
          });

          cy.getBySel('cash-limits-dialog-close').click();
          cy.getBySel('cash-limits-dialog-title').should('contain', 'Налаштування роботи розділу');
          cy.getBySel('cash-limits-dialog-save-btn').click();
          cy.getBySel('cash-limits-dialog-save-btn').click(); // click for confirmation
          cy.getBySel('cash-limits-settings-dialog').should('not.exist');
        });
      });
    });

    describe('Cash limits info dialog', () => {
      it('[7917] should open info dialog', () => {
        cy.getBySel('cash-limits-info-dialog-trigger-desktop').should('exist').should('be.visible').click();
        cy.getBySel('cash-limits-info-dialog').should('exist');
        cy.get('body').click(0, 0);

        cy.getBySel('cash-limits-info-dialog-trigger-desktop').click();
        cy.getBySel('cash-limits-info-dialog-header-close-btn').should('exist').should('be.visible').click();
        cy.getBySel('cash-limits-info-dialog').should('not.exist');

        cy.getBySel('cash-limits-info-dialog-trigger-desktop').click();
        cy.getBySel('cash-limits-info-dialog-close-btn').should('exist').should('be.visible').click();
        cy.getBySel('cash-limits-info-dialog').should('not.exist');
      });

      it('should open accordion panels', () => {
        const layout = [
          [0, 0],
          [0, 1],
          [0, 2],
          [1, 0],
          [1, 1],
        ];
        cy.getBySel('cash-limits-info-dialog-trigger-desktop').click();
        cy.getBySel('cash-limits-info-dialog-panel-0-0').should('have.class', 'mat-expanded');

        layout.forEach(([section, article]) => {
          cy.getBySel(`cash-limits-info-dialog-panel-${section}-${article}`).should('exist').click();
          cy.getBySel(`cash-limits-info-dialog-panel-${section}-${article}`).should('have.class', 'mat-expanded');
        });
      });
    });

    describe('Cash limits drivers list', () => {
      it('[7966] should display drivers list', () => {
        const cashLimit = {
          limit: { amount: 500_000, currency: Currency.UAH },
          used_amount: { amount: 50_000, currency: Currency.UAH },
          type: CashLimitType.FLEET,
        };

        cy.getBySel('cash-limits-list').should('exist').should('be.visible');
        cy.getBySel('cash-limit-list-row').should('have.length', 4);

        driversIntercept.apply({ name: 'ok', props: { count: 1, cash_limit: cashLimit } });
        cy.reload();
        cy.getBySel('cash-limit-list-limit-amount').should('exist').should('contain', '₴ 5 000.00');
        cy.getBySel('cash-limit-list-used-amount').should('exist').should('contain', '₴ 500.00');
        cy.getBySel('cash-limit-list-limit-type').should('exist').should('contain', 'Ліміт парку');

        driversIntercept.apply({
          name: 'ok',
          props: { count: 1, cash_limit: { ...cashLimit, used_amount: { amount: 100_000, currency: Currency.UAH } } },
        });
        cy.reload();
        cy.getBySel('cash-limit-list-limit-amount').should('exist').should('contain', '₴ 5 000.00');
        cy.getBySel('cash-limit-list-used-amount').should('exist').should('contain', '₴ 1 000.00');
        cy.getBySel('cash-limit-list-limit-type').should('exist').should('contain', 'Ліміт парку');

        driversIntercept.apply({
          name: 'ok',
          props: {
            count: 1,
            cash_limit: {
              limit: { amount: 130_000, currency: Currency.UAH },
              used_amount: { amount: 80_000, currency: Currency.UAH },
              type: CashLimitType.INDIVIDUAL,
            },
          },
        });
        cy.reload();
        cy.getBySel('cash-limit-list-limit-amount').should('exist').should('contain', '₴ 1 300.00');
        cy.getBySel('cash-limit-list-used-amount').should('exist').should('contain', '₴ 800.00');
        cy.getBySel('cash-limit-list-limit-type').should('exist').should('contain', 'Індивідуальний');

        driversIntercept.apply({
          name: 'ok',
          props: {
            count: 1,
            cash_limit: {
              limit: { amount: 30_000, currency: Currency.UAH },
              used_amount: { amount: 0, currency: Currency.UAH },
              type: CashLimitType.NO_LIMITS,
            },
          },
        });
        cy.reload();
        cy.getBySel('cash-limit-list-no-limit').should('exist').should('contain', 'Немає');
        cy.getBySel('cash-limit-list-used-amount').should('exist').should('contain', '₴ 0.00');
        cy.getBySel('cash-limit-list-limit-type').should('exist').should('contain', 'Немає');
      });

      it('should display empty state if no drivers are available', () => {
        driversIntercept.apply({ name: 'ok', props: { count: 0 } });

        cy.reload();
        cy.getBySel('cash-limits-list').should('not.exist');
        cy.getBySel('no-data').should('exist').should('be.visible');
      });

      it('should highlight used limit if its driver has cash limit restriction in current fleet', () => {
        driversIntercept.apply({
          name: 'ok',
          props: {
            count: 1,
            cash_limit: {
              used_amount: { amount: 200, currency: Currency.UAH },
              limit: { amount: 100, currency: Currency.UAH },
              type: CashLimitType.FLEET,
            },
            restrictions: [
              {
                restricted_by: RestrictionReason.CASH_LIMIT,
                restriction_items: [
                  { fleet_id: JSON.parse(window.localStorage.getItem('selectedFleetId')), type: Restriction.CASH },
                ],
              },
            ],
          },
        });
        cy.reload();

        cy.getBySel('cash-limit-list-used-amount').should('exist').should('contain', '₴ 2.00');
        cy.getBySel('cash-limit-list-used-amount').should('have.css', 'color', 'rgb(233, 114, 114)');
        cy.getBySel('cash-limit-list-used-amount-tooltip').should('exist').trigger('mouseenter');
        cy.get('.tippy-content')
          .should('be.visible')
          .should('contain', 'Водій досяг ліміту готівки, йому заблокована можливість брати готівкові замовлення');
      });

      it('[8106] should not highlight used limit if restriction is applied in another fleet', () => {
        driversIntercept.apply({
          name: 'ok',
          props: {
            count: 1,
            cash_limit: {
              used_amount: { amount: 200, currency: Currency.UAH },
              limit: { amount: 100, currency: Currency.UAH },
              type: CashLimitType.FLEET,
            },
            restrictions: [
              {
                restricted_by: RestrictionReason.CASH_LIMIT,
                restriction_items: [{ fleet_id: 'test', type: Restriction.CASH }],
              },
            ],
          },
        });
        cy.reload();

        cy.getBySel('cash-limit-list-used-amount').should('exist').should('contain', '₴ 2.00');
        cy.getBySel('cash-limit-list-used-amount').should('have.css', 'color', 'rgb(69, 71, 84)');
        cy.getBySel('cash-limit-list-used-amount-tooltip').should('not.exist');
      });

      it.skip('[7967] should send correct filters values', () => {
        const useTypeFilter = (type: CashLimitType = null): void => {
          cy.getBySel('filter-limitType-trigger').click();
          cy.getBySel(`filter-limitType-${type ?? 'All'}`)
            .should('exist')
            .should('be.visible')
            .click();
        };
        const expectDefaultFilters = (request: any): void => {
          expect(request.query.offset).to.eql('0');
          expect(request.query.limit).to.eql('30');
          expect(request.query.has_restriction_by_cash_limit).to.eql('false');
        };
        const shouldNotHaveQueries = (request: any, queryNames: string[]): void => {
          queryNames.forEach((queryName: string) => {
            expect(request.query).not.to.have.property(queryName);
          });
        };

        driversIntercept.apply({ name: 'ok', props: { count: 1 } }).as('getDrivers');

        cy.reload();
        cy.wait('@getDrivers').then(({ request }) => {
          expectDefaultFilters(request);
        });

        cy.getBySel('filter-Name').type('Hello');
        cy.wait('@getDrivers').then(({ request }) => {
          expectDefaultFilters(request);
          shouldNotHaveQueries(request, ['phone', 'cash_limit_type']);
          expect(request.query.name).to.eql('Hello');
        });
        cy.getBySel('filter-reset-btn').click();

        cy.getBySel('filter-Phone').type('380500000000');
        cy.wait('@getDrivers').then(({ request }) => {
          expectDefaultFilters(request);
          shouldNotHaveQueries(request, ['name', 'cash_limit_type']);
          expect(request.query.phone).to.eql('380500000000');
        });
        cy.getBySel('filter-reset-btn').click();

        useTypeFilter(CashLimitType.FLEET);
        cy.wait('@getDrivers').then(({ request }) => {
          expectDefaultFilters(request);
          shouldNotHaveQueries(request, ['name', 'phone']);
          expect(request.query.cash_limit_type).to.eql(CashLimitType.FLEET);
        });
        cy.getBySel('filter-reset-btn').click();

        useTypeFilter(CashLimitType.INDIVIDUAL);
        cy.wait('@getDrivers').then(({ request }) => {
          expectDefaultFilters(request);
          shouldNotHaveQueries(request, ['name', 'phone']);
          expect(request.query.cash_limit_type).to.eql(CashLimitType.INDIVIDUAL);
        });
        cy.getBySel('filter-reset-btn').click();

        useTypeFilter(CashLimitType.NO_LIMITS);
        cy.wait('@getDrivers').then(({ request }) => {
          expectDefaultFilters(request);
          shouldNotHaveQueries(request, ['name', 'phone']);
          expect(request.query.cash_limit_type).to.eql(CashLimitType.NO_LIMITS);
        });
        cy.getBySel('filter-reset-btn').click();

        useTypeFilter();
        cy.wait('@getDrivers').then(({ request }) => {
          expectDefaultFilters(request);
          shouldNotHaveQueries(request, ['name', 'phone', 'cash_limit_type']);
        });
      });
    });

    describe('Cash limits drivers settings dialog', () => {
      const openDriversSettingsDialog = (plural = false): void => {
        if (plural) {
          cy.getBySel('cash-limits-list-master-checkbox-desktop').should('exist').click();
          cy.getBySel('cash-limits-list-checkbox').each((checkbox) => {
            cy.wrap(checkbox).should('exist').should('have.class', 'mat-mdc-checkbox-checked');
          });
          cy.getBySel('cash-limits-list-edit-header').should('exist');
          cy.getBySel('cash-limits-list-action-edit').should('exist').click();
          return;
        }

        cy.getBySel('cash-limit-list-edit-btn').eq(0).should('exist').click();
        cy.getBySel('cash-limits-drivers-settings-dialog').should('exist');
      };

      beforeEach(() => {
        cashLimitsSettings.apply({
          name: 'ok',
          props: { enabled: true, amount: 10_000, period: CashLimitsSettingsPeriod.WEEK },
        });
        cy.reload();
      });

      it('should open settings dialog for single driver', () => {
        driversIntercept.apply({ name: 'ok', props: { drivers: [DRIVER()] } });
        cy.reload();

        openDriversSettingsDialog();
        cy.getBySel('cash-limits-drivers-dialog-title')
          .should('exist')
          .should('contain', `${DRIVER().last_name} ${DRIVER().first_name}`);
      });

      it('[7922, 7988] should not have fleet limit option if fleet limit is not set', () => {
        cashLimitsSettings.apply({ name: 'ok' });
        cy.reload();
        openDriversSettingsDialog();

        cy.getBySel('cash-limits-drivers-dialog-radio-fleet').should('not.exist');
        cy.getBySel('cash-limits-drivers-dialog-radio-individual')
          .should('exist')
          .should('contain', 'Індивідуальний ліміт (встановити значення)');
        cy.getBySel('cash-limits-drivers-dialog-radio-no-limits').should('exist').should('contain', 'Немає лімітів');
      });

      it('[7923] should have fleet limit option if fleet limit is set', () => {
        cy.reload();
        openDriversSettingsDialog();

        cy.getBySel('cash-limits-drivers-dialog-radio-fleet')
          .should('exist')
          .should('contain', 'Ліміт парку (₴ 100/тиждень)');
      });

      it('[7933, 7975, 7976, 7977] should be possible to change limit settings by radio button selection', () => {
        driversIntercept.apply({ name: 'ok', props: { drivers: [DRIVER()] } });
        cy.reload();
        openDriversSettingsDialog();

        cy.getBySel('cash-limits-drivers-dialog-amount-input').should('not.exist');
        cy.getBySel('cash-limits-drivers-dialog-limit-disclaimer').should('not.exist');

        cy.getBySel('cash-limits-drivers-dialog-radio-fleet')
          .should('exist')
          .should('have.class', 'mat-mdc-radio-checked');
        cy.getBySel('cash-limits-drivers-dialog-save-btn').should('exist').should('not.have.attr', 'disabled');

        cy.getBySel('cash-limits-drivers-dialog-radio-no-limits').should('exist').click();
        cy.getBySel('cash-limits-drivers-dialog-radio-no-limits').should('have.class', 'mat-mdc-radio-checked');
        cy.getBySel('cash-limits-drivers-dialog-save-btn').should('exist').should('not.have.attr', 'disabled');

        cy.getBySel('cash-limits-drivers-dialog-radio-individual').should('exist').click();
        cy.getBySel('cash-limits-drivers-dialog-radio-individual').should('have.class', 'mat-mdc-radio-checked');
        cy.getBySel('cash-limits-drivers-dialog-save-btn').should('exist').should('have.attr', 'disabled');
        cy.getBySel('cash-limits-drivers-dialog-amount-input').should('exist').type('6000');
        cy.getBySel('cash-limits-drivers-dialog-limit-disclaimer')
          .should('exist')
          .should(
            'contain',
            'Якщо водій отримає більше ₴ 6000 за тиждень, йому одразу заблокується можливість брати готівкові замовлення',
          );
        cy.getBySel('cash-limits-drivers-dialog-save-btn').should('exist').should('not.have.attr', 'disabled');
      });

      it('[7934, 7982] display error on update drivers settings fail', () => {
        cy.intercept('PUT', 'api/fleets/*/finance/cash-limits/exceptions', { statusCode: 400 }).as('error');

        openDriversSettingsDialog();
        cy.getBySel('cash-limits-drivers-dialog-save-btn').should('exist').click();
        cy.getBySel('cash-limits-drivers-dialog-save-btn').should('exist').click();

        cy.wait('@error').then(() => {
          cy.get('.toast.error')
            .should('exist')
            .should('contain.text', 'Щось пішло не так, спробуйте будь-ласка пізніше');
        });
      });

      it('[7935] should preselect correct limit type', () => {
        driversIntercept.apply({ name: 'ok', props: { drivers: [DRIVER()] } });
        cy.reload();

        openDriversSettingsDialog();
        cy.getBySel('cash-limits-drivers-dialog-radio-fleet').should('have.class', 'mat-mdc-radio-checked');

        driversIntercept.apply({ name: 'ok', props: { drivers: [DRIVER({ limitType: CashLimitType.INDIVIDUAL })] } });
        cy.reload();
        openDriversSettingsDialog();
        cy.getBySel('cash-limits-drivers-dialog-radio-individual').should('have.class', 'mat-mdc-radio-checked');

        driversIntercept.apply({ name: 'ok', props: { drivers: [DRIVER({ limitType: CashLimitType.NO_LIMITS })] } });
        cy.reload();
        openDriversSettingsDialog();
        cy.getBySel('cash-limits-drivers-dialog-radio-no-limits').should('have.class', 'mat-mdc-radio-checked');
      });

      it('[7936] should display confirmation dialog if driver could be blocked', () => {
        driversIntercept.apply({ name: 'ok', props: { drivers: [DRIVER()] } });
        cy.reload();
        openDriversSettingsDialog();

        cy.getBySel('cash-limits-drivers-dialog-radio-individual').should('exist').click();
        cy.getBySel('cash-limits-drivers-dialog-amount-input').should('exist').type('300');
        cy.getBySel('cash-limits-drivers-dialog-save-btn').should('exist').click();
        cy.getBySel('cash-limits-drivers-dialog-title').should('contain', 'Зберегти нові налаштування?');
        cy.getBySel('cash-limits-drivers-dialog-confirmation-message').should(
          'contain',
          'В результаті змін водію буде заблокована можливість брати готівкові замовлення',
        );
        cy.getBySel('cash-limits-drivers-dialog-driver-chip')
          .should('exist')
          .should('contain', `${DRIVER().last_name} ${DRIVER().first_name}`);
      });

      it('[7987] should reset selection on filters change', () => {
        cy.getBySel('cash-limits-list-master-checkbox-desktop').should('exist').click();
        cy.getBySel('cash-limits-list-master-checkbox-desktop').should('have.class', 'mat-mdc-checkbox-checked');
        cy.getBySel('cash-limits-list-checkbox').each((checkbox) => {
          cy.wrap(checkbox).should('exist').should('have.class', 'mat-mdc-checkbox-checked');
        });

        cy.getBySel('filter-Name').type('Hello');
        cy.getBySel('filter-reset-btn').click();

        cy.getBySel('cash-limits-list-master-checkbox-desktop').should('not.have.class', 'mat-mdc-checkbox-checked');
        cy.getBySel('cash-limits-list-checkbox').each((checkbox) => {
          cy.wrap(checkbox).should('exist').should('not.have.class', 'mat-mdc-checkbox-checked');
        });
      });

      it('[7984, 7985] should clear selection on cancel edit', () => {
        cy.getBySel('cash-limits-list-master-checkbox-desktop').should('exist').click();
        cy.getBySel('cash-limits-list-edit-header').should('exist');
        cy.getBySel('cash-limits-list-action-edit').should('exist');
        cy.getBySel('cash-limits-list-action-cancel').should('exist').click();
        cy.getBySel('cash-limits-list-master-checkbox-desktop').should('not.have.class', 'mat-mdc-checkbox-checked');
        cy.getBySel('cash-limits-list-checkbox').each((checkbox) => {
          cy.wrap(checkbox).should('exist').should('not.have.class', 'mat-mdc-checkbox-checked');
        });
        cy.getBySel('cash-limits-list-edit-header').should('not.exist');

        cy.getBySel('cash-limits-list-master-checkbox-desktop').click();
        cy.getBySel('cash-limits-list-action-edit').click();
        cy.getBySel('cash-limits-drivers-dialog-cancel-btn').click();
        cy.getBySel('cash-limits-list-master-checkbox-desktop').should('not.have.class', 'mat-mdc-checkbox-checked');
        cy.getBySel('cash-limits-list-checkbox').each((checkbox) => {
          cy.wrap(checkbox).should('exist').should('not.have.class', 'mat-mdc-checkbox-checked');
        });
        cy.getBySel('cash-limits-list-edit-header').should('not.exist');
      });

      it('[7983] should hide single driver edit button on checkbox select', () => {
        cy.getBySel('cash-limit-list-edit-btn').should('exist').should('have.length', DRIVERS_COUNT);
        cy.getBySel('cash-limits-list-checkbox').eq(0).click();
        cy.getBySel('cash-limit-list-edit-btn').should('not.exist');
      });

      it('[7978] should warn about blocking drivers after settings update', () => {
        const selectedIndexes = [0, 2, 3];
        const drivers = [
          DRIVER({ id: '1', limitAmount: 100_000 }),
          DRIVER({ id: '2', firstName: '1', usedAmount: 100_000, limitAmount: 100_000 }),
          DRIVER({
            id: '3',
            firstName: '2',
            usedAmount: 80_000,
            limitAmount: 130_000,
            limitType: CashLimitType.INDIVIDUAL,
          }),
          DRIVER({ id: '4', firstName: '3', usedAmount: 30_000, limitType: CashLimitType.NO_LIMITS }),
        ];

        cashLimitsSettings.apply({
          name: 'ok',
          props: { period: CashLimitsSettingsPeriod.DAY, amount: 100_000, enabled: true },
        });
        driversIntercept.apply({
          name: 'ok',
          props: { drivers },
        });
        cy.reload();

        selectedIndexes.forEach((index) => cy.getBySel('cash-limits-list-checkbox').eq(index).click());
        cy.getBySel('cash-limits-list-action-edit').should('exist').click();

        cy.getBySel('cash-limits-drivers-dialog-title').should('contain', 'Редагування');
        cy.getBySel('cash-limits-drivers-dialog-driver-chip')
          .should('exist')
          .should('have.length', selectedIndexes.length);
        selectedIndexes.forEach((driverIndex, index) => {
          cy.getBySel('cash-limits-drivers-dialog-driver-chip')
            .eq(index)
            .should('contain', `${drivers[driverIndex].last_name} ${drivers[driverIndex].first_name}`);
        });
        cy.getBySel('cash-limits-drivers-dialog-radio-individual').click();
        cy.getBySel('cash-limits-drivers-dialog-amount-input').type('800');
        cy.getBySel('cash-limits-drivers-dialog-save-btn').click();

        cy.intercept('PUT', 'api/fleets/*/finance/cash-limits/exceptions', { statusCode: 200 }).as('update');

        cy.getBySel('cash-limits-drivers-dialog-driver-chip').should('exist').should('contain', 'World 2');
        cy.getBySel('cash-limits-drivers-dialog-title').should('contain', 'Зберегти нові налаштування?');
        cy.getBySel('cash-limits-dialog-close').click();
        cy.getBySel('cash-limits-drivers-dialog-amount-input').type('500');
        cy.getBySel('cash-limits-drivers-dialog-save-btn').click();

        cy.get('@update.all').should('have.length', 1);

        cy.getBySel('cash-limits-list-edit-header').should('not.exist');
        cy.getBySel('cash-limits-list-checkbox').each((checkbox) => {
          cy.wrap(checkbox).should('not.have.class', 'mat-mdc-checkbox-checked');
        });
      });
    });
  });
}
