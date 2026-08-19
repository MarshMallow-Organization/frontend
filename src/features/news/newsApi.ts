import { apiFetch } from '../../lib/api';

export type NewsCategory = 'all' | 'popular' | 'economic';

export interface NewsArticle {
  id: number;
  company: string;
  source: string;
  publishedAt: string;
  title: string;
  imageUrl?: string;
  content: string[];
}

const mockFlag: unknown = import.meta.env.VITE_USE_NEWS_MOCK;
const USE_NEWS_MOCK =
  (typeof mockFlag === 'string' ? mockFlag : 'true').toLowerCase() === 'true';

const MOCK_NEWS: NewsArticle[] = [
  {
    id: 1,
    company: '루시드 그룹',
    source: '벤징가',
    publishedAt: '2026년 07월 16일 19:06',
    title:
      '루시드, 파산설 정면 반박에 주가 28% 급등…연초 대비 44% 하락 만회 주목',
    imageUrl: '/src/assets/news/raw-image-3.png',
    content: [
      '루시드 그룹(NASDAQ:LCID) 주가가 수요일(11일) 급락했다. 최근 실제 주행 테스트에서 큰 성과를 거뒀음에도 불구하고 회사가 역풍에 직면했기 때문이다. 투자자들이 알아야 할 사항은 다음과 같다.',
      '루시드, 차세대 전기차 전략 강조',
      '루시드의 최근 성과는 기술적 진보를 입증하는데, 루시드 에어 그랜드 투어링(Lucid Air Grand Touring)이 2026년 노르웨이 자동차 연맹(NAF) 동계 테스트에서 최장 주행 거리(단일 충전 기준 520km)를 달성했다.',
      '이러한 성과에도 주가는 압박을 받고 있으며, 애널리스트들은 신중한 전망을 유지하고 있다. 캔터 피츠제럴드는 최근 중립 등급을 재확인하면서 목표주가를 21달러로 유지했다.',
      '또한 루시드는 투자자 데이를 개최하고 차세대 차량 아키텍처를 포함한 전략적 로드맵을 발표할 계획이다.',
    ],
  },
  {
    id: 2,
    company: '한성기업',
    source: '뉴스1',
    publishedAt: '1시간 전',
    title: '“애국기업 절대지켜” 한성기업, 상폐위기에서 상한가',
    content: ['한성기업 관련 주요 소식입니다.'],
  },
  {
    id: 3,
    company: '에이직랜드',
    source: '조선비즈',
    publishedAt: '7시간 전',
    title: '에이직랜드, SK하이닉스 eSSD 양산 기대감에 16% 급등',
    content: ['에이직랜드 관련 주요 소식입니다.'],
  },
  {
    id: 4,
    company: '심텍',
    source: '뉴스핌',
    publishedAt: '1일 전',
    title: '심텍, 외국인·기관 동시 순매수…주가 +1.85%',
    content: ['심텍 관련 주요 소식입니다.'],
  },
  {
    id: 5,
    company: '프로티나',
    source: '연합뉴스',
    publishedAt: '1시간 전',
    title: '프로티나, 애프터마켓서 15%대 급등',
    content: ['프로티나 관련 주요 소식입니다.'],
  },
  {
    id: 6,
    company: '레이저쎌',
    source: '연합뉴스',
    publishedAt: '1시간 전',
    title: '레이저쎌 10%↑…코스닥 ‘소부장’ 반등 마감',
    content: ['레이저쎌 관련 주요 소식입니다.'],
  },
  {
    id: 7,
    company: '이노뎁',
    source: '전자신문',
    publishedAt: '3시간 전',
    title: '이노뎁, AI 특화도시 구축 수혜 기대감에 상승세',
    content: ['이노뎁 관련 주요 소식입니다.'],
  },
];

const categoryPath: Record<NewsCategory, string> = {
  all: '/news',
  popular: '/news/popular',
  economic: '/news/economic',
};

export async function getNews(category: NewsCategory): Promise<NewsArticle[]> {
  if (USE_NEWS_MOCK) return Promise.resolve(MOCK_NEWS);
  return apiFetch<NewsArticle[]>(categoryPath[category]);
}
