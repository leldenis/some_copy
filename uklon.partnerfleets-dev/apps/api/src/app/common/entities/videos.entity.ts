import { VideosDto, VideoUrlDto } from '@data-access';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class VideoUrlDtoEntity implements VideoUrlDto {
  @ApiProperty({ type: String })
  public url: string;
}

export class VideosEntity implements VideosDto {
  @ApiPropertyOptional({ type: VideoUrlDtoEntity })
  public vehicle_branding_review?: VideoUrlDto;
}
