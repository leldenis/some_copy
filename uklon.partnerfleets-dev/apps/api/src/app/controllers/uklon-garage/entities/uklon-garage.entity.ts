import { UklonGarageApplicationDto, UklonGarageApplicationStatus, UklonGarageFleetApplicationDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class UklonGarageApplicationEntity implements UklonGarageApplicationDto {
  @ApiProperty({ type: String })
  public first_name: string;

  @ApiProperty({ type: String })
  public last_name: string;

  @ApiProperty({ type: String })
  public phone: string;

  @ApiProperty({ type: String })
  public comment: string;
}

export class UklonGarageFleetApplicationEntity implements UklonGarageFleetApplicationDto {
  @ApiProperty({ type: String })
  public id: string;

  @ApiProperty({ type: String })
  public first_name: string;

  @ApiProperty({ type: String })
  public last_name: string;

  @ApiProperty({ type: String })
  public phone: string;

  @ApiProperty({ type: String })
  public created_at: number;

  @ApiProperty({ type: String })
  public comment: string;

  @ApiProperty({ enum: UklonGarageApplicationStatus, enumName: 'UklonGarageApplicationStatus' })
  public status: UklonGarageApplicationStatus;
}
