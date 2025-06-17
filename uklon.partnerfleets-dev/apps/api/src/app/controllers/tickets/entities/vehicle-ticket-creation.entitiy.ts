import { AdvancedOptions, BodyType } from '@constant';
import { VehicleTicketCreationDto } from '@data-access';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class VehicleTicketCreationEntity implements VehicleTicketCreationDto {
  @ApiProperty({ type: String })
  public tiket_id: string;

  @ApiPropertyOptional({ type: String })
  public license_plate?: string;

  @ApiPropertyOptional({ enum: BodyType, enumName: 'BodyType' })
  public body_type?: BodyType;

  @ApiPropertyOptional({ enum: AdvancedOptions, enumName: 'AdvancedOptions', isArray: true })
  public options?: AdvancedOptions[];
}
