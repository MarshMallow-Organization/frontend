export type TradeType = 'BUY' | 'SELL';
export type DiaryStatus = 'PENDING' | 'COMPLETED';

export type SellReasonCode =
  'GOAL_REACHED' | 'STOP_LOSS' | 'REBALANCING' | 'PROFIT_TAKING' | 'OTHER';

export type GoalEvaluationCode =
  | 'KEPT_GOAL'
  | 'SOLD_TOO_EARLY'
  | 'SOLD_TOO_LATE'
  | 'EMOTIONAL_SELL'
  | 'AS_PLANNED'
  | 'OTHER';

export type ViewMode = 'date' | 'company';

/** trades **/
export interface Trade {
  id: number;
  externalTradeId?: string;
  tradeType: TradeType;
  corpCode?: string;
  corpName: string;
  tradedAt: string;
  price: number;
  amount: number;
  totalPrice: number;
  per?: number;
  pbr?: number;
  marketCap?: number;
  candle?: string;
  diaryStatus: DiaryStatus;
  realizedProfit?: number;
  returnRate?: number;
  currency?: string;
  stockIndex?: string;
}

/** buy_diaries **/
export interface BuyDiary {
  id: number;
  tradeId: number;
  diaryBody: string;
  goalStock?: number;
  goalHoldPeriod?: string;
  emotion?: number;
  memo?: string;
}

/** sell_diaries **/
export interface SellDiary {
  id: number;
  tradeId: number;
  sellReasonCode: SellReasonCode;
  sellReasonDetail?: string;
  goalEvaluationCode?: GoalEvaluationCode;
  goalEvaluationDetail?: string;
  emotion?: number;
  retrospectiveMemo?: string;
}

export interface TradeJournalItem extends Trade {
  buyDiary?: BuyDiary;
  sellDiary?: SellDiary;
}

/** Figma 377:2221 매도 이유 **/
export const SELL_REASON_OPTIONS: { label: string; value: SellReasonCode }[] = [
  { label: '목표 도달', value: 'GOAL_REACHED' },
  { label: '손절', value: 'STOP_LOSS' },
  { label: '리밸런싱', value: 'REBALANCING' },
  { label: '수익 실현', value: 'PROFIT_TAKING' },
  { label: '기타', value: 'OTHER' },
];

/** Figma 377:2221 목표 대비 평가 **/
export const GOAL_EVAL_OPTIONS: {
  label: string;
  value: GoalEvaluationCode;
}[] = [
  { label: '목표를 지켰다', value: 'KEPT_GOAL' },
  { label: '너무 일찍 팔았다', value: 'SOLD_TOO_EARLY' },
  { label: '늦게 팔았다', value: 'SOLD_TOO_LATE' },
  { label: '감정적으로 팔았다', value: 'EMOTIONAL_SELL' },
  { label: '계획대로였다', value: 'AS_PLANNED' },
  { label: '기타', value: 'OTHER' },
];

/** Figma 360:2125 목표 보유 기간 **/
export const HOLD_PERIOD_OPTIONS = [
  { label: '단기 (1개월 이하)', value: '단기 (1개월 이하)' },
  { label: '중기 (1~6개월)', value: '중기 (1~6개월)' },
  { label: '장기 (6개월 이상)', value: '장기 (6개월 이상)' },
  { label: '기타 (직접 입력)', value: '기타 (직접 입력)' },
];

/** Figma 464:2345 / 360:1945 기분 — 왼쪽(좋음) → 오른쪽(나쁨), value 5→1 **/
export const EMOTION_OPTIONS = [
  { value: 5, label: '완전 좋음' },
  { value: 4, label: '좋음' },
  { value: 3, label: '그냥' },
  { value: 2, label: '안좋음' },
  { value: 1, label: '최악' },
] as const;
