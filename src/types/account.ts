/**
 * 홈 / 내 계좌 화면에서 공유하는 도메인 타입.
 * my-react-ts 프로토타입(types.ts)의 화면 사양을 그대로 이식.
 */

export type AccountSubTab = '자산 현황' | '가상 계좌' | '숨기기';

export interface FavoriteCompany {
  id: string;
  name: string;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  publishedAt: string;
  /** 클릭 시 새 탭으로 여는 원문 URL */
  articleUrl: string;
}

export interface HoldingStock {
  id: string;
  name: string;
  amount: number;
  /** 내 평단 대비 등락률(%) */
  changePct: number;
}

export interface InvestmentFolder {
  id: string;
  /** 예: "안정형 투자 (+4%)" */
  label: string;
  holdings: HoldingStock[];
}

export interface HiddenStock {
  id: string;
  name: string;
  hiddenDate: string;
  remainingDays: number;
}
