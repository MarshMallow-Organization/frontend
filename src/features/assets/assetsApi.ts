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

/**
 * GET /assets/portfolios 응답 (Notion "assets | 자산현황 · 가상계좌 목록 조회" 명세,
 * 2026-08-24 기준). 목록 조회는 계좌 기본 정보만 내려주고 holdings(보유 종목)는
 * 포함하지 않는다 — 종목이 필요하면 "특정 가상계좌 조회" API를 따로 써야 한다.
 */
export interface VirtualAccountListResponse {
  portfolios: VirtualAccount[];
  /** 사용자가 생성 가능한 가상계좌 최대 개수. */
  maxCount: number;
}

const MOCK_VIRTUAL_ACCOUNTS: VirtualAccount[] = [
  {
    id: 12,
    name: '안전형 투자',
    sortOrder: 1,
    createdAt: '2026-07-23T09:00:00Z',
  },
  {
    id: 13,
    name: '공격형 투자',
    sortOrder: 2,
    createdAt: '2026-07-23T09:00:00Z',
  },
];

const MOCK_PORTFOLIO_MAX_COUNT = 4;

export async function getVirtualAccounts(): Promise<VirtualAccountListResponse> {
  if (USE_ASSETS_MOCK) {
    return Promise.resolve({
      portfolios: MOCK_VIRTUAL_ACCOUNTS,
      maxCount: MOCK_PORTFOLIO_MAX_COUNT,
    });
  }
  return apiFetch<VirtualAccountListResponse>(VIRTUAL_ACCOUNTS_PATH);
}
