import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { BaseCard } from '../../../components/BaseCard';
import type { VirtualAccountAssetSummary } from '../../../features/assets/assetsApi';
import { formatWon } from '../../account/mock-data';
import { tokens } from '../../../theme/tokens';
import { StockTreemap, type StockTreemapHolding } from './StockTreemap';
import { ACCOUNT_LEGEND_COLORS } from './accountColors';

const { color } = tokens;

const MAX_ACCOUNT_SLOTS = 4;

export interface AssetStatusCardProps {
  /** GET /assets/portfolios 기반 가상계좌 1~4의 이름·총자산. 존재하는 계좌만 담겨 온다. */
  accounts: VirtualAccountAssetSummary[];
  loading?: boolean;
}

/** Home 화면 가운데 상단 — 가상계좌 4개 이름·총자산 범례 + 보유 종목 트리맵. */
export function AssetStatusCard({
  accounts,
  loading = false,
}: AssetStatusCardProps) {
  const treemapHoldings: StockTreemapHolding[] = accounts.flatMap(
    (account, accountIndex) =>
      account.holdings.map((holding) => ({ ...holding, accountIndex })),
  );

  return (
    <BaseCard sx={{ p: 3 }}>
      <Typography
        sx={{ fontSize: '1rem', fontWeight: 700, color: color.ink, mb: 2 }}
      >
        자산 현황
      </Typography>
      <Box sx={{ display: 'flex', gap: 3 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 1.5,
            flexShrink: 0,
            minWidth: 160,
          }}
        >
          {Array.from({ length: MAX_ACCOUNT_SLOTS }, (_, i) => {
            const account = accounts[i];
            return (
              <Box
                key={i}
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '3px',
                    flexShrink: 0,
                    bgcolor: account
                      ? ACCOUNT_LEGEND_COLORS[i % ACCOUNT_LEGEND_COLORS.length]
                      : color.borderMuted,
                  }}
                />
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    noWrap
                    sx={{ fontSize: '0.6875rem', color: color.textSecondary }}
                  >
                    {account ? account.name : `${i + 1}계좌`}
                  </Typography>
                  {loading ? (
                    <Typography
                      sx={{ fontSize: '0.8125rem', color: color.textSecondary }}
                    >
                      불러오는 중...
                    </Typography>
                  ) : account ? (
                    <Typography
                      sx={{
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        color: color.ink,
                      }}
                    >
                      {formatWon(account.totalAsset)}
                    </Typography>
                  ) : (
                    <Typography
                      sx={{ fontSize: '0.8125rem', color: color.mutedGray }}
                    >
                      계좌가 존재하지 않습니다
                    </Typography>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>

        <StockTreemap holdings={treemapHoldings} loading={loading} />
      </Box>
    </BaseCard>
  );
}

export default AssetStatusCard;
