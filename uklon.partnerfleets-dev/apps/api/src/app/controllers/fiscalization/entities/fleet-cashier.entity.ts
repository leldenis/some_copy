import { FleetCashPointEntity } from '@api/controllers/fiscalization/entities/fleet-cash-point.entity';
import { FleetCashierDto, FleetCashPointDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class FleetCashierEntity implements FleetCashierDto {
  @ApiProperty({ type: String })
  public cashier_id: string;

  @ApiProperty({ type: Number })
  public cashier_created_at: number;

  @ApiProperty({ type: FleetCashPointEntity, isArray: true })
  public points_of_sale: FleetCashPointDto[];
}
