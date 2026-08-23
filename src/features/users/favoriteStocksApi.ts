import { apiFetch } from '../../lib/api';

export interface FavoriteStockItemDto {
  id: number;
  stockCode: string;
  stockName: string;
  market: string | null;
  createdAt: string;
}

interface FavoriteStockListResponseDto {
  favoriteStocks: FavoriteStockItemDto[];
}

export async function getFavoriteStocks(
  signal?: AbortSignal,
): Promise<FavoriteStockItemDto[]> {
  const response = await apiFetch<FavoriteStockListResponseDto>(
    '/users/me/favorite-stocks',
    { signal },
  );
  return response.favoriteStocks;
}

export async function removeFavoriteStock(stockCode: string): Promise<void> {
  await apiFetch<unknown>(
    `/users/me/favorite-stocks/${encodeURIComponent(stockCode)}`,
    { method: 'DELETE' },
  );
}
