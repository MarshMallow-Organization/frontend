import type { FavoriteCompany, NewsItem } from '../../types/account';

/** 실제 서비스 연동 전까지 사용하는 더미 데이터 (my-react-ts 프로토타입에서 이식). */

// 디자이너 메모: 토스 오픈API(인기 주식/시세)로 교체 예정
export const FAVORITE_COMPANIES: FavoriteCompany[] = [
  { id: '005930', name: '삼성전자' },
  { id: '000660', name: 'SK하이닉스' },
  { id: 'SOXL', name: 'SOXL' },
  { id: '073240', name: '금호타이어' },
  { id: '009151', name: '삼성전기' },
];

export const NEWS_ITEMS: NewsItem[] = [
  {
    id: 'n1',
    title: '코스피, 외국인 순매수에 힘입어 2900선 회복',
    source: '한국경제',
    publishedAt: '10분 전',
    articleUrl: 'https://n.news.naver.com/',
  },
  {
    id: 'n2',
    title: '반도체 업황 개선 기대감에 관련주 강세',
    source: '매일경제',
    publishedAt: '32분 전',
    articleUrl: 'https://n.news.naver.com/',
  },
  {
    id: 'n3',
    title: '미 연준, 기준금리 동결…시장 영향은?',
    source: '연합인포맥스',
    publishedAt: '1시간 전',
    articleUrl: 'https://n.news.naver.com/',
  },
  {
    id: 'n4',
    title: '2차전지 관련주, 실적 발표 앞두고 변동성 확대',
    source: '이데일리',
    publishedAt: '2시간 전',
    articleUrl: 'https://n.news.naver.com/',
  },
];
