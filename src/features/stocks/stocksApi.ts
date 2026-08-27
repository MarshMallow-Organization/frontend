import { apiFetch } from '../../lib/api';

export interface VisibleStockDto {
  symbol: string;
  name: string;
  isHidden: false;
}

export interface HiddenStockDto {
  symbol: string;
  name: string;
  isHidden: true;
  message: string;
  hiddenUntil: string;
}

export type StockDto = VisibleStockDto | HiddenStockDto;

export function getStock(
  stockCode: string,
  signal?: AbortSignal,
): Promise<StockDto> {
  return apiFetch<StockDto>(`/stocks/${encodeURIComponent(stockCode)}`, {
    signal,
  });
}
