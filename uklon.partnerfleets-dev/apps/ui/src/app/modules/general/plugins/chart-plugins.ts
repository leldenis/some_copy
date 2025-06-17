import { PeriodLabel } from '@ui/shared/enums';
import moment from 'moment';

export interface ChartLabelConfig {
  chartType: 'line' | 'bar';
  labelFormat: string | string[];
  rangeLabel: string;
}

/* eslint-disable @typescript-eslint/no-explicit-any, no-underscore-dangle */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types
export const tooltipLine = (lineColor = '#CFD0D2') => ({
  id: 'tooltipLine',
  beforeDraw: (chart: any) => {
    if (chart.config._config.type !== 'line') return;

    if (chart?.tooltip?._active?.length > 0) {
      const { ctx, tooltip, chartArea } = chart;
      ctx.save();
      const [activePoint] = tooltip._active;
      ctx.beginPath();
      ctx.setLineDash([10, 0]);
      ctx.moveTo(activePoint.element.x, chartArea.top);
      ctx.lineTo(activePoint.element.x, chartArea.bottom);
      ctx.lineWidth = 1;
      ctx.strokeStyle = lineColor;
      ctx.stroke();
      ctx.restore();
    }
  },
});

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types
export const xScaleHighlight = (bgColor = '#33CCA1') => ({
  id: 'xScaleHighlight',
  beforeDatasetDraw: (chart: any) => {
    const {
      ctx,
      data,
      scales: { x },
    } = chart;

    chart.getDatasetMeta(0).data.forEach((datapoint: any, index: number) => {
      const labelItem = x._labelItems[index];
      const isLabelsArray = Array.isArray(labelItem?.label);
      if (!labelItem) return;

      if (datapoint.active) {
        const padding = isLabelsArray ? -5 : 4;
        const textWidth = ctx.measureText(data.labels[index]).width / 2 + padding;
        ctx.save();
        ctx.lineWidth = 2;
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.fillStyle = bgColor;
        ctx.strokeStyle = bgColor;
        ctx.moveTo(x.getPixelForValue(index) - textWidth, x.top + 8);
        ctx.lineTo(x.getPixelForValue(index) + textWidth, x.top + 8);
        ctx.lineTo(x.getPixelForValue(index) + textWidth, x.top + 40);
        ctx.lineTo(x.getPixelForValue(index) - textWidth, x.top + 40);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';

        if (isLabelsArray) {
          const heightTrashold = 14;
          for (let i = 0; i < labelItem.label.length; i += 1) {
            ctx.fillText(labelItem.label[i], x.getPixelForValue(index), x.top + 22 + heightTrashold * i);
          }
        } else {
          ctx.fillText(labelItem.label, x.getPixelForValue(index), x.top + 22);
        }

        ctx.stroke();
        ctx.restore();
      }
    });
  },
});
/* eslint-enable @typescript-eslint/no-explicit-any */

function chartLabelsConfigBasedOnDaysDiff(from: number, to: number): ChartLabelConfig {
  const diff = moment(to).diff(moment(from), 'days') + 1;
  const rangeLabel = `${moment(from).format('DD.MM')}-${moment(to).format('DD.MM')}`;

  switch (true) {
    case diff >= 46:
      return {
        chartType: 'bar',
        labelFormat: 'MMMM',
        rangeLabel,
      };
    case diff >= 8 && diff <= 45:
      return {
        chartType: 'line',
        labelFormat: 'DD.MM',
        rangeLabel,
      };
    case diff >= 1 && diff < 8:
      return {
        chartType: 'bar',
        labelFormat: ['dd', 'D.MM'],
        rangeLabel,
      };
    default:
      return {
        chartType: 'line',
        labelFormat: 'HH:mm',
        rangeLabel,
      };
  }
}

const getQuarterConfig = (): ChartLabelConfig => ({
  chartType: 'bar',
  labelFormat: 'MMMM',
  rangeLabel: 'Dashboard.Statistics.DateRangeTitle.Quarter',
});

const getWeekConfig = (period: PeriodLabel): ChartLabelConfig => ({
  chartType: 'bar',
  labelFormat: ['dd', 'D.MM'],
  rangeLabel: `Dashboard.Statistics.DateRangeTitle.${period === PeriodLabel.LAST_WEEK ? 'LastWeek' : 'CurrentWeek'}`,
});

const getMonthConfig = (from: number, locale: string): ChartLabelConfig => ({
  chartType: 'line',
  labelFormat: 'DD',
  rangeLabel: `Common.Months.${moment(from).locale(locale).month() + 1}`,
});

const getDayConfig = (period: PeriodLabel): ChartLabelConfig => ({
  chartType: 'bar',
  labelFormat: ['dd', 'D.MM'],
  rangeLabel: period,
});

export const chartLabelsConfig = (period: PeriodLabel, from: number, to: number, locale: string): ChartLabelConfig => {
  const periodConfigMap: { [key in PeriodLabel]?: () => ChartLabelConfig } = {
    [PeriodLabel.LAST_QUARTER]: getQuarterConfig,
    [PeriodLabel.CURRENT_QUARTER]: getQuarterConfig,
    [PeriodLabel.LAST_WEEK]: () => getWeekConfig(PeriodLabel.LAST_WEEK),
    [PeriodLabel.CURRENT_WEEK]: () => getWeekConfig(PeriodLabel.CURRENT_WEEK),
    [PeriodLabel.LAST_MONTH]: () => getMonthConfig(from, locale),
    [PeriodLabel.CURRENT_MONTH]: () => getMonthConfig(from, locale),
    [PeriodLabel.TODAY]: () => getDayConfig(PeriodLabel.TODAY),
    [PeriodLabel.YESTERDAY]: () => getDayConfig(PeriodLabel.YESTERDAY),
  };

  const configFn = periodConfigMap[period];

  if (configFn) {
    return configFn();
  }

  return chartLabelsConfigBasedOnDaysDiff(from, to);
};

export const tooltipLabel = (date: number, format: string | string[], locale: string): string => {
  const localeDate = moment(date * 1000).locale(locale);

  switch (format) {
    case 'HH:mm':
      return localeDate.format('DD.MM.YYYY HH:mm');
    case 'DD.MM':
    case 'DD':
      return localeDate.format('DD MMMM');
    case 'MMMM':
      return localeDate.format('MMMM YYYY');
    default:
      return localeDate.format('dddd, DD.MM.YYYY');
  }
};
