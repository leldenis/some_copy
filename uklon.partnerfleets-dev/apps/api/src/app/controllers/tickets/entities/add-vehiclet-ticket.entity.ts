import { PhotosEntity } from '@api/common/entities/photos.entitiy';
import { TicketActivityLogItemEntity } from '@api/controllers/tickets/entities/ticket-activity-log-item.entity';
import { TicketCommentEntity } from '@api/controllers/tickets/entities/ticket-comment.entity';
import { AdvancedOptions, BodyType, Colors, TicketInitiatorType, TicketStatus, VehiclePhotosCategory } from '@constant';
import {
  AddVehicleTicketDto,
  PhotoType,
  PictureUrlDto,
  TicketActivityLogItemDto,
  TicketCommentDto,
  TicketTaxiLicenseDto,
} from '@data-access';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class TicketTaxiLicenseEntity implements TicketTaxiLicenseDto {
  @ApiProperty({ type: Boolean })
  public has_license: boolean;

  @ApiProperty({ type: Number })
  public actual_to: number;

  @ApiProperty({ type: Boolean })
  public is_infinite: boolean;
}

export class AddVehicleTicketEntity implements AddVehicleTicketDto {
  @ApiProperty({ type: String })
  public id: string;

  @ApiProperty({ type: String })
  public fleet_id: string;

  @ApiProperty({ type: String })
  public vehicle_id: string;

  @ApiProperty({ type: String })
  public license_plate: string;

  @ApiProperty({ type: String })
  public vin_code: string;

  @ApiProperty({ type: String })
  public make_id: string;

  @ApiPropertyOptional({ type: String })
  public make?: string;

  @ApiProperty({ type: String })
  public model_id: string;

  @ApiPropertyOptional({ type: String })
  public model?: string;

  @ApiProperty({ enum: Colors, enumName: 'Colors' })
  public color: Colors;

  @ApiProperty({ type: Number })
  public production_year: number;

  @ApiProperty({ enum: BodyType, enumName: 'BodyType' })
  public body_type: BodyType;

  @ApiProperty({ type: String, isArray: true })
  public options: AdvancedOptions[];

  @ApiProperty({ type: String })
  public city: string;

  @ApiProperty({ type: TicketActivityLogItemEntity, isArray: true })
  public activity_log: TicketActivityLogItemDto[];

  @ApiProperty({ type: TicketCommentEntity, isArray: true })
  public comments: TicketCommentDto[];

  @ApiProperty({ enum: TicketInitiatorType, enumName: 'TicketInitiatorType' })
  public initiator: TicketInitiatorType;

  @ApiProperty({ type: String, isArray: true })
  public comfort_levels: string[];

  @ApiProperty({ type: Number })
  public region_id: number;

  @ApiProperty({ type: Boolean })
  public can_be_edited: boolean;

  @ApiProperty({ enum: TicketStatus, enumName: 'TicketStatus' })
  public status: TicketStatus;

  @ApiProperty({ type: TicketTaxiLicenseEntity })
  public taxi_license: TicketTaxiLicenseDto;

  @ApiProperty({ enum: VehiclePhotosCategory, enumName: 'VehiclePhotosCategory', isArray: true })
  public additional_picture_types: VehiclePhotosCategory[];

  @ApiProperty({ type: PhotosEntity })
  public images: Record<PhotoType, PictureUrlDto>;
}
