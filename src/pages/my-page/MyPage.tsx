import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import AppShell from '../../components/AppShell/AppShell';
import {
  getYearDiaries,
  type DiaryPreviewDto,
} from '../../features/diaries/diariesApi';
import { getPortfolios } from '../../features/portfolios/portfoliosApi';
import {
  getFavoriteStocks,
  removeFavoriteStock,
  type FavoriteStockItemDto,
} from '../../features/users/favoriteStocksApi';
import { clearAuthSession, readSessionUser } from '../../lib/authSession';
import { ApiError } from '../../lib/api';
import DiaryActivityCard from './components/DiaryActivityCard';
import FavoriteStocksCard from './components/FavoriteStocksCard';
import ProfileCard from './components/ProfileCard';
import RecentOrdersCard from './components/RecentOrdersCard';
import UsageSummaryCard from './components/UsageSummaryCard';
import VirtualAccountCard from './components/VirtualAccountCard';
import {
  FAVORITE_STOCK_DECORATION,
  MOCK_DIARIES,
  MOCK_FAVORITE_STOCKS,
  MOCK_RECENT_ORDERS,
  MOCK_USAGE_SUMMARY,
  MOCK_VIRTUAL_ACCOUNTS,
} from './mock-data';
import type {
  FavoriteStockView,
  MyPageSources,
  VirtualAccountView,
} from './types';

const ACCOUNT_ACCENTS = ['#4E7CFF', '#FF8473', '#2FC4D1', '#A978E7'];

// Figma 98:1107 3열 카드 그리드의 원본 치수(689+696+356 + 16.5px 간격 x2, 최대 카드 열 높이).
// 실제 뷰포트 폭에 맞춰 이 캔버스를 통째로 축소/확대해 뷰포트가 좁아져도 Figma 비율을 그대로 유지한다.
const GRID_DESIGN_WIDTH = 1774;
const GRID_DESIGN_HEIGHT = 801;
const GRID_MIN_SCALE = 0.55;

function isAuthenticationError(error: unknown) {
  return (
    error instanceof ApiError && (error.status === 401 || error.status === 403)
  );
}

function decorateFavorite(stock: FavoriteStockItemDto): FavoriteStockView {
  return {
    ...stock,
    currentPrice:
      FAVORITE_STOCK_DECORATION[stock.stockCode]?.currentPrice ?? null,
    industry:
      FAVORITE_STOCK_DECORATION[stock.stockCode]?.industry ?? stock.market,
    accent:
      FAVORITE_STOCK_DECORATION[stock.stockCode]?.accent ??
      ACCOUNT_ACCENTS[stock.id % ACCOUNT_ACCENTS.length],
  };
}

