import type { DiaryPreviewDto } from '../../features/diaries/diariesApi';
import type { FavoriteStockItemDto } from '../../features/users/favoriteStocksApi';
import type {
  FavoriteStockView,
  RecentOrder,
  UsageSummary,
  VirtualAccountView,
} from './types';

export const MOCK_DIARIES: DiaryPreviewDto[] = [
  {
    diaryId: 1,
    orderId: 101,
    type: 'BUY',
    date: '2026-07-28',
    corpCode: '005930',
    corpName: '삼성전자',
    quantity: 2,
    avgPrice: 296_000,
    memo: '실적 발표 전 분할 매수',
    createdAt: '2026-07-28T09:21:00+09:00',
  },
  {
    diaryId: 2,
    orderId: 102,
    type: 'SELL',
    date: '2026-07-22',
    corpCode: '000660',
    corpName: 'SK하이닉스',
    quantity: 1,
    avgPrice: 1_901_000,
    memo: '목표 수익률 도달',
    createdAt: '2026-07-22T14:12:00+09:00',
  },
  {
    diaryId: 3,
    orderId: 103,
    type: 'BUY',
    date: '2026-07-15',
    corpCode: '035420',
    corpName: 'NAVER',
    quantity: 3,
    avgPrice: 258_500,
    memo: '장기 보유 관점',
    createdAt: '2026-07-15T10:08:00+09:00',
  },
  {
    diaryId: 4,
    orderId: 104,
    type: 'SELL',
    date: '2026-07-04',
    corpCode: '005930',
    corpName: '삼성전자',
    quantity: 1,
    avgPrice: 301_000,
    memo: null,
    createdAt: '2026-07-04T11:43:00+09:00',
  },
  {
    diaryId: 5,
    orderId: 105,
    type: 'BUY',
    date: '2026-06-18',
    corpCode: '005930',
    corpName: '삼성전자',
    quantity: 1,
    avgPrice: 282_000,
    memo: '시장 흐름 확인 후 매수',
    createdAt: '2026-06-18T10:13:00+09:00',
  },
  {
    diaryId: 6,
    orderId: 106,
    type: 'SELL',
    date: '2026-04-09',
    corpCode: '035420',
    corpName: 'NAVER',
    quantity: 2,
    avgPrice: 264_500,
    memo: '일부 차익 실현',
    createdAt: '2026-04-09T13:05:00+09:00',
  },
  {
    diaryId: 7,
    orderId: 107,
    type: 'BUY',
    date: '2026-02-12',
    corpCode: '000660',
    corpName: 'SK하이닉스',
    quantity: 1,
    avgPrice: 1_745_000,
    memo: '분기 실적 기대 매수',
    createdAt: '2026-02-12T09:42:00+09:00',
  },
  {
    diaryId: 8,
    orderId: 108,
    type: 'BUY',
    date: '2026-02-03',
    corpCode: '005930',
    corpName: '삼성전자',
    quantity: 1,
    avgPrice: 271_000,
    memo: '분할 매수 시작',
    createdAt: '2026-02-03T11:17:00+09:00',
  },
];

export const MOCK_FAVORITE_STOCKS: FavoriteStockItemDto[] = [
  {
    id: 1,
    stockCode: '000660',
    stockName: 'SK하이닉스',
    market: null,
    createdAt: '2026-07-10T09:00:00+09:00',
  },
  {
    id: 2,
    stockCode: '005930',
    stockName: '삼성전자',
    market: null,
    createdAt: '2026-07-11T09:00:00+09:00',
  },
];

export const FAVORITE_STOCK_DECORATION: Record<
  string,
  Pick<FavoriteStockView, 'currentPrice' | 'industry' | 'accent'>
> = {
  '000660': {
    currentPrice: 1_901_000,
    industry: '종합 반도체',
    accent: '#FF525B',
  },
  '005930': {
    currentPrice: 296_000,
    industry: '종합 반도체',
    accent: '#4269AA',
  },
};

export const MOCK_VIRTUAL_ACCOUNTS: VirtualAccountView[] = [
  {
    id: 1,
    name: '안정형 투자',
    balance: 10_445_681,
    category: '저축예금 · 신한은행',
    accent: '#4E7CFF',
  },
  {
    id: 2,
    name: '성장형 투자',
    balance: 10_445_681,
    category: '저축예금',
    accent: '#FF8473',
  },
  {
    id: 3,
    name: '배당형 투자',
    balance: 10_445_681,
    category: '저축예금',
    accent: '#2FC4D1',
  },
  {
    id: 4,
    name: '단기 투자',
    balance: 10_445_681,
    category: '저축예금',
    accent: '#A978E7',
  },
];

export const MOCK_USAGE_SUMMARY: UsageSummary = {
  visitsToday: 3,
  visitsTotal: 30_500,
  tradesToday: 2,
  tradesTotal: 640,
};

export const MOCK_RECENT_ORDERS: RecentOrder[] = [
  {
    id: 'mock-order-1',
    type: 'BUY',
    occurredAt: '2026-07-28T09:21:00+09:00',
    corpName: '삼성전자',
    stockCode: '005930',
    quantity: 2,
    price: 296_000,
    total: 592_000,
  },
  {
    id: 'mock-order-2',
    type: 'SELL',
    occurredAt: '2026-07-22T14:12:00+09:00',
    corpName: 'SK하이닉스',
    stockCode: '000660',
    quantity: 1,
    price: 1_901_000,
    total: 1_901_000,
  },
  {
    id: 'mock-order-3',
    type: 'BUY',
    occurredAt: '2026-07-15T10:08:00+09:00',
    corpName: 'NAVER',
    stockCode: '035420',
    quantity: 3,
    price: 258_500,
    total: 775_500,
  },
];
