export interface VideoUrlDto {
  url: string;
}

export interface VideosDto {
  vehicle_branding_review?: VideoUrlDto;
}

export type VideoType = keyof VideosDto;

export enum VehicleVideoCategory {
  VEHICLE_BRANDING_REVIEW = 'vehicle_branding_review',
}
