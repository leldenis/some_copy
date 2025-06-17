export type SectorTagName = 'name:uk' | 'name:en' | 'name:uz' | 'name:ru' | 'name';

export interface RegionSectorsDto {
  version: string;
  sectors: SectorDto[];
}

export interface SectorDto {
  id: string;
  name: string;
  city_id: string;
  business_region_id: string;
  tags: SectorTagDto[];
  geometry: SectorGeometryDto;
}

export interface SectorTagDto {
  name: SectorTagName;
  value: string;
}

export interface SectorGeometryDto {
  type: string;
  coordinates: number[][][][];
}
