import { apiFetch } from '../../lib/api';

export interface HiddenStockResultDto {
  stockCode: string;
  stockName: string;
  hiddenAt: string;
  hiddenUntil: string;
}

export function hideStock(
  stockCode: string,
  hiddenUntil: string,
): Promise<HiddenStockResultDto> {
  return apiFetch<HiddenStockResultDto>('/users/me/hidden-stocks', {
    method: 'POST',
    body: JSON.stringify({ stockCode, hiddenUntil }),
  });
}

/**
 * GET /users/me/hidden-stocks 응답 (Notion "API 명세서 · 숨긴종목 목록 조회" 기준,
 * 2026-08-30 확인). hiddenUntil이 지난 항목은 백엔드가 자동으로 제외한다.
 */
export interface HiddenStockListResponse {
  hiddenStocks: HiddenStockResultDto[];
}

export function getHiddenStocks(
  signal?: AbortSignal,
): Promise<HiddenStockListResponse> {
  return apiFetch<HiddenStockListResponse>('/users/me/hidden-stocks', {
    signal,
  });
}
