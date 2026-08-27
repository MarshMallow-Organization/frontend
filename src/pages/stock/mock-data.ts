export type StockPeriod = 'day' | 'week' | 'month' | 'year';

export interface FinancialMetric {
  id: string;
  label: string;
  value: string;
  status: string;
  tone: 'blue' | 'green' | 'orange' | 'purple';
}

/** Swagger에 시세·재무·뉴스 계약이 없어 Figma 모양만 유지하는 표시 전용 값. */
export const STOCK_DETAIL_PRESENTATION = {
  periods: [
    { id: 'day', label: '일' },
    { id: 'week', label: '주' },
    { id: 'month', label: '월' },
    { id: 'year', label: '년' },
  ] satisfies Array<{ id: StockPeriod; label: string }>,
  financialMetrics: [
    {
      id: 'debt-ratio',
      label: '부채비율',
      value: '0.00%',
      status: '무차입',
      tone: 'blue',
    },
    {
      id: 'current-ratio',
      label: '유동비율',
      value: '478.25%',
      status: '여유',
      tone: 'green',
    },
    {
      id: 'interest-coverage',
      label: '이자보상배율',
      value: '약 685배',
      status: '안전',
      tone: 'green',
    },
    {
      id: 'pbr',
      label: 'PBR (주가순자산비율)',
      value: '60.76%',
      status: '우수',
      tone: 'green',
    },
    {
      id: 'per',
      label: 'PER (주가수익비율)',
      value: '약 60배',
      status: '다소 높음',
      tone: 'orange',
    },
    {
      id: 'market-cap',
      label: '시가총액',
      value: '$258.1B',
      status: '대형',
      tone: 'purple',
    },
  ] satisfies FinancialMetric[],
} as const;
