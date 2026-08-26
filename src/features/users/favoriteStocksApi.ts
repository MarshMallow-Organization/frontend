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

export interface FavoriteStockStatusDto {
  isFavorite: boolean;
  favoriteStock: FavoriteStockItemDto | null;
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

export function getFavoriteStockStatus(
  stockCode: string,
  signal?: AbortSignal,
): Promise<FavoriteStockStatusDto> {
  return apiFetch<FavoriteStockStatusDto>(
    `/users/me/favorite-stocks/${encodeURIComponent(stockCode)}`,
    { signal },
  );
}

export function createFavoriteStock(
  stockCode: string,
  stockName: string,
): Promise<FavoriteStockItemDto> {
  return apiFetch<FavoriteStockItemDto>('/users/me/favorite-stocks', {
    method: 'POST',
    body: JSON.stringify({ stockCode, stockName }),
  });
}
