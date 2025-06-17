import { AdvancedOptions, BodyType } from '@constant';
import { VehicleTicketUpdateDto } from '@data-access';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class VehicleTicketUpdateEntity implements VehicleTicketUpdateDto {
  @ApiPropertyOptional({ type: String })
  public license_plate?: string;

  @ApiPropertyOptional({ enum: BodyType, enumName: 'BodyType' })
  public body_type?: BodyType;

  @ApiPropertyOptional({ enum: AdvancedOptions, enumName: 'AdvancedOptions', isArray: true })
  public options?: AdvancedOptions[];

  @ApiPropertyOptional({ type: Boolean })
  public has_taxi_license?: boolean;
}
