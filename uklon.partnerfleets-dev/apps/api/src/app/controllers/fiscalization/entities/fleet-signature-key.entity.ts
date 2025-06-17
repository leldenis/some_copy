import { FleetCashierEntity } from '@api/controllers/fiscalization/entities/fleet-cashier.entity';
import { FleetSignatureKeyIdEntity } from '@api/controllers/fiscalization/entities/fleet-signature-key-id.entity';
import { FleetCashierDto, FleetSignatureKeyDto } from '@data-access';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FleetSignatureKeyEntity extends FleetSignatureKeyIdEntity implements FleetSignatureKeyDto {
  @ApiProperty({ type: String })
  public fleet_id: string;

  @ApiProperty({ type: Number })
  public created_at: number;

  @ApiProperty({ type: Number })
  public updated_at: number;

  @ApiPropertyOptional({ type: String })
  public display_name?: string;

  @ApiPropertyOptional({ type: String })
  public drfo?: string;

  @ApiPropertyOptional({ type: Number })
  public expiration_date?: number;

  @ApiPropertyOptional({ type: String })
  public initiated_by?: string;

  @ApiPropertyOptional({ type: String })
  public public_key?: string;

  @ApiPropertyOptional({ type: String })
  public serial?: string;

  @ApiPropertyOptional({ type: Boolean })
  public status?: boolean;

  @ApiPropertyOptional({ type: FleetCashierEntity })
  public cashier?: FleetCashierDto;
}
