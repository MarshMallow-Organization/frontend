import type {
  DiaryType,
  GoalEvaluationCode,
  GoalHoldPeriod,
  SellReasonCode,
} from '../../features/diaries/types';

export type {
  BuyDiary,
  DiaryStatus,
  EmotionScore,
  GoalEvaluationCode,
  GoalHoldPeriod,
  SellDiary,
  SellReasonCode,
  TradeJournalItem,
} from '../../features/diaries/types';

export type TradeType = DiaryType;

export type ViewMode = 'date' | 'company';

/** trades **/
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
  { label: '단기 (1개월 이하)', value: 'SHORT_TERM' },
  { label: '중기 (1~6개월)', value: 'MID_TERM' },
  { label: '장기 (6개월 이상)', value: 'LONG_TERM' },
  { label: '기타 (직접 입력)', value: 'CUSTOM' },
] as const satisfies readonly { label: string; value: GoalHoldPeriod }[];

/** 백엔드 계약: 1=완전 좋음 → 5=최악 **/
export const EMOTION_OPTIONS = [
  { value: 1, label: '완전 좋음' },
  { value: 2, label: '좋음' },
  { value: 3, label: '그냥' },
  { value: 4, label: '안좋음' },
  { value: 5, label: '최악' },
] as const;
