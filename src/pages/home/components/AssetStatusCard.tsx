import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { BaseCard } from '../../../components/BaseCard';
import { ListRow } from '../../../components/ListRow';
import { Chip } from '../../../components/Chip';
import type { AccountRow } from '../../../types/account';
import { formatWon } from '../../account/mock-data';
import { tokens } from '../../../theme/tokens';

const { color } = tokens;

export interface AssetStatusCardProps {
  accounts: AccountRow[];
}

/** Home 화면 가운데 상단 — 주 계좌 / 가상계좌 / 총 보유금액 / 주식 평가금액 요약. */
export function AssetStatusCard({ accounts }: AssetStatusCardProps) {
  return (
    <BaseCard sx={{ p: 3 }}>
      <Typography
        sx={{ fontSize: '1rem', fontWeight: 700, color: color.ink, mb: 2 }}
      >
        자산 현황 (주 계좌 / 가상계좌 / 총 보유금액 / 주식 평가금액)
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: 2,
        }}
      >
        {accounts.map((acc) => (
          <ListRow
            key={acc.id}
            leading={
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  bgcolor: color.iconBoxBg,
                }}
              />
            }
            title={formatWon(acc.amount)}
            titleSx={{ fontSize: '0.9375rem', fontWeight: 600 }}
            subtitle={acc.bankName}
            subtitleSx={{ fontSize: '0.75rem' }}
            trailing={
              <Chip
                appVariant="outlineGray"
                label="상세"
                sx={{ height: 30, fontSize: '0.6875rem' }}
              />
            }
          />
        ))}
      </Box>
    </BaseCard>
  );
}

export default AssetStatusCard;
