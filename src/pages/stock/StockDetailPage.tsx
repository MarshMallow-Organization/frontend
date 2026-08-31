import { useEffect, useState, type ReactNode } from 'react';
import Alert from '@mui/material/Alert';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded';
import BookmarkRoundedIcon from '@mui/icons-material/BookmarkRounded';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import { AppShell, type AppShellNav } from '../../components/AppShell';
import { BaseCard } from '../../components/BaseCard';
import { CtaButton } from '../../components/CtaButton';
import { getStock, type StockDto } from '../../features/stocks/stocksApi';
import {
  createFavoriteStock,
  getFavoriteStockStatus,
  removeFavoriteStock,
} from '../../features/users/favoriteStocksApi';
import { hideStock } from '../../features/users/hiddenStocksApi';
import { ApiError } from '../../lib/api';
import { tokens } from '../../theme/tokens';
import {
  ConfirmStockDialog,
  HideStockDialog,
} from './components/StockActionDialogs';
import { TradeDialog } from './components/TradeDialog';
import {
  STOCK_DETAIL_PRESENTATION,
  type FinancialMetric,
  type StockPeriod,
} from './mock-data';

const { color, fontFamily } = tokens;
const STOCK_NAV = 'stock' as unknown as AppShellNav;
const DOMESTIC_STOCK_CODE = /^\d{6}$/;
const STOCK_CODE = /^\S{1,10}$/;

const cardSurface = {
  p: 0,
  border: `1px solid ${color.stockCardBorder}`,
  backgroundColor: color.white,
  boxShadow: '0 0 3px rgba(0,0,0,0.2)',
  overflow: 'hidden',
} as const;

const metricTone: Record<
  FinancialMetric['tone'],
  { foreground: string; background: string }
> = {
  blue: { foreground: color.stockMetricBlue, background: color.stockPanelBg },
  green: {
    foreground: color.stockMetricGreen,
    background: color.stockMetricGreenBg,
  },
  orange: {
    foreground: color.stockMetricOrange,
    background: color.stockMetricOrangeBg,
  },
  purple: {
    foreground: color.stockMetricPurple,
    background: color.stockMetricPurpleBg,
  },
};

function apiErrorMessage(error: unknown, fallback: string) {
  return error instanceof ApiError ? error.message : fallback;
}

function StockPageShell({
  children,
  detail = false,
}: {
  children: ReactNode;
  detail?: boolean;
}) {
  return (
    <AppShell
      activeNav={STOCK_NAV}
      appBackgroundColor={color.stockAppBg}
      navMarginLeft="33px"
      navWidth={585}
      hideMenuIcon
      pageSx={detail ? { pb: 0 } : undefined}
      panelSx={{
        ...(detail
          ? {
              flex: 'none',
              height: { xs: 'auto', lg: 'calc(100svh - 166px)' },
              minHeight: { xs: 'auto', lg: 'calc(100svh - 166px)' },
              overflowX: 'hidden',
              overflowY: { xs: 'visible', lg: 'auto' },
              scrollbarWidth: 'thin',
            }
          : { minHeight: 'calc(100svh - 202px)' }),
        p: 0,
        border: 0,
        backgroundColor: color.stockPanelBg,
        backgroundImage: 'none',
      }}
    >
      {children}
    </AppShell>
  );
}

function UnavailableLabel() {
  return (
    <Box
      component="span"
      sx={{
        ml: 1.25,
        px: 1.25,
        py: 0.35,
        borderRadius: '999px',
        backgroundColor: color.bg,
        color: color.stockMuted,
        fontSize: '12px',
        fontWeight: 500,
        verticalAlign: 'middle',
      }}
    >
      API 미연동
    </Box>
  );
}

interface CompanyInformationCardProps {
  stock: StockDto;
  isFavorite: boolean;
  favoriteLoading: boolean;
  favoriteSupported: boolean;
  onTrade: () => void;
  onHide: () => void;
  onFavorite: () => void;
}

