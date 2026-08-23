import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import BaseCard from '../../../components/BaseCard/BaseCard';
import { MY_PAGE_CARD_SX, MY_PAGE_CARD_TITLE_SX } from '../card-styles';
import { number } from '../format';
import type { FavoriteStockView } from '../types';

interface FavoriteStocksCardProps {
  stocks: FavoriteStockView[];
  loading: boolean;
  removingCode: string | null;
  onRemove: (stock: FavoriteStockView) => void;
}

export default function FavoriteStocksCard({
  stocks,
  loading,
  removingCode,
  onRemove,
}: FavoriteStocksCardProps) {
  const visibleStocks = stocks.slice(0, 4);
  const skeletonCount = loading
    ? 4
    : visibleStocks.length > 0
      ? Math.max(0, 4 - visibleStocks.length)
      : 0;

  return (
    <BaseCard
      component="section"
      aria-labelledby="favorite-stocks-title"
      sx={{
        ...MY_PAGE_CARD_SX,
        height: 363,
        position: 'relative',
      }}
    >
      <Typography
        id="favorite-stocks-title"
        component="h2"
        sx={{
          ...MY_PAGE_CARD_TITLE_SX,
          position: 'absolute',
          top: 24,
          left: 38,
        }}
      >
        관심 종목
      </Typography>

      <Box
        sx={{
          position: 'absolute',
          top: 70,
          left: 38,
          right: 38,
          height: 28,
          display: 'grid',
          gridTemplateColumns: '56px minmax(0, 1fr) 142px 91px 40px',
          alignItems: 'start',
          color: '#A6A6A6',
        }}
      >
        <span />
        <Typography sx={{ fontSize: 12 }}>종목명</Typography>
        <Typography sx={{ fontSize: 12, textAlign: 'center' }}>
          현재가
        </Typography>
        <Typography sx={{ fontSize: 12, textAlign: 'center' }}>산업</Typography>
        <span />
      </Box>
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          top: 96,
          left: 38,
          right: 38,
          height: '1px',
          bgcolor: '#D5DEE4',
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          top: 112,
          left: 38,
          right: 31,
          display: 'grid',
          gap: '13px',
        }}
      >
        {!loading && visibleStocks.length === 0 && (
          <Typography
            sx={{ py: 8, textAlign: 'center', fontSize: 14, color: '#A0A0A0' }}
          >
            등록한 관심 종목이 없습니다.
          </Typography>
        )}
        {!loading &&
          visibleStocks.map((stock) => (
            <Box
              key={stock.stockCode}
              sx={{
                minHeight: 44,
                display: 'grid',
                gridTemplateColumns: '56px minmax(0, 1fr) 142px 91px 40px',
                alignItems: 'center',
              }}
            >
              <Box
                aria-hidden
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: stock.accent,
                }}
              />
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  noWrap
                  sx={{
                    fontSize: 20,
                    lineHeight: 1.1,
                    fontWeight: 650,
                    color: '#101010',
                  }}
                >
                  {stock.stockName}
                </Typography>
                <Typography
                  sx={{
                    mt: 0.2,
                    fontSize: 14,
                    lineHeight: 1,
                    color: '#A0A0A0',
                  }}
                >
                  {stock.stockCode}
                </Typography>
              </Box>
              <Typography
                sx={{
                  pr: 1.5,
                  fontSize: 24,
                  lineHeight: 1,
                  fontWeight: 550,
                  textAlign: 'right',
                  color: '#050505',
                }}
              >
                {stock.currentPrice === null
                  ? '—'
                  : number.format(stock.currentPrice)}
              </Typography>
              <Box
                sx={{
                  justifySelf: 'center',
                  minWidth: 71,
                  height: 28,
                  px: 1.2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 30,
                  border: '1px solid #A4A4A4',
                  color: '#868686',
                  fontSize: 8,
                }}
              >
                {(stock.industry ?? stock.market ?? '정보없음').replaceAll(
                  ' ',
                  '',
                )}
              </Box>
              <IconButton
                aria-label={`${stock.stockName} 관심종목에서 제거`}
                disabled={removingCode === stock.stockCode}
                onClick={() => onRemove(stock)}
                sx={{ width: 40, height: 40, color: '#12AED0' }}
              >
                {removingCode === stock.stockCode ? (
                  <CircularProgress size={20} />
                ) : (
                  <FavoriteRoundedIcon sx={{ width: 30, height: 30 }} />
                )}
              </IconButton>
            </Box>
          ))}

        {Array.from({ length: skeletonCount }, (_, index) => (
          <Box
            key={`favorite-skeleton-${index}`}
            sx={{
              minHeight: 42,
              display: 'grid',
              gridTemplateColumns: '56px minmax(0, 1fr) 142px 91px 40px',
              alignItems: 'center',
            }}
          >
            <Skeleton variant="circular" width={40} height={40} />
            <Box>
              <Skeleton variant="rectangular" width={99} height={20} />
              <Skeleton
                variant="rectangular"
                width={47}
                height={12}
                sx={{ mt: 0.6 }}
              />
            </Box>
            <Skeleton
              variant="rectangular"
              width={103}
              height={24}
              sx={{ justifySelf: 'end', mr: 1.5 }}
            />
            <Box
              sx={{
                justifySelf: 'center',
                width: 71,
                height: 28,
                borderRadius: 30,
                border: '1px solid #A4A4A4',
                color: '#868686',
                fontSize: 8,
                display: 'grid',
                placeItems: 'center',
              }}
            >
              종합반도체
            </Box>
            <FavoriteRoundedIcon
              sx={{
                justifySelf: 'center',
                width: 30,
                height: 30,
                color: '#12AED0',
              }}
            />
          </Box>
        ))}
      </Box>
    </BaseCard>
  );
}
