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

/**
 * GET /assets/portfolios/{portfolioId} 응답 (Notion "assets | 자산현황 · 특정
 * 가상계좌 조회" 명세, 2026-08-24 기준).
 *
 * ⚠️ 백엔드 미구현: `portfolios.controller.ts`에는 GET(':portfolioId') 핸들러가
 * 없다 (목록 조회 GET()만 있음) — holdings·totalReturnRate를 담은 응답 DTO도
 * 없다. 이 함수는 지금 항상 mock을 반환하며, 백엔드에 엔드포인트가 생기면
 * USE_ASSETS_MOCK을 끄고 그대로 실 API를 타게 된다.
 */
export interface VirtualAccountHolding {
  stockCode: string;
  stockName: string;
  quantity: number;
  avgBuyPrice: number;
  currentPrice: number;
  evaluationAmount: number;
  unrealizedProfit: number;
  /** 퍼센트 값 그대로 (예: 6.62 = 6.62%). AssetSummary의 rate 필드(분수)와 단위가 다르다. */
  returnRate: number;
}

export interface VirtualAccountDetail extends VirtualAccount {
  totalReturnRate: number;
  holdings: VirtualAccountHolding[];
}

// 목업: Notion 명세의 Success Response 예시(id 12)를 그대로 사용. 그 외 id는
// 문서에 예시가 없어 "종목 없음" 빈 상태로 둔다.
const MOCK_VIRTUAL_ACCOUNT_DETAILS: Record<number, VirtualAccountDetail> = {
  12: {
    id: 12,
    name: '안전형 투자',
    sortOrder: 1,
    createdAt: '2026-07-23T09:00:00Z',
    totalReturnRate: 8.12,
    holdings: [
      {
        stockCode: '005930',
        stockName: '삼성전자',
        quantity: 30,
        avgBuyPrice: 68_000,
        currentPrice: 72_500,
        evaluationAmount: 2_175_000,
        unrealizedProfit: 135_000,
        returnRate: 6.62,
      },
    ],
  },
};

export async function getVirtualAccountDetail(
  portfolioId: number,
): Promise<VirtualAccountDetail> {
  if (USE_ASSETS_MOCK) {
    const found = MOCK_VIRTUAL_ACCOUNT_DETAILS[portfolioId];
    if (found) return Promise.resolve(found);

    const listed = MOCK_VIRTUAL_ACCOUNTS.find((a) => a.id === portfolioId);
    return Promise.resolve({
      id: portfolioId,
      name: listed?.name ?? '가상계좌',
      sortOrder: listed?.sortOrder ?? 0,
      createdAt: listed?.createdAt ?? new Date().toISOString(),
      totalReturnRate: 0,
      holdings: [],
    });
  }
  return apiFetch<VirtualAccountDetail>(
    `${VIRTUAL_ACCOUNTS_PATH}/${portfolioId}`,
  );
}
