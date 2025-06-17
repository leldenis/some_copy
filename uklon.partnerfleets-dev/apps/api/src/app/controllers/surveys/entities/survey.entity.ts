import { ActiveSurveyDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class ActiveSurveyEntity implements ActiveSurveyDto {
  @ApiProperty({ type: String })
  public id: string;

  @ApiProperty({ type: Number })
  public required_at: number;
}
