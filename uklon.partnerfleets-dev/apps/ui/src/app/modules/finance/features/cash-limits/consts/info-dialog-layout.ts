interface CashLimitsDialogSection {
  title: string;
  indexed?: boolean;
  articles: {
    title: string;
    message: string;
    infoPanelMessage?: string;
  }[];
}

export const INFO_DIALOG_LAYOUT: CashLimitsDialogSection[] = [
  {
    title: 'CashLimits.InfoDialog.SettingsTitle',
    indexed: true,
    articles: [
      {
        title: 'CashLimits.InfoDialog.Section.PeriodSelection.Title',
        message: 'CashLimits.InfoDialog.Section.PeriodSelection.Message',
        infoPanelMessage: 'CashLimits.InfoDialog.Section.PeriodSelection.InfoPanelMessage',
      },
      {
        title: 'CashLimits.InfoDialog.Section.LimitSelection.Title',
        message: 'CashLimits.InfoDialog.Section.LimitSelection.Message',
      },
      {
        title: 'CashLimits.InfoDialog.Section.SaveSettings.Title',
        message: 'CashLimits.InfoDialog.Section.SaveSettings.Message',
        infoPanelMessage: 'CashLimits.InfoDialog.Section.SaveSettings.InfoPanelMessage',
      },
    ],
  },
  {
    title: 'CashLimits.InfoDialog.LimitsTitle',
    articles: [
      {
        title: 'CashLimits.InfoDialog.Section.LimitsEditing.Title',
        message: 'CashLimits.InfoDialog.Section.LimitsEditing.Message',
      },
      {
        title: 'CashLimits.InfoDialog.Section.CashBlocking.Title',
        message: 'CashLimits.InfoDialog.Section.CashBlocking.Message',
      },
    ],
  },
];