export default function MyPage() {
  const [diaries, setDiaries] = useState<DiaryPreviewDto[]>([]);
  const [favorites, setFavorites] = useState<FavoriteStockView[]>([]);
  const [accounts, setAccounts] = useState<VirtualAccountView[]>([]);
  const [sources, setSources] = useState<MyPageSources>({
    diaries: 'api',
    favorites: 'api',
    portfolios: 'api',
  });
  const [loading, setLoading] = useState(true);
  const [diaryYear, setDiaryYear] = useState(() => new Date().getFullYear());
  const [authenticationError, setAuthenticationError] = useState(false);
  const [removingCode, setRemovingCode] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const user = useMemo(() => readSessionUser(), []);
  const gridScaleRef = useRef<HTMLDivElement>(null);
  const [gridScale, setGridScale] = useState(1);

  useLayoutEffect(() => {
    const el = gridScaleRef.current;
    if (!el) return;
    const updateScale = () => {
      const available = el.clientWidth;
      if (available <= 0) return;
      setGridScale(
        Math.min(1, Math.max(GRID_MIN_SCALE, available / GRID_DESIGN_WIDTH)),
      );
    };
    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    void Promise.allSettled([
      getYearDiaries(diaryYear, controller.signal),
      getFavoriteStocks(controller.signal),
      getPortfolios(controller.signal),
    ]).then(([diaryResult, favoriteResult, portfolioResult]) => {
      if (!active) return;
      const fallbackSections = [
        diaryResult.status === 'rejected' &&
        !isAuthenticationError(diaryResult.reason)
          ? '매매일지'
          : null,
        favoriteResult.status === 'rejected' &&
        !isAuthenticationError(favoriteResult.reason)
          ? '관심종목'
          : null,
        portfolioResult.status === 'rejected' &&
        !isAuthenticationError(portfolioResult.reason)
          ? '가상계좌'
          : null,
      ].filter(Boolean);
      setAuthenticationError(
        [diaryResult, favoriteResult, portfolioResult].some(
          (result) =>
            result.status === 'rejected' &&
            isAuthenticationError(result.reason),
        ),
      );

      if (diaryResult.status === 'fulfilled') {
        setDiaries(diaryResult.value);
        setSources((current) => ({ ...current, diaries: 'api' }));
      } else if (isAuthenticationError(diaryResult.reason)) {
        setDiaries([]);
        setSources((current) => ({ ...current, diaries: 'api' }));
      } else {
        setDiaries(
          MOCK_DIARIES.filter(
            (diary) => Number(diary.date.slice(0, 4)) === diaryYear,
          ),
        );
        setSources((current) => ({ ...current, diaries: 'mock-fallback' }));
      }

      if (favoriteResult.status === 'fulfilled') {
        setFavorites(favoriteResult.value.map(decorateFavorite));
        setSources((current) => ({ ...current, favorites: 'api' }));
      } else if (isAuthenticationError(favoriteResult.reason)) {
        setFavorites([]);
        setSources((current) => ({ ...current, favorites: 'api' }));
      } else {
        setFavorites(MOCK_FAVORITE_STOCKS.map(decorateFavorite));
        setSources((current) => ({ ...current, favorites: 'mock-fallback' }));
      }

      if (portfolioResult.status === 'fulfilled') {
        setAccounts(
          portfolioResult.value.portfolios.map((portfolio, index) => ({
            id: portfolio.id,
            name: portfolio.name,
            balance: MOCK_VIRTUAL_ACCOUNTS[index]?.balance ?? 0,
            category: MOCK_VIRTUAL_ACCOUNTS[index]?.category ?? '가상 투자',
            accent: ACCOUNT_ACCENTS[index % ACCOUNT_ACCENTS.length],
          })),
        );
        setSources((current) => ({ ...current, portfolios: 'api' }));
      } else if (isAuthenticationError(portfolioResult.reason)) {
        setAccounts([]);
        setSources((current) => ({ ...current, portfolios: 'api' }));
      } else {
        setAccounts(MOCK_VIRTUAL_ACCOUNTS);
        setSources((current) => ({ ...current, portfolios: 'mock-fallback' }));
      }

      setLoading(false);
      if (fallbackSections.length > 0) {
        setMessage(
          `${fallbackSections.join(', ')} API 응답을 불러오지 못해 샘플 데이터를 표시합니다.`,
        );
      }
    });

    return () => {
      active = false;
      controller.abort();
    };
  }, [diaryYear]);

  async function handleRemoveFavorite(stock: FavoriteStockView) {
    const previous = favorites;
    setFavorites((current) =>
      current.filter((item) => item.stockCode !== stock.stockCode),
    );

    if (sources.favorites === 'mock-fallback') {
      setMessage('샘플 관심종목에서 제거했습니다. 새로고침하면 복원됩니다.');
      return;
    }

    setRemovingCode(stock.stockCode);
    try {
      await removeFavoriteStock(stock.stockCode);
      setMessage('관심종목에서 제거했습니다.');
    } catch {
      setFavorites(previous);
      setMessage('관심종목을 제거하지 못했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setRemovingCode(null);
    }
  }

  return (
    <AppShell currentPageLabel="마이페이지">
      <Box
        component="main"
        sx={{
          width: '100%',
          minWidth: 0,
          overflow: 'auto',
          position: 'relative',
          pt: { xs: 1, xl: '17px' },
          pr: { xs: 1, xl: '15px' },
          pb: { xs: 1, xl: '16px' },
          pl: { xs: 1, xl: '19px' },
          scrollbarGutter: 'stable',
        }}
      >
        {!loading && authenticationError && (
          <Alert
            severity="error"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => {
                  clearAuthSession();
                  window.location.replace('/');
                }}
              >
                다시 로그인
              </Button>
            }
            sx={{
              position: 'absolute',
              zIndex: 5,
              top: 8,
              left: '50%',
              width: 'min(640px, calc(100% - 32px))',
              transform: 'translateX(-50%)',
              borderRadius: 3,
              boxShadow: '0 6px 24px rgba(0,0,0,0.14)',
            }}
          >
            로그인 정보가 만료되었거나 이 데이터에 접근할 권한이 없습니다.
          </Alert>
        )}
        <Box ref={gridScaleRef} sx={{ width: '100%', overflowX: 'auto' }}>
          <Box
            sx={{
              width: GRID_DESIGN_WIDTH * gridScale,
              height: GRID_DESIGN_HEIGHT * gridScale,
            }}
          >
            <Box
              sx={{
                width: GRID_DESIGN_WIDTH,
                transform: `scale(${gridScale})`,
                transformOrigin: 'top left',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16.5px',
              }}
            >
              <Box sx={{ width: 689, display: 'grid', gap: '24px' }}>
                <ProfileCard user={user} />
                <DiaryActivityCard
                  diaries={diaries}
                  loading={loading}
                  year={diaryYear}
                  onYearChange={(year) => {
                    setLoading(true);
                    setDiaryYear(year);
                  }}
                />
              </Box>

              <Box sx={{ width: 696, display: 'grid', gap: '23px' }}>
                <VirtualAccountCard accounts={accounts} loading={loading} />
                <FavoriteStocksCard
                  stocks={favorites}
                  loading={loading}
                  removingCode={removingCode}
                  onRemove={(stock) => void handleRemoveFavorite(stock)}
                />
              </Box>

              <Box sx={{ width: 356, display: 'grid', gap: '23px' }}>
                <UsageSummaryCard summary={MOCK_USAGE_SUMMARY} />
                <RecentOrdersCard orders={MOCK_RECENT_ORDERS} />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={Boolean(message)}
        autoHideDuration={3600}
        message={message}
        onClose={() => setMessage('')}
      />
    </AppShell>
  );
}
