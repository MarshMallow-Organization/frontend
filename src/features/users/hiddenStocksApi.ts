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
