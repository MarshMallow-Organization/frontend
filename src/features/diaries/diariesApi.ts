import { apiFetch } from '../../lib/api';
import type {
  CreateDiaryRequest,
  CreateDiaryResponseDto,
  DeleteDiaryResponseDto,
  DiariesPageDto,
  DiaryDetailDto,
  DiaryPrefillDto,
  DiaryPreviewDto,
  TradeDto,
  TradesPageDto,
  UpdateDiaryRequest,
} from './types';

export type { DiaryPreviewDto, DiaryType } from './types';

const DIARY_PAGE_SIZE = 20;
const TRADE_PAGE_SIZE = 100;

export interface GetDiariesQuery {
  page?: number;
  size?: number;
  startDate?: string;
  endDate?: string;
  companies?: string[];
}

export function getDiaries(
  query: GetDiariesQuery,
  signal?: AbortSignal,
): Promise<DiariesPageDto> {
  const params = new URLSearchParams();
  if (query.page != null) params.set('page', String(query.page));
  if (query.size != null) params.set('size', String(query.size));
  if (query.startDate) params.set('startDate', query.startDate);
  if (query.endDate) params.set('endDate', query.endDate);
  query.companies?.forEach((company) => params.append('companies', company));

  const queryString = params.toString();
  return apiFetch<DiariesPageDto>(
    queryString ? `/diaries?${queryString}` : '/diaries',
    { signal },
  );
}

export async function getAllDiaryPreviews(
  signal?: AbortSignal,
): Promise<DiaryPreviewDto[]> {
  const items: DiaryPreviewDto[] = [];

  for (let page = 0; ; page += 1) {
    const result = await getDiaries({ page, size: DIARY_PAGE_SIZE }, signal);
    items.push(...result.items);
    if (!result.hasNext) return items;
  }
}

export async function getYearDiaries(
  year: number,
  signal?: AbortSignal,
): Promise<DiaryPreviewDto[]> {
  const items: DiaryPreviewDto[] = [];

  for (let page = 0; ; page += 1) {
    const result = await getDiaries(
      {
        page,
        size: DIARY_PAGE_SIZE,
        startDate: `${year}-01-01`,
        endDate: `${year}-12-31`,
      },
      signal,
    );
    items.push(...result.items);
    if (!result.hasNext) return items;
  }
}

export async function getAllTrades(signal?: AbortSignal): Promise<TradeDto[]> {
  const items: TradeDto[] = [];

  for (let page = 0; ; page += 1) {
    const result = await apiFetch<TradesPageDto>(
      `/trades?page=${page}&size=${TRADE_PAGE_SIZE}`,
      { signal },
    );
    items.push(...result.items);
    if (!result.hasNext) return items;
  }
}

export function getDiaryDetail(
  diaryId: number,
  signal?: AbortSignal,
): Promise<DiaryDetailDto> {
  return apiFetch<DiaryDetailDto>(`/diaries/${diaryId}`, { signal });
}

export function getDiaryPrefill(
  orderId: number,
  signal?: AbortSignal,
): Promise<DiaryPrefillDto> {
  return apiFetch<DiaryPrefillDto>(`/diaries/prefill?orderId=${orderId}`, {
    signal,
  });
}

export function createDiary(
  request: CreateDiaryRequest,
): Promise<CreateDiaryResponseDto> {
  return apiFetch<CreateDiaryResponseDto>('/diaries', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

export function updateDiary(
  diaryId: number,
  request: UpdateDiaryRequest,
): Promise<unknown> {
  return apiFetch(`/diaries/${diaryId}`, {
    method: 'PATCH',
    body: JSON.stringify(request),
  });
}

export function deleteDiary(diaryId: number): Promise<DeleteDiaryResponseDto> {
  return apiFetch<DeleteDiaryResponseDto>(`/diaries/${diaryId}`, {
    method: 'DELETE',
  });
}
