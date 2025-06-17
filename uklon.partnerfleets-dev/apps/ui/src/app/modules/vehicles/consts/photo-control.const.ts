import { TicketStatus } from '@constant';
import { PanelColor } from '@ui/shared/modules/info-panel/components/info-panel/info-panel.component';

export interface PanelStyling {
  bgColor: string;
  borderColor: string;
  textColor: string;
  iconColor: string;
  color: PanelColor;
}

export const PHOTO_CONTROL_STATUS_STYLING: Record<string, PanelStyling> = {
  [TicketStatus.REJECTED]: {
    bgColor: 'tw-bg-red-50',
    borderColor: 'tw-border-accent-coral-light',
    textColor: 'tw-text-accent-coral-light',
    iconColor: 'tw-text-accent-coral-light',
    color: 'error',
  },
  [TicketStatus.DRAFT]: {
    bgColor: 'tw-bg-[#FFF7DC]',
    borderColor: 'tw-border-[#EDB913]',
    textColor: 'tw-text-[#845700]',
    iconColor: 'tw-text-[#EDB913]',
    color: 'warn',
  },
  [TicketStatus.REVIEW]: {
    bgColor: 'tw-bg-[#E5F6F9]',
    borderColor: 'tw-border-accent-blue-light',
    textColor: 'tw-text-accent-blue-light',
    iconColor: 'tw-text-accent-blue-light',
    color: 'accent',
  },
  [TicketStatus.BLOCKED_BY_MANAGER]: {
    bgColor: 'tw-bg-[#E5F6F9]',
    borderColor: 'tw-border-accent-blue-light',
    textColor: 'tw-text-accent-blue-light',
    iconColor: 'tw-text-accent-blue-light',
    color: 'accent',
  },
  [TicketStatus.SENT]: {
    bgColor: 'tw-bg-[#E5F6F9]',
    borderColor: 'tw-border-accent-blue-light',
    textColor: 'tw-text-accent-blue-light',
    iconColor: 'tw-text-accent-blue-light',
    color: 'accent',
  },
};
