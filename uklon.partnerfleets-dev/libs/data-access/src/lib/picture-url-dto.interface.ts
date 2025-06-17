import { SafeUrl } from '@angular/platform-browser';

export interface PictureUrlDto {
  fallback_url: string;
  url: string;
  uploaded_at?: number;
}

export interface PictureSafeUrlDto {
  fallback_url?: SafeUrl;
  url: SafeUrl;
}
