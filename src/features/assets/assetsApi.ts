import { apiFetch } from '../../lib/api';

const mockFlag: unknown = import.meta.env.VITE_USE_ASSETS_MOCK;
const USE_ASSETS_MOCK =
  (typeof mockFlag === 'string' ? mockFlag : 'true').toLowerCase() === 'true';

/**
 * POST /assets/portfolios 응답 (Notion "assets | 자산현황 · 가상계좌 생성" 명세,
 * 2026-08-24 기준). name 중복·가상계좌 4개 초과 시 409, 필수값 누락 시 400으로
 * 백엔드가 검증한다 — 프런트는 ApiError.message를 그대로 사용자에게 보여준다.
 */
export interface VirtualAccount {
  id: number;
  name: string;
  sortOrder: number;
  createdAt: string;
}

const VIRTUAL_ACCOUNTS_PATH = '/assets/portfolios';

let mockVirtualAccountSeq = 1000;

export async function createVirtualAccount(
  name: string,
): Promise<VirtualAccount> {
  if (USE_ASSETS_MOCK) {
    mockVirtualAccountSeq += 1;
    return Promise.resolve({
      id: mockVirtualAccountSeq,
      name,
      sortOrder: mockVirtualAccountSeq,
      createdAt: new Date().toISOString(),
    });
  }
  return apiFetch<VirtualAccount>(VIRTUAL_ACCOUNTS_PATH, {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
}