function CompanyInformationCard({
  stock,
  isFavorite,
  favoriteLoading,
  favoriteSupported,
  onTrade,
  onHide,
  onFavorite,
}: CompanyInformationCardProps) {
  return (
    <BaseCard
      component="section"
      aria-label={`${stock.name} 기업 정보`}
      sx={{
        ...cardSurface,
        height: { xs: 'auto', lg: 368 },
        minHeight: { xs: 620, sm: 540, lg: 368 },
        borderRadius: '30px',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 400px' },
          gap: { xs: 3, lg: 5 },
          height: '100%',
          pl: { xs: 3, lg: '92px' },
          pr: { xs: 3, lg: '118px' },
          py: { xs: 3, lg: '60px' },
        }}
      >
        <Box sx={{ position: 'relative', minHeight: { xs: 270, lg: 'auto' } }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <Box
              aria-hidden
              sx={{
                width: 93,
                height: 93,
                flexShrink: 0,
                borderRadius: '10px',
                backgroundColor: color.stockPlaceholder,
              }}
            />
            <Box sx={{ ml: { xs: 2, lg: '47px' }, mt: 0.5, minWidth: 0 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 2,
                  flexWrap: 'wrap',
                }}
              >
                <Typography
                  component="h1"
                  sx={{
                    color: color.ink,
                    fontSize: { xs: '30px', lg: '40px' },
                    fontWeight: 500,
                    lineHeight: 1.2,
                  }}
                >
                  {stock.name}
                </Typography>
                <Typography sx={{ color: color.stockMeta, fontSize: '20px' }}>
                  {stock.symbol}
                </Typography>
              </Box>
              <Typography
                sx={{
                  mt: 1,
                  color: '#606060',
                  fontSize: { xs: '16px', lg: '20px' },
                  fontWeight: 500,
                }}
              >
                종목 정보 | 상세 정보 미연동
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              position: { xs: 'static', lg: 'absolute' },
              left: 2,
              bottom: -1,
              mt: { xs: 5, lg: 0 },
            }}
          >
            <Typography
              sx={{
                color: color.ink,
                fontSize: { xs: '38px', lg: '50px' },
                fontWeight: 700,
                lineHeight: 1.15,
              }}
            >
              현재가 —
            </Typography>
            <Typography
              sx={{
                mt: 1,
                color: color.stockMuted,
                fontSize: { xs: '16px', lg: '18px' },
              }}
            >
              시세 API가 제공되지 않습니다.
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'grid', gap: '10px', alignContent: 'start' }}>
          <ButtonBase
            onClick={onTrade}
            sx={{
              height: 78,
              borderRadius: '20px',
              backgroundColor: color.primary,
              color: color.white,
              fontFamily,
              fontSize: { xs: '24px', lg: '30px' },
              fontWeight: 700,
              '&:hover': { backgroundColor: color.ctaHover },
            }}
          >
            거래하기
          </ButtonBase>
          <ButtonBase
            disabled={stock.isHidden}
            onClick={onHide}
            sx={{
              height: 76,
              borderRadius: '20px',
              border: `1px solid ${color.primary}`,
              backgroundColor: color.stockSoftCyan,
              color: color.stockCyanText,
              fontFamily,
              fontSize: '27px',
              fontWeight: 700,
              '&.Mui-disabled': { opacity: 0.55 },
            }}
          >
            {stock.isHidden ? '숨김 완료' : '숨기기'}
          </ButtonBase>
          <ButtonBase
            disabled={!favoriteSupported || favoriteLoading}
            aria-pressed={favoriteSupported ? isFavorite : undefined}
            onClick={onFavorite}
            sx={{
              position: 'relative',
              height: 73,
              borderRadius: '20px',
              border: '1px solid #bababa',
              backgroundColor: color.white,
              color: color.stockMuted,
              fontFamily,
              fontSize: { xs: '20px', lg: '26px' },
              fontWeight: 500,
              '&.Mui-disabled': { opacity: 0.55 },
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                left: { xs: 28, lg: 81 },
                width: 35,
                height: 35,
                display: 'grid',
                placeItems: 'center',
              }}
            >
              {favoriteLoading ? (
                <CircularProgress size={24} />
              ) : isFavorite ? (
                <BookmarkRoundedIcon sx={{ width: 35, height: 35 }} />
              ) : (
                <BookmarkBorderRoundedIcon sx={{ width: 35, height: 35 }} />
              )}
            </Box>
            {favoriteSupported
              ? isFavorite
                ? '관심 종목 해제'
                : '관심 종목 추가'
              : '국내 종목만 지원'}
          </ButtonBase>
        </Box>
      </Box>
    </BaseCard>
  );
}

