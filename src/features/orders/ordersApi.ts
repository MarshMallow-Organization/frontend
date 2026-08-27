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

export function createOrder(
  input: CreateOrderInput,
): Promise<Record<string, unknown>> {
  return apiFetch<Record<string, unknown>>('/orders', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
