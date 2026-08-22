import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { BaseCard } from '../../components/BaseCard';
import { Chip } from '../../components/Chip';
import type { HiddenStock } from '../../types/account';
import { tokens } from '../../theme/tokens';

const { color } = tokens;

export interface HideListScreenProps {
  hiddenStocks: HiddenStock[];
  onStartHide: () => void;
}

// Figma 339:1317: 첫 항목(테슬라)=blue, 둘째(인텔)=amber. 3번째부터는 순환 배정.
const ICON_COLORS = [
  color.accentBlue,
  color.hideIconAmber,
  color.selected,
  color.sell,
];

// 디자이너 메모: "며칠 뒤에 다시 보이게 할 것인지" 기획 미확정
// → remainingDays는 DEFAULT_HIDE_DURATION_DAYS 기반, 기획 확정 시 mock-data.ts만 교체
export function HideListScreen({
  hiddenStocks,
  onStartHide,
}: HideListScreenProps) {
  return (
    <BaseCard sx={{ p: 3 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2.5,
        }}
      >
        <Typography
          sx={{ fontSize: '1rem', fontWeight: 700, color: color.ink }}
        >
          숨기기 현황
        </Typography>
        <Chip
          appVariant="outlineGray"
          label="숨긴 종목 열람"
          onClick={onStartHide}
          sx={{ height: 34, fontSize: '0.75rem', cursor: 'pointer' }}
        />
      </Box>

      {hiddenStocks.length === 0 ? (
        <Box
          sx={{
            height: 128,
            display: 'grid',
            placeItems: 'center',
            color: color.mutedGray,
            fontSize: '0.875rem',
          }}
        >
          숨겨진 종목이 없어요.
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 2,
          }}
        >
          {hiddenStocks.map((s, i) => (
            <Box
              key={s.id}
              sx={{
                position: 'relative',
                borderRadius: '12px',
                border: `1px solid ${color.border}`,
                backgroundColor: color.bg,
                p: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '8px',
                  bgcolor: ICON_COLORS[i % ICON_COLORS.length],
                  flexShrink: 0,
                }}
              />
              <Typography
                sx={{
                  fontSize: '1.0625rem',
                  fontWeight: 600,
                  color: color.ink,
                }}
              >
                {s.name}
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  color: color.ink,
                  ml: 'auto',
                }}
              >
                남은 시간: {s.remainingDays}일
              </Typography>
              <Typography
                sx={{
                  position: 'absolute',
                  right: 12,
                  bottom: 6,
                  fontSize: '0.625rem',
                  color: color.textSecondary,
                }}
              >
                숨긴 날짜: {s.hiddenDate}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </BaseCard>
  );
}

export default HideListScreen;