function PriceChartCard({ stockName }: { stockName: string }) {
  const [period, setPeriod] = useState<StockPeriod>('week');

  return (
    <BaseCard
      component="section"
      aria-labelledby="stock-chart-title"
      sx={{
        ...cardSurface,
        mt: { xs: 2, lg: '30px' },
        width: { xs: '100%', lg: 'calc(100% - 34px)' },
        height: { xs: 500, lg: 656 },
        borderRadius: '32px',
        px: { xs: 3, lg: '73px' },
        pt: { xs: 3, lg: '41px' },
        pb: { xs: 3, lg: '48px' },
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography
        id="stock-chart-title"
        component="h2"
        sx={{ color: color.ink, fontSize: '28px', fontWeight: 500 }}
      >
        차트 <UnavailableLabel />
      </Typography>
      <Box
        role="group"
        aria-label="차트 기간 선택"
        sx={{
          mt: 1.5,
          width: { xs: '100%', sm: 589 },
          height: 60,
          borderRadius: '15px',
          backgroundColor: '#ebebeb',
          p: '4px 6px',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: { xs: 0.5, sm: '10px' },
        }}
      >
        {STOCK_DETAIL_PRESENTATION.periods.map((item) => {
          const selected = item.id === period;
          return (
            <ButtonBase
              key={item.id}
              aria-pressed={selected}
              onClick={() => setPeriod(item.id)}
              sx={{
                height: 52,
                borderRadius: '15px',
                border: `1px solid ${selected ? color.accentBlue : color.border}`,
                backgroundColor: selected ? color.cardTinted : color.white,
                color: selected ? color.accentBlue : '#767676',
                fontFamily,
                fontSize: '20px',
                fontWeight: 500,
              }}
            >
              {item.label}
            </ButtonBase>
          );
        })}
      </Box>
      <Box
        role="img"
        aria-label={`${stockName} 가격 차트 API 미연동`}
        sx={{
          mt: { xs: 3, lg: '36px' },
          flex: 1,
          minHeight: 220,
          backgroundColor: color.stockPlaceholder,
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <Typography sx={{ color: color.stockMuted, fontSize: '18px' }}>
          가격 흐름 데이터가 준비 중입니다.
        </Typography>
      </Box>
    </BaseCard>
  );
}

function FinancialMetricsCard() {
  return (
    <BaseCard
      component="section"
      aria-labelledby="financial-metrics-title"
      sx={{
        ...cardSurface,
        mt: { xs: 2, lg: '37px' },
        minHeight: { xs: 760, sm: 500, lg: 368 },
        borderRadius: '30px',
        px: { xs: 2, lg: '29px' },
        pt: { xs: 3, lg: '29px' },
        pb: { xs: 3, lg: '29px' },
      }}
    >
      <Typography
        id="financial-metrics-title"
        component="h2"
        sx={{
          ml: { xs: 1, lg: '6px' },
          color: color.ink,
          fontSize: '28px',
          fontWeight: 500,
        }}
      >
        핵심 재무 지표 <UnavailableLabel />
      </Typography>
      <Box
        sx={{
          mt: { xs: 3, lg: '36px' },
          minHeight: { xs: 630, sm: 360, lg: 238 },
          borderRadius: '12px',
          border: `1px solid ${color.border}`,
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr 1fr',
            sm: 'repeat(3, 1fr)',
            lg: 'repeat(6, 1fr)',
          },
        }}
      >
        {STOCK_DETAIL_PRESENTATION.financialMetrics.map((metric, index) => {
          const tone = metricTone[metric.tone];
          return (
            <Box
              key={metric.id}
              sx={{
                minWidth: 0,
                minHeight: { xs: 180, lg: 236 },
                px: 1.5,
                py: { xs: 2.5, lg: '39px' },
                textAlign: 'center',
                borderRight: {
                  lg: index === 5 ? 0 : `1px solid ${color.border}`,
                },
                borderBottom: {
                  xs: index < 4 ? `1px solid ${color.border}` : 0,
                  sm: index < 3 ? `1px solid ${color.border}` : 0,
                  lg: 0,
                },
              }}
            >
              <Typography
                sx={{
                  color: '#646464',
                  fontSize:
                    metric.label.length > 10
                      ? { xs: '15px', lg: '18px' }
                      : { xs: '17px', lg: '20px' },
                  whiteSpace: 'nowrap',
                }}
              >
                {metric.label}
              </Typography>
              <Typography
                sx={{
                  mt: 1.5,
                  color: color.ink,
                  fontSize: { xs: '24px', lg: '28px' },
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                }}
              >
                {metric.value}
              </Typography>
              <Box
                sx={{
                  display: 'inline-flex',
                  mt: 2.5,
                  minHeight: 36,
                  px: '15px',
                  borderRadius: '18px',
                  border: `1px solid ${tone.foreground}`,
                  backgroundColor: tone.background,
                  color: tone.foreground,
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                }}
              >
                {metric.status}
              </Box>
            </Box>
          );
        })}
      </Box>
    </BaseCard>
  );
}

function AiInterpretationSection() {
  return (
    <Box
      sx={{
        mt: { xs: 2, lg: '25px' },
        minHeight: { xs: 760, lg: 634 },
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: '380px minmax(0, 1fr)' },
        gap: { xs: 2, lg: '21px' },
      }}
    >
      <BaseCard
        component="section"
        aria-labelledby="ai-interpretation-title"
        sx={{
          ...cardSurface,
          minHeight: { xs: 360, lg: 634 },
          borderRadius: '30px',
          position: 'relative',
        }}
      >
        <Typography
          id="ai-interpretation-title"
          component="h2"
          sx={{
            position: 'absolute',
            left: 35,
            top: 28,
            color: color.ink,
            fontSize: '28px',
            fontWeight: 500,
          }}
        >
          AI 해석
        </Typography>
        <Typography
          sx={{
            position: 'absolute',
            left: 35,
            top: 72,
            color: color.stockAiText,
            fontSize: '12px',
          }}
        >
          숫자를 사람이 읽는 문장으로 풀어드려요.
        </Typography>
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            left: '50%',
            top: { xs: 125, lg: 216 },
            transform: 'translateX(-50%)',
            width: 124,
            height: 124,
            backgroundColor: color.stockPlaceholder,
          }}
        />
        <CtaButton
          icon={<AutoAwesomeIcon sx={{ width: 14, height: 14 }} />}
          disabled
          sx={{
            position: 'absolute',
            left: '50%',
            bottom: { xs: 54, lg: 136 },
            transform: 'translateX(-50%)',
            width: 191,
            height: 50,
            p: 0,
          }}
        >
          AI 재무 상태 체크
        </CtaButton>
        <Typography
          sx={{
            position: 'absolute',
            left: 20,
            right: 20,
            bottom: { xs: 20, lg: 73 },
            color: color.stockAiText,
            fontSize: '11px',
            lineHeight: 1.35,
            textAlign: 'center',
          }}
        >
          AI 생성 API는 현재 구현되지 않았습니다.
        </Typography>
      </BaseCard>
      <BaseCard
        component="section"
        aria-label="AI 재무 해석 결과"
        sx={{
          ...cardSurface,
          minHeight: { xs: 360, lg: 634 },
          borderRadius: '30px',
          display: 'grid',
          placeItems: 'center',
          px: { xs: 4, lg: '120px' },
        }}
      >
        <Typography
          sx={{
            color: '#898989',
            fontSize: { xs: '18px', lg: '25px' },
            lineHeight: 1.85,
            textAlign: 'center',
          }}
        >
          AI 해석 기능은 준비 중입니다.
        </Typography>
      </BaseCard>
    </Box>
  );
}

