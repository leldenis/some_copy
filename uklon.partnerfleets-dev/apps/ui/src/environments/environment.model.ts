import { IsActiveMixinDto, LanguageExpression } from '@data-access';

export interface ExternalLinksSection {
  registration: string;
  uklon: string;
  karmaManual: string;
}

export interface SupportWidgetConfig {
  country_code?: string;
  phone: string;
  schedule: {
    dayRange: { from: string; to?: string };
    timeRange: { from: string; to: string };
  }[];
}

export interface SupportWidgetSection {
  country?: SupportWidgetConfig;
  capital?: SupportWidgetConfig;
  regions?: SupportWidgetConfig;
}

export interface AnalyticSection extends IsActiveMixinDto {
  googleTagManagerId: string;
}

export interface LanguageFallback {
  from: LanguageExpression;
  to: LanguageExpression;
}

export interface LanguageSection {
  default: LanguageExpression;
  available: LanguageExpression[];
  fallbacks: LanguageFallback[];
}

export interface SentryConfig extends IsActiveMixinDto {
  dsn: string;
}

export interface NotificationsConfig {
  enableWebSockets: boolean;
  showNotificationCenter: boolean;
}

export enum FeatureToggle {
  CASH_LIMITS_REGIONS = 'cashLimitsAvailableRegions',
  CASH_LIMITS_FLEETS = 'cashLimitsAvailableFleets',
}

export interface EnvironmentModel {
  production: boolean;
  gateway: string;
  clientId: string;
  clientSecret: string;
  language: LanguageSection;
  analytic?: AnalyticSection;
  supportWidget: Record<string, SupportWidgetSection>;
  externalLinks: ExternalLinksSection;
  showCargo?: boolean;
  rentalFleetWithdrawalEnabled?: boolean;
  financialAuthLink?: string;
  sentry?: SentryConfig;
  rroEnabled?: boolean;
  notifications?: NotificationsConfig;
  showFleetManager?: boolean;
  showDriverPhotoControl?: boolean;
  vehicleBrandingPeriodAvailableRegions: number[];
  showBrandingBonusOld?: boolean;
  showBrandingBonus?: boolean;
  showVehiclesCommissionPrograms?: boolean;
  vehicleBrandingVideoMaxSizeMb?: number;
  [FeatureToggle.CASH_LIMITS_REGIONS]?: number[];
  [FeatureToggle.CASH_LIMITS_FLEETS]?: string[];
  refinerIntegration: {
    enabled: boolean;
    refinerProjectId?: string;
  };
  opentelemetry: {
    probabilitySampler: string;
  };
}
