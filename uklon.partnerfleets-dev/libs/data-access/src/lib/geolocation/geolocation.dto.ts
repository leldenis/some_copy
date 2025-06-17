export interface NearestLocationDto {
  id: number;
  city_id: number;
  name: string;
  original_name: string;
  street: string;
  // eslint-disable-next-line id-denylist,id-blacklist
  number: string;
  is_place: boolean;
  centroid: { latitude: number; longitude: number };
}

export interface FleetCityDataDto {
  id: number;
  name: string;
  country_name: string;
  time_zone: number;
  country_code: string;
  location: { lat: number; lng: number };
  uklon_legal_name: string;
  donation_enabled: boolean;
  product_insurance_infos: unknown[];
  settings: Record<string, unknown>;
}

export interface LocationPointDto {
  positioned_at: number;
  location: {
    type: string;
    coordinates: [number, number];
  };
}