function RelatedArticlesCard() {
  return (
    <BaseCard
      component="section"
      aria-labelledby="related-articles-title"
      sx={{
        ...cardSurface,
        mt: { xs: 2, lg: '25px' },
        minHeight: { xs: 1160, sm: 680, lg: 419 },
        borderRadius: '40px',
        boxShadow: 'none',
        px: { xs: 2, lg: '35px' },
        pt: { xs: 3, lg: '28px' },
        pb: 3,
      }}
    >
      <Typography
        id="related-articles-title"
        component="h2"
        sx={{ color: color.ink, fontSize: '28px', fontWeight: 500 }}
      >
        관련 기사 <UnavailableLabel />
      </Typography>
      <Box
        sx={{
          mt: { xs: 3, lg: '35px' },
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: '1fr 1fr',
            lg: 'repeat(4, minmax(0, 1fr))',
          },
          gap: { xs: 2, lg: '29px' },
        }}
      >
        {Array.from({ length: 4 }, (_, index) => (
          <Box
            component="article"
            key={index}
            sx={{
              height: 285,
              borderRadius: '30px',
              backgroundColor: color.white,
              boxShadow: '0 0 3px rgba(0,0,0,0.3)',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <Box
              aria-hidden
              sx={{
                height: 114,
                backgroundColor: color.stockArticlePlaceholder,
              }}
            />
            <Typography
              sx={{
                position: 'absolute',
                left: 15,
                top: 126,
                color: color.stockArticleMeta,
                fontSize: '15px',
              }}
            >
              뉴스 API 미구현
            </Typography>
            <Typography
              component="h3"
              sx={{
                position: 'absolute',
                left: 15,
                right: 15,
                top: 157,
                m: 0,
                color: color.ink,
                fontSize: '21px',
                fontWeight: 400,
                lineHeight: 1.3,
              }}
            >
              관련 기사를 불러올 수 없습니다.
            </Typography>
            <Typography
              sx={{
                position: 'absolute',
                left: 26,
                right: 26,
                top: 218,
                color: '#5f5f5f',
                fontSize: '15px',
                fontWeight: 300,
                lineHeight: '22px',
              }}
            >
              뉴스 기능이 구현되면 이 영역에 최신 기사가 표시됩니다.
            </Typography>
          </Box>
        ))}
      </Box>
    </BaseCard>
  );
}

interface StockDetailContentProps {
  stock: StockDto;
}

function StockDetailContent({ stock }: StockDetailContentProps) {
  const favoriteSupported = DOMESTIC_STOCK_CODE.test(stock.symbol);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(favoriteSupported);
  const [tradeOpen, setTradeOpen] = useState(false);
  const [favoriteOpen, setFavoriteOpen] = useState(false);
  const [hideOpen, setHideOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [hidden, setHidden] = useState(stock.isHidden);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!favoriteSupported) return;
    const controller = new AbortController();
    getFavoriteStockStatus(stock.symbol, controller.signal)
      .then((status) => setIsFavorite(status.isFavorite))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError')
          return;
        setNotice(
          apiErrorMessage(error, '관심종목 상태를 확인하지 못했습니다.'),
        );
      })
      .finally(() => setFavoriteLoading(false));
    return () => controller.abort();
  }, [favoriteSupported, stock.symbol]);

  function closeActions() {
    if (actionLoading) return;
    setFavoriteOpen(false);
    setHideOpen(false);
    setActionError(null);
  }

  async function handleFavoriteConfirm() {
    setActionLoading(true);
    setActionError(null);
    try {
      if (isFavorite) await removeFavoriteStock(stock.symbol);
      else await createFavoriteStock(stock.symbol, stock.name);
      setIsFavorite((value) => !value);
      setFavoriteOpen(false);
      setNotice(
        isFavorite
          ? '관심 종목에서 해제했습니다.'
          : '관심 종목에 추가했습니다.',
      );
    } catch (error) {
      setActionError(
        apiErrorMessage(error, '관심종목 요청을 처리하지 못했습니다.'),
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function handleHideConfirm(hiddenUntilDate: string) {
    setActionLoading(true);
    setActionError(null);
    try {
      const hiddenUntil = new Date(
        `${hiddenUntilDate}T23:59:59+09:00`,
      ).toISOString();
      await hideStock(stock.symbol, hiddenUntil);
      setHidden(true);
      setHideOpen(false);
      setNotice(`${stock.name} 숨기기를 설정했습니다.`);
    } catch (error) {
      setActionError(
        apiErrorMessage(error, '숨기기 요청을 처리하지 못했습니다.'),
      );
    } finally {
      setActionLoading(false);
    }
  }

  const visibleStock: StockDto = hidden
    ? {
        symbol: stock.symbol,
        name: stock.name,
        isHidden: true,
        message: '숨김 처리된 종목입니다.',
        hiddenUntil: stock.isHidden ? stock.hiddenUntil : '',
      }
    : stock;

  return (
    <StockPageShell detail>
      <Box
        component="main"
        sx={{
          width: '100%',
          minHeight: { xs: 'auto', lg: 2702 },
          p: { xs: 2, lg: '66px' },
          pb: { xs: 3, lg: '74px' },
          boxSizing: 'border-box',
          fontFamily,
        }}
      >
        <CompanyInformationCard
          stock={visibleStock}
          isFavorite={isFavorite}
          favoriteLoading={favoriteLoading}
          favoriteSupported={favoriteSupported}
          onTrade={() => setTradeOpen(true)}
          onHide={() => {
            setActionError(null);
            setHideOpen(true);
          }}
          onFavorite={() => {
            setActionError(null);
            setFavoriteOpen(true);
          }}
        />
        <PriceChartCard stockName={stock.name} />
        <FinancialMetricsCard />
        <AiInterpretationSection />
        <RelatedArticlesCard />
      </Box>

      <TradeDialog
        open={tradeOpen}
        stockCode={stock.symbol}
        stockName={stock.name}
        onClose={() => setTradeOpen(false)}
        onCompleted={() => setNotice('주문을 등록했습니다.')}
      />
      <ConfirmStockDialog
        open={favoriteOpen}
        title={isFavorite ? '관심 종목 해제' : '관심 종목 추가'}
        description={`${stock.name} 종목을 ${
          isFavorite ? '관심 종목에서 해제할까요?' : '관심 종목에 추가할까요?'
        }`}
        confirmLabel={isFavorite ? '해제하기' : '추가하기'}
        loading={actionLoading}
        error={actionError}
        onCancel={closeActions}
        onConfirm={() => void handleFavoriteConfirm()}
      />
      <HideStockDialog
        open={hideOpen}
        stockName={stock.name}
        loading={actionLoading}
        error={actionError}
        onCancel={closeActions}
        onConfirm={(date) => void handleHideConfirm(date)}
      />
      <Snackbar
        open={notice !== null}
        autoHideDuration={4000}
        onClose={() => setNotice(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="info" variant="filled" onClose={() => setNotice(null)}>
          {notice}
        </Alert>
      </Snackbar>
    </StockPageShell>
  );
}

function StockStatusCard({
  title,
  description,
  error = false,
  loading = false,
}: {
  title: string;
  description: string;
  error?: boolean;
  loading?: boolean;
}) {
  return (
    <StockPageShell>
      <Box
        component="main"
        role={error ? 'alert' : 'status'}
        sx={{
          width: '100%',
          minHeight: 'calc(100svh - 202px)',
          display: 'grid',
          placeItems: 'center',
          p: 4,
        }}
      >
        <BaseCard
          sx={{
            width: 'min(620px, 100%)',
            borderRadius: '30px',
            p: { xs: 4, sm: 6 },
            textAlign: 'center',
          }}
        >
          {loading && (
            <CircularProgress size={44} sx={{ mb: 3, color: color.primary }} />
          )}
          <Typography
            component="h1"
            sx={{ color: color.ink, fontSize: '30px', fontWeight: 700 }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              mt: 2,
              color: color.stockMuted,
              fontSize: '18px',
              lineHeight: 1.6,
            }}
          >
            {description}
          </Typography>
        </BaseCard>
      </Box>
    </StockPageShell>
  );
}

type StockRequest =
  | { status: 'loading' }
  | { status: 'success'; stock: StockDto }
  | { status: 'error'; error: ApiError };

function StockLookup({ stockCode }: { stockCode: string }) {
  const [request, setRequest] = useState<StockRequest>({ status: 'loading' });

  useEffect(() => {
    const controller = new AbortController();
    getStock(stockCode, controller.signal)
      .then((stock) => setRequest({ status: 'success', stock }))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError')
          return;
        setRequest({
          status: 'error',
          error:
            error instanceof ApiError
              ? error
              : new ApiError(0, '알 수 없는 오류가 발생했습니다.'),
        });
      });
    return () => controller.abort();
  }, [stockCode]);

  if (request.status === 'loading') {
    return (
      <StockStatusCard
        loading
        title="종목 정보를 불러오는 중입니다."
        description={`${stockCode} 종목을 조회하고 있습니다.`}
      />
    );
  }
  if (request.status === 'error') {
    const description =
      request.error.status === 401
        ? '종목 정보를 조회하려면 먼저 로그인해 주세요.'
        : request.error.message;
    return (
      <StockStatusCard
        error
        title="종목 정보를 불러오지 못했습니다."
        description={description}
      />
    );
  }
  return <StockDetailContent stock={request.stock} />;
}

export interface StockDetailPageProps {
  stockCodeQuery?: string | null;
}

export default function StockDetailPage({
  stockCodeQuery,
}: StockDetailPageProps) {
  const stockCode = (stockCodeQuery?.trim() || '005930').toUpperCase();
  if (!STOCK_CODE.test(stockCode)) {
    return (
      <StockStatusCard
        error
        title="종목 코드를 확인해 주세요."
        description="공백 없이 10자 이하의 종목 코드를 입력해 주세요."
      />
    );
  }
  return <StockLookup key={stockCode} stockCode={stockCode} />;
}
