import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { JournalCard } from './JournalCard';
import type { TradeJournalItem } from '../types';
import { tokens } from '../../../theme/tokens';
import { LAYOUT } from '../layout';

const { color, fontFamily } = tokens;
const { list } = LAYOUT;

export interface JournalCardListProps {
  items: TradeJournalItem[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  listTitle: string;
}

export function JournalCardList({
  items,
  selectedId,
  onSelect,
  listTitle,
}: JournalCardListProps) {
  return (
    <Box
      sx={{
        flex: `0 0 ${list.width}px`,
        maxWidth: list.width,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        fontFamily,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 1.5 }}>
        <Typography
          sx={{
            fontSize: list.titleSize,
            fontWeight: 600,
            color: color.ink,
          }}
        >
          {listTitle}
        </Typography>
        <Typography
          sx={{ fontSize: list.countSize, color: color.textSecondary }}
        >
          ({items.length}건)
        </Typography>
      </Box>

      <Stack
        spacing={list.gap}
        sx={{
          flex: 1,
          overflowY: 'auto',
          pr: 1,
          pb: 2,
        }}
      >
        {items.length === 0 ? (
          <Typography
            sx={{ color: color.mutedGray, mt: 3, fontSize: '0.875rem' }}
          >
            해당하는 거래일지가 없습니다.
          </Typography>
        ) : (
          items.map((item) => (
            <JournalCard
              key={item.id}
              item={item}
              selected={selectedId === item.id}
              onSelect={() => onSelect(item.id)}
            />
          ))
        )}
      </Stack>
    </Box>
  );
}
