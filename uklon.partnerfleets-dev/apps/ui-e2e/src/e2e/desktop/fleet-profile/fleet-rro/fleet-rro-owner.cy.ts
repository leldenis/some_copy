import {
  FleetHistoryChangeItemDto,
  FleetHistoryType,
  FleetMerchant,
  FleetRole,
  FleetType,
  HistoryInitiatorType,
  IndividualEntrepreneurDto,
} from '@data-access';

import { MeIntercept } from '../../../../support/interceptor';
import { IndividualEntrepreneursIntercept } from '../../../../support/interceptor/finance/individual-entrepreneus';
import { FleetDetailsIntercept } from '../../../../support/interceptor/fleet-profile/driver-details';
import { FleetHistoryIntercept } from '../../../../support/interceptor/fleet-profile/fleet-history';
import { FleetFiscalizationSettingsIntercept } from '../../../../support/interceptor/fleet-profile/fleet-rro/fiscalization-settings';
import { FleetFiscalizationStatusIntercept } from '../../../../support/interceptor/fleet-profile/fleet-rro/fiscalization-status';
import { FleetFiscalizationVehiclesIntercept } from '../../../../support/interceptor/fleet-profile/fleet-rro/fiscalization-vehicles';
import { FleetSignatureKeysIntercept } from '../../../../support/interceptor/fleet-profile/fleet-rro/signature-keys';
import { isMockingData } from '../../../../support/utils';

