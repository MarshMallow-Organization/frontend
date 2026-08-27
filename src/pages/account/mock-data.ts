import type {
  AccountRow,
  HiddenStock,
  HoldingStock,
} from '../../types/account';

/** 실제 서비스 연동 전까지 사용하는 더미 데이터 (my-react-ts 프로토타입에서 이식). */

export const ACCOUNTS: AccountRow[] = [
  { id: 'acc-1', bankName: '저축예금 · 신한은행', amount: 10445681 },
  { id: 'acc-2', bankName: '저축예금', amount: 10445681 },
  { id: 'acc-3', bankName: '저축예금', amount: 10445681 },
  { id: 'acc-4', bankName: '저축예금', amount: 10445681 },
];

export const HOLDING_STOCKS: HoldingStock[] = [
  { id: 'h1', name: 'SK하이닉스', amount: 5500000, changePct: 30 },
  { id: 'h2', name: '테슬라', amount: 300000, changePct: -4 },
  { id: 'h3', name: '삼성전자', amount: 45000, changePct: 12 },
];

export const INITIAL_HIDDEN_STOCKS: HiddenStock[] = [
  { id: 'hs1', name: '테슬라', hiddenDate: '2027-06-15', remainingDays: 50 },
  { id: 'hs2', name: '인텔', hiddenDate: '2027-06-15', remainingDays: 500 },
];

// 디자이너 메모: "며칠 뒤에 다시 보이게 할 것인지" 기획 미확정 → 기본값만 우선 설정
export const DEFAULT_HIDE_DURATION_DAYS = 30;

export const formatWon = (value: number) =>
  `${value.toLocaleString('ko-KR')}원`;
