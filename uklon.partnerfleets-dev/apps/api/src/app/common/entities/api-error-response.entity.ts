import { ApiErrorResponseDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class ApiErrorResponseEntity implements ApiErrorResponseDto {
  @ApiProperty({ type: String })
  public error_code: string;

  @ApiProperty({ type: String })
  public message: string;
}
