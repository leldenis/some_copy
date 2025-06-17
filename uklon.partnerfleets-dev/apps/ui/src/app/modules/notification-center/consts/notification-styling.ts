import { NotificationImportance, NotificationType } from '@data-access';

export interface CustomNotificationStyling {
  backgroundColor: string;
  mainColor: string;
  textColor: string;
  icon: string;
}

export const NOTIFICATION_BORDER: Record<NotificationImportance, string> = {
  Unspecified: '',
  Normal: 'tw-bg-accent-mint-light',
  High: 'tw-bg-[#EEBA14]',
  Critical: 'tw-bg-accent-coral-light',
} as const;

export const CUSTOM_NOTIFICATION_STYLING: Partial<Record<NotificationType, CustomNotificationStyling>> = {
  FleetCabinetUpdate: {
    backgroundColor: 'tw-bg-[#F5FCFA]',
    mainColor: 'tw-bg-[#33CCA1]',
    textColor: 'tw-text-[#1F9977]',
    icon: 'info',
  },
  ImportantInformation: {
    backgroundColor: 'tw-bg-[#EDFCFF]',
    mainColor: 'tw-bg-[#1BB0CE]',
    textColor: 'tw-text-[#1BB0CE]',
    icon: 'error',
  },
  AcceptanceRequired: {
    backgroundColor: 'tw-bg-[#FFF7DC]',
    mainColor: 'tw-bg-[#F99B58]',
    textColor: 'tw-text-[#F99B58]',
    icon: 'warning',
  },
} as const;
