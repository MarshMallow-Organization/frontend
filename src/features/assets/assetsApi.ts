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
    const account: VirtualAccount = {
      id: mockVirtualAccountSeq,
      name,
      sortOrder: mockVirtualAccountSeq,
      createdAt: new Date().toISOString(),
    };
    // 목록에 실제로 반영해야 다른 화면(홈 화면 등)에서 다시 조회했을 때 보인다.
    MOCK_VIRTUAL_ACCOUNTS.push(account);
    return Promise.resolve(account);
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

// 목업: 계좌를 만들기 전엔 목록이 비어 있어야 하므로 빈 배열로 시작한다.
const MOCK_VIRTUAL_ACCOUNTS: VirtualAccount[] = [];

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
 * backend/src/domains/assets/controllers/portfolios.controller.ts의
 * findPortfolioDetail에 실제로 구현돼 있다 — 계좌에 등록된 종목을 실제
 * 보유 데이터(HoldingsProvider)와 대조해 1주 이상 보유 중인 것만 골라
 * 평가금액·손익·수익률을 계산해 내려준다. USE_ASSETS_MOCK을 끄면 이
 * 실 API를 탄다.
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

export async function getVirtualAccountDetail(
  portfolioId: number,
): Promise<VirtualAccountDetail> {
  if (USE_ASSETS_MOCK) {
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

/**
 * PATCH /assets/portfolios/{portfolioId} 응답 (Notion "assets | 자산현황 · 가상계좌
 * 이름 변경" 명세, 2026-08-24 기준). 이름 중복 시 409, 필수값 누락 시 400,
 * 존재하지 않는 계좌면 404로 백엔드가 검증한다 — backend/src/domains/assets/
 * controllers/portfolios.controller.ts에 실제로 구현돼 있다.
 */
export interface VirtualAccountNameUpdate {
  id: number;
  name: string;
  updatedAt: string;
}

export async function renameVirtualAccount(
  portfolioId: number,
  name: string,
): Promise<VirtualAccountNameUpdate> {
  if (USE_ASSETS_MOCK) {
    const account = MOCK_VIRTUAL_ACCOUNTS.find((a) => a.id === portfolioId);
    if (account) account.name = name;
    return Promise.resolve({
      id: portfolioId,
      name,
      updatedAt: new Date().toISOString(),
    });
  }
  return apiFetch<VirtualAccountNameUpdate>(
    `${VIRTUAL_ACCOUNTS_PATH}/${portfolioId}`,
    {
      method: 'PATCH',
      body: JSON.stringify({ name }),
    },
  );
}

/**
 * DELETE /assets/portfolios/{portfolioId} 응답 (Notion "assets | 자산현황 · 가상계좌
 * 삭제" 명세, 2026-08-24 기준). 계좌에 담긴 종목 등록 정보(virtual_portfolio_stocks)도
 * 함께 삭제되지만 거래 기록(trades)은 영향받지 않는다 — 백엔드에 실제로 구현돼 있다.
 */
export interface VirtualAccountDeleted {
  id: number;
  deleted: boolean;
}

export async function deleteVirtualAccount(
  portfolioId: number,
): Promise<VirtualAccountDeleted> {
  if (USE_ASSETS_MOCK) {
    const index = MOCK_VIRTUAL_ACCOUNTS.findIndex((a) => a.id === portfolioId);
    if (index !== -1) MOCK_VIRTUAL_ACCOUNTS.splice(index, 1);
    return Promise.resolve({ id: portfolioId, deleted: true });
  }
  return apiFetch<VirtualAccountDeleted>(
    `${VIRTUAL_ACCOUNTS_PATH}/${portfolioId}`,
    { method: 'DELETE' },
  );
}

/**
 * 홈 화면 "자산 현황" 카드용 — 가상계좌 4개 각각의 총자산(보유 종목 평가금액 합)과
 * 트리맵에 쓸 보유 종목 원본. 백엔드가 계좌별 총자산을 한 번에 내려주는 API가 없어,
 * 목록 조회 후 계좌마다 상세 조회(getVirtualAccountDetail)를 병렬로 호출해
 * holdings.evaluationAmount를 프런트에서 합산한다.
 */
export interface VirtualAccountAssetSummary {
  id: number;
  name: string;
  totalAsset: number;
  holdings: VirtualAccountHolding[];
}

export async function getVirtualAccountAssetSummaries(): Promise<
  VirtualAccountAssetSummary[]
> {
  const { portfolios } = await getVirtualAccounts();
  // sortOrder 순으로 정렬해 "1계좌"~"4계좌" 위치가 항상 같은 계좌를 가리키게 한다.
  const sorted = [...portfolios].sort((a, b) => a.sortOrder - b.sortOrder);
  const details = await Promise.all(
    sorted.map((portfolio) => getVirtualAccountDetail(portfolio.id)),
  );
  return details.map((detail) => ({
    id: detail.id,
    name: detail.name,
    totalAsset: detail.holdings.reduce(
      (sum, holding) => sum + holding.evaluationAmount,
      0,
    ),
    holdings: detail.holdings,
  }));
}
