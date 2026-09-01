import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { VirtualAccountHolding } from '../../../features/assets/assetsApi';
import { formatWon } from '../../account/mock-data';
import { tokens } from '../../../theme/tokens';
import { ACCOUNT_LEGEND_COLORS } from './accountColors';

const { color } = tokens;

export interface StockTreemapHolding extends VirtualAccountHolding {
  /** 이 종목이 속한 가상계좌의 범례 인덱스(0-base). 블록 색을 범례와 맞추는 데 쓴다. */
  accountIndex: number;
}

export interface StockTreemapProps {
  holdings: StockTreemapHolding[];
  loading?: boolean;
}

function Placeholder({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        minHeight: 160,
        borderRadius: '16px',
        border: `1px dashed ${color.borderMuted}`,
        backgroundColor: color.bg,
        display: 'grid',
        placeItems: 'center',
        color: color.textSecondary,
        fontSize: '0.8125rem',
      }}
    >
      {children}
    </Box>
  );
}

/**
 * Home "자산 현황" 카드 — 가상계좌 전체의 보유 종목을 평가금액 비중으로 나눈
 * 트리맵. VirtualAccountScreen의 FolderTreemap과 같은 sqrt 스케일 flex 레이아웃을
 * 쓰되, 계좌 하나가 아니라 4개 계좌를 합쳐서 보여주는 홈 전용 버전이다.
 * 블록 색은 왼쪽 범례(ACCOUNT_LEGEND_COLORS)와 계좌별로 맞춰, 어느 종목이 어느
 * 계좌 소속인지 색으로 구분할 수 있게 한다.
 */
export function StockTreemap({ holdings, loading = false }: StockTreemapProps) {
  if (loading) {
    return <Placeholder>불러오는 중...</Placeholder>;
  }

  if (holdings.length === 0) {
    return <Placeholder>보유 중인 종목이 없어요.</Placeholder>;
  }

  const sorted = [...holdings].sort(
    (a, b) => b.evaluationAmount - a.evaluationAmount,
  );
  const weights = sorted.map((h) => Math.sqrt(Math.max(h.evaluationAmount, 1)));

  return (
    <Box
      sx={{ display: 'flex', gap: '2px', flex: 1, minWidth: 0, minHeight: 160 }}
    >
      {sorted.map((h, i) => (
        <Box
          key={h.stockCode}
          sx={{
            flex: weights[i],
            minWidth: 56,
            borderRadius: '12px',
            bgcolor:
              ACCOUNT_LEGEND_COLORS[
                h.accountIndex % ACCOUNT_LEGEND_COLORS.length
              ],
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            p: 1.5,
            overflow: 'hidden',
          }}
        >
          <Typography
            noWrap
            sx={{
              fontSize: i === 0 ? '0.9375rem' : '0.75rem',
              fontWeight: 700,
              color: color.ink,
            }}
          >
            {h.stockName}
          </Typography>
          {i === 0 && (
            <>
              <Typography
                noWrap
                sx={{ fontSize: '0.8125rem', color: color.text }}
              >
                {formatWon(h.evaluationAmount)}
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: h.returnRate >= 0 ? color.priceUp : color.priceDown,
                }}
              >
                {h.returnRate >= 0 ? '+' : ''}
                {h.returnRate}%
              </Typography>
            </>
          )}
        </Box>
      ))}
    </Box>
  );
}

export default StockTreemap;