if (isMockingData()) {
  describe('Fleet RRO - owner', () => {
    const entrepreneursItems: IndividualEntrepreneurDto[] = [
      {
        id: '29d56517-d177-42c0-b837-f502fe202458',
        name: 'Плато',
        is_selected: true,
        payment_providers: [
          {
            merchant_id: '5454545',
            merchant_binding_id: 'e658c23f-86a9-4910-b5d7-62569d398533',
            type: FleetMerchant.FONDY,
          },
          {
            merchant_id: '22221',
            merchant_binding_id: '5686e042-7a40-459c-81ac-f0990f2a2692',
            type: FleetMerchant.IPAY,
          },
          {
            merchant_id: '5644256',
            merchant_binding_id: '1de4f06b-13ee-4bb8-a448-f45ade0e3ce9',
            type: FleetMerchant.PLATON,
          },
        ],
      },
    ];

    const historyItems: FleetHistoryChangeItemDto[] = [
      {
        id: '5e2e26e5-30a9-45b7-9521-3112e5c21970',
        change_type: FleetHistoryType.FISCALIZATION_POS_BINDED,
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
        change_type: FleetHistoryType.FISCALIZATION_POS_UNBINDED,
        occurred_at: 1_721_725_314,
        initiator: {
          display_name: 'System',
          type: HistoryInitiatorType.SYSTEM,
          account_id: '5e2e26e5-30a9-45b7-9521-3112e5c21970',
        },
        has_additional_data: true,
      },
    ];
    const fleetId = '*';
    const meData = new MeIntercept();
    const individualEntrepreneurs = new IndividualEntrepreneursIntercept(fleetId, true);
    const fleetDetailsIntercept = new FleetDetailsIntercept(fleetId);
    const fleetHistoryIntercept = new FleetHistoryIntercept(fleetId);
    const fleetFiscalizationSettings = new FleetFiscalizationSettingsIntercept(fleetId);
    const fleetFiscalizationStatus = new FleetFiscalizationStatusIntercept(fleetId);
    const fleetSignatureKeysIntercept = new FleetSignatureKeysIntercept(fleetId);
    const fleetFiscalizationVehicles = new FleetFiscalizationVehiclesIntercept(fleetId);

    beforeEach(() => {
      cy.loginWithSession('fleetRROOwner');

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
      individualEntrepreneurs
        .apply({ name: 'ok', props: { entrepreneur: entrepreneursItems } })
        .as('getIndividualEntrepreneurs');
      fleetDetailsIntercept.apply({ name: 'ok', props: { is_fiscalization_enabled: true } });
      fleetHistoryIntercept.apply({ name: 'ok', props: { items: historyItems } });
      fleetFiscalizationSettings.apply({ name: 'ok' });
      fleetFiscalizationStatus.apply({ name: 'ok' });
      fleetSignatureKeysIntercept.apply({ name: 'ok' });
      fleetFiscalizationVehicles.apply({ name: 'ok' });

      cy.visit('workspace/fleet-profile?tab=keys#rro');
    });

    describe('When fleet owner open rro page', () => {
      it.skip('[4705] should have fleet rro container', () => {
        cy.url().should('includes', `workspace/fleet-profile?tab=keys#rro`);
        cy.getBySel('fleet-rro-container').should('be.visible');
      });

      describe.skip('[4714] should have basic elements', () => {
        it('should have link - how to activate fiscalization', () => {
          cy.getBySel('how-to-activate-link')
            .should(
              'have.attr',
              'href',
              'https://docs.google.com/document/d/1olRmrwlsHP185aeZ83UAWJjSwqZnIIWFMtx0rwjQ8FA/edit#heading=h.tnau0qpw9rfk',
            )
            .and('have.attr', 'target', '_blank');
        });

        it.skip('should have fiscalization settings button', () => {
          cy.getBySel('fiscal-setting-btn').should('be.visible');
        });

        it.skip('should have link - about partner', () => {
          cy.getBySel('partner-link')
            .should('have.attr', 'href', 'https://web.cashdesk.com.ua/login')
            .and('have.attr', 'target', '_blank');
        });

        it.skip('should have fiscalization activation toggle', () => {
          cy.getBySel('fiscal-activation-toggle').should('be.visible');
        });

        it.skip('should have tab keys', () => {
          cy.getBySel('tab-keys').should('be.visible');
        });

        it.skip('should have tab cars', () => {
          cy.getBySel('tab-cars').should('be.visible');
        });

        it.skip('should have signature key button', () => {
          cy.getBySel('upload-signature-key-btn').should('be.visible');
        });
      });
    });

    describe('When open fiscalization setting modal', () => {
      describe.skip('[4711] fiscalization settings modal', () => {
        it('should exist settings modal', () => {
          cy.getBySel('fiscal-setting-btn').should('be.visible').click();
          cy.getBySel('fiscal-settings-modal').should('be.visible');
        });

        it('should close settings modal by cross button', () => {
          cy.getBySel('fiscal-setting-btn').should('be.visible').click();
          cy.getBySel('settings-header-btn-close').should('be.visible').click();
          cy.getBySel('fiscal-settings-modal').should('not.exist');
        });

        it('should close settings modal by close button', () => {
          cy.getBySel('fiscal-setting-btn').should('be.visible').click();
          cy.getBySel('settings-footer-btn-close').should('be.visible').click();
          cy.getBySel('fiscal-settings-modal').should('not.exist');
        });

        it('should close the dialog when clicking outside', () => {
          cy.getBySel('fiscal-setting-btn').should('be.visible').click();
          cy.get('body').click(0, 0);
          cy.getBySel('fiscal-settings-modal').should('not.exist');
        });
      });

      it.skip('[4712] should allow the user to select fare payment types', () => {
        cy.getBySel('fiscal-setting-btn').should('be.visible').click();
        cy.getBySel('fiscal-settings-modal').should('be.visible');
        cy.getBySel('fare-payment-types').should('be.visible').click();
        cy.get('mat-option').eq(0).click();
        cy.get('mat-option').eq(1).click();
        cy.getBySel('settings-footer-btn-save').should('exist').should('not.have.attr', 'disabled');
        cy.get('body').click(0, 0);
      });

      it.skip('[4713] should allow the user to select vat types', () => {
        cy.getBySel('fiscal-setting-btn').should('be.visible').click();
        cy.getBySel('fiscal-settings-modal').should('be.visible');
        cy.getBySel('vat-type').should('be.visible').click();
        cy.get('mat-option').eq(1).click();
        cy.getBySel('settings-footer-btn-save').should('exist').should('not.have.attr', 'disabled');
        cy.get('body').click(0, 0);
      });

      it.skip('[5218] should display service product name input', () => {
        cy.getBySel('fiscal-setting-btn').should('be.visible').click();
        cy.getBySel('fiscal-settings-modal').should('be.visible');
        cy.getBySel('service-product-name').should('be.visible');
      });

      it.skip('[5219] should display default value', () => {
        cy.getBySel('fiscal-setting-btn').should('be.visible').click();
        cy.getBySel('service-product-name')
          .should('be.visible')
          .invoke('val')
          .should('eq', 'Надання послуг з організації перевезень');
      });
    });

    describe.skip('[4715] Upload keys tab', () => {
      it('should display signature keys', () => {
        cy.getBySel('upload-signature-key-btn').should('be.visible').click();
        cy.getBySel('fleet-key-list').should('be.visible');
      });

      it('should open remove key modal', () => {
        cy.getBySel('key-list-btn-remove-key').should('be.visible').click();
        cy.getBySel('simple-modal').should('be.visible');
        cy.get('body').click(0, 0);
      });

      it('should open key details modal', () => {
        cy.getBySel('key-list-btn-info').should('be.visible').click();
        cy.getBySel('key-info-modal').should('be.visible');
        cy.getBySel('key-info-modal-btn-close').click();
      });

      it('should display serial of key in grid', () => {
        cy.getBySel('key-list-field-serial').should('be.visible');
      });

      it('should display drfo field', () => {
        cy.getBySel('key-list-field-dfro').should('be.visible');
      });

      it('should display expiration date', () => {
        cy.getBySel('key-list-field-expiration-date').should('be.visible');
      });

      it('should display cashier link field', () => {
        cy.getBySel('key-list-field-link-cashier').should('be.visible');
      });
    });

    describe.skip('Activate/Deactivate fiscalization', () => {
      it('[4718] Should be enabled fiscalization toggle', () => {
        cy.getBySel('fiscal-activation-toggle').should('be.visible').contains('активована');
      });

      it('[4720] Should have ability to disable fiscalization', () => {
        cy.getBySel('fiscal-activation-toggle').should('be.visible').click();
        cy.getBySel('simple-modal').should('be.visible');
        cy.getBySel('simple-modal-btn-accept').should('be.visible');
        cy.getBySel('simple-modal-btn-cancel').should('be.visible').click();
      });

      it('[4721] Should have ability to cancel warning modal', () => {
        cy.getBySel('fiscal-activation-toggle').should('be.visible').click();
        cy.getBySel('simple-modal').should('be.visible');
        cy.getBySel('simple-modal-btn-cancel').should('be.visible').click();
      });

      it('[4722] Should have ability to enable fiscalization', () => {
        cy.getBySel('fiscal-activation-toggle').should('be.visible').click();
        cy.getBySel('simple-modal').should('be.visible');
        cy.getBySel('simple-modal-btn-accept').should('be.visible');
        cy.getBySel('simple-modal-btn-cancel').should('be.visible').click();
      });

      it('[4723] Should have ability to close modal', () => {
        cy.getBySel('fiscal-activation-toggle').should('be.visible').click();
        cy.getBySel('simple-modal').should('be.visible');
        cy.getBySel('simple-modal-btn-close').should('be.visible').click();
      });
    });

    it.skip('[4725] Upload modal should have necessary elements', () => {
      cy.getBySel('upload-signature-key-btn').should('be.visible').click();
      cy.getBySel('upload-key-modal-content').should('be.visible');
      cy.getBySel('select-file-from-computer').should('be.visible');
      cy.getBySel('upload-key-input-password').should('be.visible');
      cy.getBySel('upload-key-input-name').should('be.visible');
      cy.getBySel('upload-key-btn-upload').should('have.attr', 'disabled');
      cy.get('body').click(0, 0);
    });

    describe.skip('When open vehicles tab', () => {
      it('[4739] should display vehicles grid', () => {
        cy.getBySel('tab-cars').should('be.visible').click();
        cy.getBySel('fleet-vehicle-list').should('be.visible');
      });
    });
  });
}
