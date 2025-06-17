export interface UploadFileUrlDto {
  uploadUrl: string;
  getUrl: string;
}

export interface UploadPictureUrlResponseDto {
  ['upload-url']: string;
  ['get-url']: string;
}

export interface UploadVideoUrlResponseDto {
  upload_url: string;
  get_url: string;
}
