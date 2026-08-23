import { apiFetch } from '../../lib/api';
import type {
  CreateDiaryRequest,
  CreateDiaryResponseDto,
  DeleteDiaryResponseDto,
  DiariesPageDto,
  DiaryDetailDto,
  DiaryPrefillDto,
  TradeDto,
  TradesPageDto,
  UpdateDiaryRequest,
} from './types';

const DIARY_PAGE_SIZE = 20;
const TRADE_PAGE_SIZE = 100;

export async function getAllDiaryPreviews(
  signal?: AbortSignal,
): Promise<DiariesPageDto['items']> {
  const items: DiariesPageDto['items'] = [];

  for (let page = 0; ; page += 1) {
    const result = await apiFetch<DiariesPageDto>(
      `/diaries?page=${page}&size=${DIARY_PAGE_SIZE}`,
      { signal },
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
