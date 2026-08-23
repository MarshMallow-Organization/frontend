import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { BaseCard } from '../../components/BaseCard';
import { Chip } from '../../components/Chip';
import type { HoldingStock } from '../../types/account';
import { formatWon } from './mock-data';
import { tokens } from '../../theme/tokens';

const { color } = tokens;

export interface AssetStatusScreenProps {
  holdings: HoldingStock[];
  onHide: (stockName: string) => void;
}

// Figma 338:2982: "주 계좌"(보유 총액 리스트)와 "보유 자산"(히트맵) 좌우 2카드 구조.
// 디자이너 메모: "따로 추가적인 계좌는 불러올 수 없다" → 계좌 불러오기는 비활성 표시만.
export function AssetStatusScreen({
  holdings,
  onHide,
}: AssetStatusScreenProps) {
  const [heatmapMode, setHeatmapMode] = useState<'asset' | 'amount'>('asset');
  const total = holdings.reduce((sum, h) => sum + h.amount, 0);

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
      <BaseCard sx={{ p: 3, width: 320, flexShrink: 0 }}>
        <Typography
          sx={{ fontSize: '1rem', fontWeight: 700, color: color.ink, mb: 2 }}
        >
          주 계좌
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                bgcolor: color.iconBoxBg,
                flexShrink: 0,
              }}
            />
            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: '1.0625rem',
                  fontWeight: 600,
                  color: color.ink,
                }}
              >
                {formatWon(total)}
              </Typography>
              <Typography
                sx={{ fontSize: '0.6875rem', color: color.holdingsSub }}
              >
                총자산
              </Typography>
            </Box>
          </Box>

          {holdings.map((h) => (
            <Box
              key={h.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                py: 1,
                borderTop: `1px solid ${color.border}`,
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '8px',
                  bgcolor: color.iconBoxBg,
                  flexShrink: 0,
                }}
              />
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  sx={{
                    fontSize: '1.0625rem',
                    fontWeight: 600,
                    color: color.ink,
                  }}
                >
                  {formatWon(h.amount)}
                </Typography>
                <Typography
                  sx={{ fontSize: '0.6875rem', color: color.holdingsSub }}
                >
                  {h.name}
                </Typography>
              </Box>
              <Chip
                appVariant="outlineGray"
                label="숨기기"
                onClick={() => onHide(h.name)}
                sx={{ height: 26, fontSize: '0.6875rem', cursor: 'pointer' }}
              />
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.5,
            mt: 2,
            pt: 1.5,
            borderTop: `1px solid ${color.border}`,
            color: color.text,
          }}
        >
          <Typography sx={{ fontSize: '0.75rem' }}>계좌 불러오기</Typography>
          <KeyboardArrowUpIcon sx={{ fontSize: 18 }} />
        </Box>
      </BaseCard>

      <BaseCard sx={{ p: 3, flex: 1, minWidth: 0 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Typography
            sx={{ fontSize: '1rem', fontWeight: 700, color: color.ink }}
          >
            보유 자산
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: color.textSecondary }}>
            오늘 00:00 기준
          </Typography>
        </Box>

        <Box
          sx={{
            height: 320,
            borderRadius: '16px',
            border: `1px dashed ${color.borderMuted}`,
            backgroundColor: color.bg,
            display: 'grid',
            placeItems: 'center',
            color: color.textSecondary,
            fontSize: '0.875rem',
          }}
        >
          히트맵
        </Box>
        <Typography
          sx={{ fontSize: '0.6875rem', color: color.textSecondary, mt: 1.5 }}
        >
          맵의 크기는 금액이 아닌 보유 비중만을 나타내요.
        </Typography>

        <Box
          sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}
        >
          <Chip
            appVariant={heatmapMode === 'amount' ? 'outlineGray' : 'filledCyan'}
            label="보유 자산"
            onClick={() => setHeatmapMode('asset')}
            sx={{ height: 28, fontSize: '0.6875rem', cursor: 'pointer' }}
          />
          <Chip
            appVariant="outlineGray"
            label="보유 금액"
            onClick={() => setHeatmapMode('amount')}
            sx={{ height: 28, fontSize: '0.6875rem', cursor: 'pointer' }}
          />
        </Box>
      </BaseCard>
    </Box>
  );
}

export default AssetStatusScreen;
