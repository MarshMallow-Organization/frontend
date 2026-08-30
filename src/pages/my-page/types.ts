import type { FavoriteStockItemDto } from '../../features/users/favoriteStocksApi';

export interface VirtualAccountView {
  id: number;
  name: string;
  balance: number;
  category: string;
  accent: string;
}

export interface FavoriteStockView extends FavoriteStockItemDto {
  currentPrice: number | null;
  industry: string | null;
  accent: string;
}

export interface UsageSummary {
  visitsToday: number;
  visitsTotal: number;
  tradesToday: number;
  tradesTotal: number;
}

export interface RecentOrder {
  id: string;
  type: 'BUY' | 'SELL';
  occurredAt: string;
  corpName: string;
  stockCode: string;
  quantity: number;
  price: number;
  total: number;
}

export type DataSource = 'api' | 'mock-fallback';

export interface MyPageSources {
  diaries: DataSource;
  favorites: DataSource;
  portfolios: DataSource;
}
