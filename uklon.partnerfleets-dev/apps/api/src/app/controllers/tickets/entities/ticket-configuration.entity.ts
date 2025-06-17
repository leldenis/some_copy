import { VehiclePhotosCategory } from '@constant';
import { FleetRole, PropertiesConfigurationDto, VehicleTicketConfigDto } from '@data-access';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class VehicleTicketPropertiesConfigurationsEntity implements PropertiesConfigurationDto {
  @ApiProperty({ type: String })
  public property_name: string;

  @ApiProperty({ enum: FleetRole, enumName: 'FleetRole', isArray: true })
  public shown_for: FleetRole[];

  @ApiPropertyOptional({ type: Boolean })
  public is_required?: boolean;
}

export class VehicleTicketConfigEntity implements VehicleTicketConfigDto {
  @ApiProperty({ enum: VehiclePhotosCategory, enumName: 'VehiclePhotosCategory', isArray: true })
  public available_picture_types: VehiclePhotosCategory[];

  @ApiProperty({ enum: VehiclePhotosCategory, enumName: 'VehiclePhotosCategory', isArray: true })
  public required_picture_types: VehiclePhotosCategory[];

  @ApiProperty({ type: Boolean })
  public is_clarification_supported: boolean;

  @ApiProperty({ type: String, isArray: true })
  public available_diia_docs: string[];

  @ApiProperty({ type: VehicleTicketPropertiesConfigurationsEntity, isArray: true })
  public properties_configurations: PropertiesConfigurationDto[];

  @ApiProperty({ enum: VehiclePhotosCategory, enumName: 'VehiclePhotosCategory', isArray: true })
  public picture_types: VehiclePhotosCategory[];
}
