import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { BaseCard } from '../../components/BaseCard';
import { Chip } from '../../components/Chip';
import type { HiddenStock } from '../../types/account';
import { tokens } from '../../theme/tokens';

const { color } = tokens;

export interface HideListScreenProps {
  hiddenStocks: HiddenStock[];
  /** true면 숨긴 종목 목록이 화면에 펼쳐진 상태. */
  revealed: boolean;
  onToggleReveal: () => void;
  /** 펼쳐진 목록에서 종목을 클릭해 숨김을 해제한다. */
  onUnhide: (stock: HiddenStock) => void;
  /** true면 GET /users/me/hidden-stocks를 아직 불러오는 중. */
  loading?: boolean;
}

// Figma 339:1317: 첫 항목(테슬라)=blue, 둘째(인텔)=amber. 3번째부터는 순환 배정.
const ICON_COLORS = [
  color.accentBlue,
  color.hideIconAmber,
  color.selected,
  color.sell,
];

// 디자이너 메모: "며칠 뒤에 다시 보이게 할 것인지" 기획 미확정
// → remainingDays는 GET /users/me/hidden-stocks의 hiddenUntil로 계산한다.
//
// 숨긴 종목은 평소엔 화면에 노출되지 않는다. "숨긴 종목 열람" 버튼을 누르면
// 문구를 입력해야 하는 확인 화면(HideConfirmScreen)을 거쳐 목록이 펼쳐지고,
// 펼쳐진 카드를 클릭해도 같은 방식으로 문구를 입력해야 숨김이 해제된다(새
// 숨김 대상을 만드는 동작이 아니다 — 그 흐름은 보유 종목 화면의 "숨기기"
// 버튼이 담당한다). 실제 열람/해제 확인 로직은 AccountPage가 갖고 있다.
export function HideListScreen({
  hiddenStocks,
  revealed,
  onToggleReveal,
  onUnhide,
  loading = false,
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
          appVariant={revealed ? 'filledCyan' : 'outlineGray'}
          label={revealed ? '숨긴 목록 접기' : '숨긴 종목 열람'}
          onClick={onToggleReveal}
          sx={{ height: 34, fontSize: '0.75rem', cursor: 'pointer' }}
        />
      </Box>

      {loading ? (
        <Box
          sx={{
            height: 128,
            display: 'grid',
            placeItems: 'center',
            color: color.mutedGray,
            fontSize: '0.875rem',
          }}
        >
          불러오는 중이에요...
        </Box>
      ) : !revealed ? (
        <Box
          sx={{
            height: 128,
            display: 'grid',
            placeItems: 'center',
            color: color.mutedGray,
            fontSize: '0.875rem',
          }}
        >
          숨긴 종목은 평소에는 보이지 않아요. &apos;숨긴 종목 열람&apos;을 눌러
          확인하세요.
        </Box>
      ) : hiddenStocks.length === 0 ? (
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
              component="button"
              type="button"
              onClick={() => onUnhide(s)}
              aria-label={`${s.name} 숨김 해제`}
              sx={{
                position: 'relative',
                borderRadius: '12px',
                border: `1px solid ${color.border}`,
                backgroundColor: color.bg,
                p: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                cursor: 'pointer',
                textAlign: 'left',
                font: 'inherit',
                '&:hover': { backgroundColor: color.border },
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
              <Box sx={{ ml: 'auto', textAlign: 'right' }}>
                <Typography
                  sx={{
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: color.selected,
                  }}
                >
                  숨김 해제
                </Typography>
                <Typography
                  sx={{
                    fontSize: '0.6875rem',
                    color: color.textSecondary,
                    mt: 0.25,
                  }}
                >
                  남은 시간: {s.remainingDays}일
                </Typography>
              </Box>
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
