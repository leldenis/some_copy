import { FleetContactEntity } from '@api/controllers/contacts/entities/fleet-contact.entity';
import { FleetDetailsDto, FleetType, FleetStatus, FleetMaintainerDto } from '@data-access';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FleetMaintainerEntity implements FleetMaintainerDto {
  @ApiPropertyOptional({ type: Number })
  public absent_from?: number;

  @ApiPropertyOptional({ type: Number })
  public absent_to?: number;

  @ApiProperty({ type: String })
  public email: string;

  @ApiProperty({ type: String })
  public first_name: string;

  @ApiProperty({ type: String })
  public id: string;

  @ApiProperty({ type: String })
  public last_name: string;

  @ApiProperty({ type: String })
  public phone: string;

  @ApiPropertyOptional({ type: String })
  public telegram_phone?: string;

  @ApiPropertyOptional({ type: String })
  public viber_phone?: string;
}

export class FleetDetailsEntity implements FleetDetailsDto {
  @ApiProperty({ type: String })
  public id: string;

  @ApiProperty({ type: String })
  public name: string;

  @ApiProperty({ type: Number })
  public region_id: number;

  @ApiProperty({ type: String })
  public email: string;

  @ApiProperty({ enum: FleetType, enumName: 'FleetType' })
  public type: FleetType;

  @ApiProperty({ type: FleetContactEntity, isArray: true })
  public users: FleetContactEntity[];

  @ApiProperty({ type: String })
  public wallet_id: string;

  @ApiProperty({ type: Number })
  public created_at: number;

  @ApiProperty({ type: Number })
  public driver_count: number;

  @ApiProperty({ type: Number })
  public employee_count: number;

  @ApiProperty({ type: Number })
  public vehicle_count: number;

  @ApiProperty({ enum: FleetStatus, enumName: 'FleetStatus' })
  public status: FleetStatus;

  @ApiPropertyOptional({ type: Boolean })
  public is_fiscalization_enabled?: boolean;

  @ApiPropertyOptional({ type: FleetMaintainerEntity })
  public maintainer?: FleetMaintainerDto;

  @ApiPropertyOptional({ type: FleetMaintainerEntity })
  public reserve_maintainer?: FleetMaintainerDto;
}
