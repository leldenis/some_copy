import { EnvironmentModel, FeatureToggle } from '@ui-env/environment.model';

export const environment: EnvironmentModel = {
  production: false,
  gateway: '/',
  clientId: '7bf6b66c26d840719442b09ca336977b',
  clientSecret: 'AQdvAcZvzRJpBFmNnZnwp77kRN8JZ77T',
  language: {
    default: 'uk',
    available: ['uk', 'en', 'ru', 'uz'],
    fallbacks: [{ from: 'tr', to: 'en' }],
  },
  supportWidget: {
    UA: {
      country: {
        country_code: 'UA',
        phone: '38 093 177 15 06',
        schedule: [
          { dayRange: { from: 'Monday', to: 'Friday' }, timeRange: { from: '08:00', to: '18:00' } },
          { dayRange: { from: 'Saturday' }, timeRange: { from: '10:00', to: '17:00' } },
        ],
      },
    },
    UZ: {
      capital: {
        country_code: 'UZ',
        phone: '998 78 113 99 98',
        schedule: [
          {
            dayRange: { from: 'Monday', to: 'Friday' },
            timeRange: { from: '09:00', to: '18:00' },
          },
        ],
      },
      regions: null,
    },
  },
  externalLinks: {
    registration: 'https://partnerregistrationv2.dev.uklon.net/registration',
    uklon: 'https://uklon.com.ua',
    karmaManual: 'https://uklon.com.ua/driver-update-uklon-karma/',
  },
  showCargo: true,
  rentalFleetWithdrawalEnabled: false,
  financialAuthLink: 'https://id.fondy.ua/account/login',
  sentry: {
    isActive: false,
    dsn: 'https://ddaae0e0e298dd2a3b7b6d801c990f6b@o4506744814632960.ingest.us.sentry.io/4507056728571904',
  },
  rroEnabled: true,
  notifications: {
    enableWebSockets: true,
    showNotificationCenter: true,
  },
  showFleetManager: true,
  showDriverPhotoControl: true,
  vehicleBrandingPeriodAvailableRegions: [1, 5],
  showBrandingBonusOld: true,
  showBrandingBonus: true,
  showVehiclesCommissionPrograms: true,
  vehicleBrandingVideoMaxSizeMb: 100,
  [FeatureToggle.CASH_LIMITS_REGIONS]: [1, 5],
  refinerIntegration: {
    enabled: false,
  },
  opentelemetry: {
    probabilitySampler: '0.1',
  },
} as EnvironmentModel;
