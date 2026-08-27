import { apiFetch } from '../../lib/api';

export interface PortfolioSummaryDto {
  id: number;
  name: string;
  sortOrder: number;
  createdAt: string;
}

interface PortfolioListResponseDto {
  portfolios: PortfolioSummaryDto[];
  maxCount: number;
}

export async function getPortfolios(
  signal?: AbortSignal,
): Promise<PortfolioListResponseDto> {
  return apiFetch<PortfolioListResponseDto>('/assets/portfolios', { signal });
}
