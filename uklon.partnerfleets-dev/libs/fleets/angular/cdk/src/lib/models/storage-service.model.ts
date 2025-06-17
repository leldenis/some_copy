export interface StorageService {
  get: <T>(key: string) => T;
  set: <T>(key: string, value: T) => void;
  remove: (key: string) => void;
}
