import { CollectionDto, CursorDto } from '../common';

import { FleetOrderRecordDto } from './fleet-order-record.dto';

export interface FleetOrderRecordCollectionDto extends CollectionDto<FleetOrderRecordDto>, CursorDto {}
