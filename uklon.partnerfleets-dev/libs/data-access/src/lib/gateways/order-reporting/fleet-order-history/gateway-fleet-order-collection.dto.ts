import { CollectionDto } from '../../../common';
import { GatewayCursorDto } from '../../common';

import { GatewayFleetOrderDto } from './gateway-fleet-order.dto';

export interface GatewayFleetOrderCollectionDto extends CollectionDto<GatewayFleetOrderDto>, GatewayCursorDto {}
