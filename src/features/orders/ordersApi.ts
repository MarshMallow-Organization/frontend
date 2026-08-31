import { apiFetch } from '../../lib/api';

export type OrderType = 'MARKET' | 'LIMIT';
export type OrderCategory = 'GENERAL' | 'CONDITIONAL';
export type TradeType = 'BUY' | 'SELL';

export interface CreateOrderInput {
  orderType: OrderType;
  orderCategory: OrderCategory;
  tradeType: TradeType;
  corpCode: string;
  corpName: string;
  currenciesId: number;
  quantity?: number;
  price?: number;
  orderCondition?: {
    triggerPrice: number;
    expiredAt: string;
  };
}

/** 호가창 한 호가 (가격/잔량). 실시간 시세는 추후 domain/api 연동 (backend PR #101). */
export interface OrderBookLevel {
  price: number;
  quantity: number;
}

/** 호가창 데이터 — 매도(asks)·매수(bids) 각각 고가→저가 순, 현재가 포함. */
export interface OrderBook {
  asks: OrderBookLevel[];
  bids: OrderBookLevel[];
  currentPrice: number;
}

/** 주문 내역 한 건 (지정가 거래 좌측 패널). */
export interface OrderHistoryEntry {
  id: string;
  tradeType: TradeType;
  corpName: string;
  corpCode: string;
  price: number;
  quantity: number;
  amount: number;
  /** ISO 문자열 */
  orderedAt: string;
}

/** 보유/주문 가능 수량 요약. */
export interface HoldingSummary {
  sellable: number;
  buyable: number;
  owned: number;
}

export function createOrder(
  input: CreateOrderInput,
): Promise<Record<string, unknown>> {
  return apiFetch<Record<string, unknown>>('/orders', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
