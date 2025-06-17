import { FleetMerchant, FleetRole, FleetType, IndividualEntrepreneurDto } from '@data-access';

import { MeIntercept } from '../../../../support/interceptor';
import { IndividualEntrepreneursIntercept } from '../../../../support/interceptor/finance/individual-entrepreneus';
import { FleetDetailsIntercept } from '../../../../support/interceptor/fleet-profile/driver-details';
import { isMockingData } from '../../../../support/utils';

if (isMockingData()) {
  describe('Fleet RRO - manager', () => {
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
    const fleetId = '*';
    const meData = new MeIntercept();
    const individualEntrepreneurs = new IndividualEntrepreneursIntercept(fleetId, true);
    const fleetDetailsIntercept = new FleetDetailsIntercept(fleetId);

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
              role: FleetRole.MANAGER,
              fleet_type: FleetType.COMMERCIAL,
              tin_refused: false,
              is_fiscalization_enabled: false,
            },
          ],
        },
      });
      individualEntrepreneurs.apply({ name: 'ok', props: { entrepreneur: entrepreneursItems } });
      fleetDetailsIntercept.apply({ name: 'ok', props: { is_fiscalization_enabled: false } });

      cy.visit('workspace/fleet-profile');
    });

    describe('When manager open fleet profile page', () => {
      it('Should open profile page', () => {
        cy.url().should('includes', `workspace/fleet-profile`);
      });

      it('[4706] should not have RRO tab', () => {
        cy.getBySel('fleet-rro-container').should('not.exist');
      });
    });
  });
}
