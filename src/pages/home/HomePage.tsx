import { useState } from 'react';
import Box from '@mui/material/Box';
import { AppShell, type AppShellNav } from '../../components/AppShell';
import { CalendarCard } from './components/CalendarCard';
import { AssetStatusCard } from './components/AssetStatusCard';
import { AiInterpretationCard } from './components/AiInterpretationCard';
import { NewsCard } from './components/NewsCard';
import { ACCOUNTS } from '../account/mock-data';
import { FAVORITE_COMPANIES, NEWS_ITEMS } from './mock-data';

// AppShell의 AppShellNav엔 아직 '홈' 상태가 없다(4개 탭만 정의됨, 팀원 소유 파일이라 수정하지
// 않음). AppShell은 activeNav를 각 탭 id와 단순 비교만 하므로, 어느 탭과도 겹치지 않는 값을
// 넘기면 4개 탭 전부 비활성 상태로만 표시되고 런타임 동작은 안전하다.
const HOME_NAV = 'home' as unknown as AppShellNav;

/**
 * 홈 화면 — 좌: 캘린더 / 가운데: 자산현황+AI해석 / 우: 인기뉴스 3분할 레이아웃.
 * my-react-ts 프로토타입(HomeScreen.tsx)의 구조를 그대로 이식하고,
 * UI는 기존 디자인 시스템 컴포넌트로 재조립했다.
 */
export default function HomePage() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 6, 30));
  const [companySearch, setCompanySearch] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState(
    FAVORITE_COMPANIES[0].id,
  );
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);

  async function handleAiInterpret() {
    setIsSummarizing(true);
    setAiSummary(null);
    try {
      const company = FAVORITE_COMPANIES.find(
        (c) => c.id === selectedCompanyId,
      );
      // TODO: 실제 AI 프롬프팅 API 연동 (예: /api/ai/financial-summary)
      await new Promise((resolve) => setTimeout(resolve, 700));
      setAiSummary(
        `${company?.name ?? '선택한 기업'}은(는) 최근 실적이 시장 기대치에 부합하며, ` +
          `현금 흐름이 안정적으로 유지되고 있어요. 다만 업종 전반의 변동성은 계속 주시가 필요해 보여요.`,
      );
    } finally {
      setIsSummarizing(false);
    }
  }

  function handleOpenArticle(url: string) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  function fetchTrendingStocksFromToss() {
    // 디자이너 메모: 토스 오픈API(인기 주식/시세) 엔드포인트로 교체
  }

  return (
    <AppShell activeNav={HOME_NAV}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '320px 1fr 320px' },
          gap: 3,
          width: '100%',
          alignItems: 'start',
        }}
      >
        <CalendarCard
          currentMonth={currentMonth}
          onMonthChange={setCurrentMonth}
        />

        <Box
          sx={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}
        >
          <AssetStatusCard accounts={ACCOUNTS} />
          <AiInterpretationCard
            companies={FAVORITE_COMPANIES}
            selectedCompanyId={selectedCompanyId}
            onSelectCompany={setSelectedCompanyId}
            companySearch={companySearch}
            onCompanySearchChange={setCompanySearch}
            onInterpret={() => void handleAiInterpret()}
            isSummarizing={isSummarizing}
            summary={aiSummary}
          />
        </Box>

        <NewsCard
          items={NEWS_ITEMS}
          onOpenArticle={handleOpenArticle}
          onRefreshTrending={fetchTrendingStocksFromToss}
        />
      </Box>
    </AppShell>
  );
}
