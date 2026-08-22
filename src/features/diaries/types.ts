export type DiaryType = 'BUY' | 'SELL';
export type DiaryStatus = 'PENDING' | 'COMPLETED';
export type EmotionScore = 1 | 2 | 3 | 4 | 5;
export type GoalHoldPeriod = 'SHORT_TERM' | 'MID_TERM' | 'LONG_TERM' | 'CUSTOM';

export type SellReasonCode =
  'GOAL_REACHED' | 'STOP_LOSS' | 'REBALANCING' | 'PROFIT_TAKING' | 'OTHER';

export type GoalEvaluationCode =
  | 'KEPT_GOAL'
  | 'SOLD_TOO_EARLY'
  | 'SOLD_TOO_LATE'
  | 'EMOTIONAL_SELL'
  | 'AS_PLANNED'
  | 'OTHER';

export interface BuyDiary {
  id: number;
  orderId: number;
  buyReason: string;
  goalPrice?: number;
  goalHoldPeriod?: GoalHoldPeriod;
  customGoalHoldPeriod?: string;
  emotion: EmotionScore;
  memo?: string;
}

export interface SellDiary {
  id: number;
  orderId: number;
  sellReasonCode: SellReasonCode;
  sellReasonDetail?: string;
  goalEvaluationCode?: GoalEvaluationCode;
  goalEvaluationDetail?: string;
  emotion: EmotionScore;
  memo?: string;
}

/** 매매일지 화면에서 사용하는 서버 데이터 기반 모델. `id`는 안정적인 orderId다. */
export interface TradeJournalItem {
  id: number;
  orderId: number;
  diaryId?: number;
  diaryDate: string;
  tradeType: DiaryType;
  corpCode: string;
  corpName: string;
  tradedAt: string;
  price?: number;
  amount: number;
  totalPrice?: number;
  per?: number;
  pbr?: number;
  marketCap?: number;
  candle?: string;
  diaryStatus: DiaryStatus;
  realizedProfit?: number;
  returnRate?: number;
  previewMemo?: string;
  hydrated: boolean;
  buyDiary?: BuyDiary;
  sellDiary?: SellDiary;
}

export interface DiaryPreviewDto {
  diaryId: number;
  orderId: number;
  type: DiaryType;
  date: string;
  corpCode: string;
  corpName: string;
  avgPrice: number | null;
  quantity: number;
  memo: string | null;
  createdAt: string;
}

export interface DiariesPageDto {
  items: DiaryPreviewDto[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

interface DiaryDetailBaseDto {
  diaryId: number;
  orderId: number;
  type: DiaryType;
  date: string;
  corpCode: string;
  corpName: string;
  orderedAt: string;
  quantity: number;
  perAtOrder: number | null;
  pbrAtOrder: number | null;
  marketCapAtOrder: number | null;
  candleChartAtUrl: string | null;
  emotion: number;
  memo: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BuyDiaryDetailDto extends DiaryDetailBaseDto {
  type: 'BUY';
  price: number | null;
  totalAmount: number | null;
  buyReason: string;
  goalPrice: number | null;
  goalHoldPeriod: GoalHoldPeriod | null;
  /** 백엔드 상세 DTO 보완 전까지 선택 필드로 수용한다. */
  customGoalHoldPeriod?: string | null;
}

export interface SellDiaryDetailDto extends DiaryDetailBaseDto {
  type: 'SELL';
  averagePrice: number | null;
  sellPrice: number | null;
  totalBuyAmount: number | null;
  totalSellAmount: number | null;
  realizedProfit: number | null;
  returnRate: number | null;
  sellReasonCode: SellReasonCode;
  sellReasonDetail: string | null;
  goalEvaluationCode: GoalEvaluationCode | null;
  goalEvaluationDetail: string | null;
}

export type DiaryDetailDto = BuyDiaryDetailDto | SellDiaryDetailDto;

interface DiaryPrefillBaseDto {
  orderId: number;
  type: DiaryType;
  corpCode: string;
  corpName: string;
  orderedAt: string;
  quantity: number;
  perAtOrder: number | null;
  pbrAtOrder: number | null;
  marketCapAtOrder: number | null;
  candleChartAtUrl: string | null;
}

export interface BuyDiaryPrefillDto extends DiaryPrefillBaseDto {
  type: 'BUY';
  price: number | null;
  totalAmount: number | null;
}

export interface SellDiaryPrefillDto extends DiaryPrefillBaseDto {
  type: 'SELL';
  buyPrice: number | null;
  sellPrice: number | null;
  totalBuyAmount: number | null;
  totalSellAmount: number | null;
  realizedProfit: number | null;
  returnRate: number | null;
}

export type DiaryPrefillDto = BuyDiaryPrefillDto | SellDiaryPrefillDto;

export interface TradeDto {
  id: string;
  externalTradeId: string;
  tradeType: DiaryType;
  corpCode: string;
  corpName: string;
  tradedAt: string;
  price: number;
  quantity: number;
  totalPrice: number;
  realizedProfit: number | null;
  returnRate: number | null;
  currenciesId: number;
  ordersId: number;
  createdAt: string;
}

export interface TradesPageDto {
  items: TradeDto[];
  totalCount: number;
  page: number;
  size: number;
  totalPages: number;
  hasNext: boolean;
}

export interface CreateDiaryResponseDto {
  diaryId: number;
  orderId: number;
  type: DiaryType;
  date: string;
  createdAt: string;
}

export interface DeleteDiaryResponseDto {
  diaryId: number;
  deleted: true;
  deletedAt: string;
}

interface DiaryWriteBase {
  orderId: number;
  date: string;
  emotion: EmotionScore;
  memo?: string;
}

export interface CreateBuyDiaryRequest extends DiaryWriteBase {
  type: 'BUY';
  buyReason: string;
  goalPrice?: number;
  goalHoldPeriod?: GoalHoldPeriod;
  customGoalHoldPeriod?: string;
}

export interface CreateSellDiaryRequest extends DiaryWriteBase {
  type: 'SELL';
  sellReasonCode: SellReasonCode;
  sellReasonDetail?: string;
  goalEvaluationCode?: GoalEvaluationCode;
  goalEvaluationDetail?: string;
}

export type CreateDiaryRequest = CreateBuyDiaryRequest | CreateSellDiaryRequest;

interface UpdateDiaryBaseRequest {
  date?: string;
  emotion?: EmotionScore;
  memo?: string | null;
}

export interface UpdateBuyDiaryRequest extends UpdateDiaryBaseRequest {
  buyReason?: string;
  goalPrice?: number | null;
  goalHoldPeriod?: GoalHoldPeriod | null;
  customGoalHoldPeriod?: string | null;
}

export interface UpdateSellDiaryRequest extends UpdateDiaryBaseRequest {
  sellReasonCode?: SellReasonCode;
  sellReasonDetail?: string | null;
  goalEvaluationCode?: GoalEvaluationCode | null;
  goalEvaluationDetail?: string | null;
}

export type UpdateDiaryRequest = UpdateBuyDiaryRequest | UpdateSellDiaryRequest;
