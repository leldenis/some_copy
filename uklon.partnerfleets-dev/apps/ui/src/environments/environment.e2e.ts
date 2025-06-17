import { EnvironmentModel } from '@ui-env/environment.model';

export const environment: EnvironmentModel = {
  production: true,
  gateway: '/',
  clientId: '7bf6b66c26d840719442b09ca336977b',
  clientSecret: 'AQdvAcZvzRJpBFmNnZnwp77kRN8JZ77T',
  analytic: {
    isActive: false,
    googleTagManagerId: '',
  },
  language: {
    default: 'uk',
    available: ['uk', 'en', 'az', 'ru'],
    fallbacks: [{ from: 'tr', to: 'az' }],
  },
  supportWidget: {
    UA: {
      capital: {
        country_code: 'UA',
        phone: '38 093 177 15 17',
        schedule: [
          { dayRange: { from: 'Monday', to: 'Friday' }, timeRange: { from: '08:00', to: '18:00' } },
          { dayRange: { from: 'Saturday' }, timeRange: { from: '09:00', to: '17:00' } },
        ],
      },
      regions: {
        phone: '38 093 177 15 06',
        schedule: [{ dayRange: { from: 'Monday', to: 'Sunday' }, timeRange: { from: '09:00', to: '18:00' } }],
      },
    },
    AZ: {
      capital: {
        country_code: 'AZ',
        phone: '99 412 526 57 02',
        schedule: [
          {
            dayRange: { from: 'Monday', to: 'Friday' },
            timeRange: { from: '08:00', to: '18:00' },
          },
        ],
      },
      regions: null,
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
  showCargo: false,
  rentalFleetWithdrawalEnabled: false,
  financialAuthLink: 'https://id.fondy.ua/account/login',
  sentry: {
    isActive: false,
    dsn: '',
  },
  rroEnabled: false,
  notifications: {
    enableWebSockets: false,
    showNotificationCenter: true,
  },
  showFleetManager: true,
  showDriverPhotoControl: true,
  vehicleBrandingPeriodAvailableRegions: [1, 5],
  showBrandingBonusOld: true,
  showBrandingBonus: true,
  showVehiclesCommissionPrograms: true,
  vehicleBrandingVideoMaxSizeMb: 100,
  refinerIntegration: {
    enabled: false,
  },
  opentelemetry: {
    probabilitySampler: '0.1',
  },
} as EnvironmentModel;
