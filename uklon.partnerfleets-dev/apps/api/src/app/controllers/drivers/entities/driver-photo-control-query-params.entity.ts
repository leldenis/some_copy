import { TicketStatus } from '@constant';
import { DriverPhotoControlQueryParamsDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class DriverPhotoControlQueryParamsEntity implements DriverPhotoControlQueryParamsDto {
  @ApiProperty({ enum: TicketStatus, enumName: 'TicketStatus' })
  public status: TicketStatus;

  @ApiProperty({ type: String })
  public phone: string;

  @ApiProperty({ type: Number })
  public cursor: number;

  @ApiProperty({ type: Number })
  public limit: number;

  @ApiProperty({ type: Number })
  public from: number;

  @ApiProperty({ type: Number })
  public to: number;
}
